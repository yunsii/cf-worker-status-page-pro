/* eslint-disable no-console */
import { getCheckLocation } from '../_helpers/location'
import { getStore, prepareMonitors, upsertKvStore } from '../_helpers/store'

import type { MonitorHistoryDataChecksItem, MonitorLastCheck } from '../_helpers/store'

import { config } from '#src/config'

function getDate() {
  return new Date().toISOString().split('T')[0]
}

export async function handleCronTrigger(event: FetchEvent) {
  const checkLocation = await getCheckLocation()
  const checkDay = getDate()
  const { kvData } = await getStore()

  const { uncheckMonitors } = await prepareMonitors()

  for (const monitor of uncheckMonitors) {
    console.log(`Checking ${monitor.name} ...`)

    const requestStartTime = Date.now()
    const checkResponse = await fetch(monitor.url, {
      method: monitor.method || 'GET',
      redirect: monitor.followRedirect ? 'follow' : 'manual',
      headers: {
        'User-Agent': 'cf-worker-status-page-pro',
      },
    })
    const requestTime = Math.round(Date.now() - requestStartTime)

    // Determine whether operational and status changed
    const monitorOperational
    = checkResponse.status === (monitor.expectStatus || 200)
    const monitorStatusChanged
    = kvData.monitorHistoryData?.[monitor.id].lastCheck.operational
    !== monitorOperational

    const monitorLastCheck: MonitorLastCheck = {
      status: checkResponse.status,
      statusText: checkResponse.statusText,
      operational: monitorOperational,
    }

    const targetMonitorHistoryDataChecksItem = kvData.monitorHistoryData?.[monitor.id].checks.find((item) => {
      return item.date === checkDay
    })

    const monitorHistoryDataChecksItem: MonitorHistoryDataChecksItem = {
      date: checkDay,
      fails: (targetMonitorHistoryDataChecksItem?.fails || 0) + (monitorOperational ? 0 : -1),
    }

    if (config.settings.collectResponseTimes && monitorOperational) {
      if (!monitorHistoryDataChecksItem.stats) {
        monitorHistoryDataChecksItem.stats = {
          [checkLocation]: {
            count: 0,
            totalMs: 0,
          },
        }
      }
      if (!(checkLocation in monitorHistoryDataChecksItem.stats)) {
        monitorHistoryDataChecksItem.stats[checkLocation] = {
          count: 0,
          totalMs: 0,
        }
      }
      const target = targetMonitorHistoryDataChecksItem || monitorHistoryDataChecksItem
      const count = target.stats![checkLocation].count + 1
      const totalMs = target.stats![checkLocation].totalMs + requestTime

      monitorHistoryDataChecksItem.stats[checkLocation] = {
        count,
        totalMs,
      }
    }

    if (!kvData.monitorHistoryData) {
      kvData.monitorHistoryData = {}
    }

    kvData.monitorHistoryData[monitor.id] = {
      checks: [...kvData.monitorHistoryData[monitor.id].checks, monitorHistoryDataChecksItem],
      firstCheck: kvData.monitorHistoryData[monitor.id].firstCheck || checkDay,
      lastCheck: monitorLastCheck,
    }
  }

  kvData.lastUpdate = {
    time: Date.now(),
    location: checkLocation,
    requests: 0,
    checks: {
      ids: [],
      allOperational: false,
    },
    notifies: 0,
  }

  await upsertKvStore(kvData)
  return new Response('OK')
}
