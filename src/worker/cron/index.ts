/* eslint-disable no-console */
import { getCheckLocation } from '../_helpers/location'
import { getStore, prepareMonitors, upsertKvStore } from '../_helpers/store'
import { getNotifications } from '../_helpers/notifications'

import { Subrequests } from './Subrequests'

import type { MonitorHistoryDataChecksItem, MonitorLastCheck } from '../_helpers/store'

import { config } from '#src/config'

const defaultSubrequestsLimit = 50

function getDate() {
  return new Date().toISOString().split('T')[0]
}

export async function handleCronTrigger(event: FetchEvent) {
  const subrequests = new Subrequests()
  const checkedIds: string[] = []
  let allOperational = true

  const checkLocation = await getCheckLocation()
  subrequests.required()
  const checkDay = getDate()
  const { kvData } = await getStore()
  subrequests.required()

  const { uncheckMonitors } = await prepareMonitors()
  console.debug('uncheckMonitors:', uncheckMonitors)

  for (const monitor of uncheckMonitors) {
    // For count only
    const notificationCount = getNotifications(monitor, false).length
    const restSubrequestCount = (config.settings.subrequestsLimit || defaultSubrequestsLimit) - subrequests.total
    const monitorMaxRequiredSubrequestCount = 1 + notificationCount

    // Including a kv write subrequest
    if (restSubrequestCount < monitorMaxRequiredSubrequestCount + 1) {
      break
    }

    console.log(`Checking ${monitor.name || monitor.id} ...`)

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
    const monitorStatusChanged = kvData.monitorHistoryData?.[monitor.id]?.lastCheck.operational !== monitorOperational

    const notifications = getNotifications(monitor, monitorOperational, () => {
      subrequests.notified()
    })

    if (monitorStatusChanged) {
      console.log('monitorStatusChanged to', monitorOperational)
      event.waitUntil(Promise.allSettled(notifications))
    }

    subrequests.checked()
    checkedIds.push(monitor.id)
    if (!monitorOperational) {
      allOperational = false
    }

    const monitorLastCheck: MonitorLastCheck = {
      status: checkResponse.status,
      statusText: checkResponse.statusText,
      operational: monitorOperational,
    }

    const targetMonitorHistoryDataChecksItem = kvData.monitorHistoryData?.[monitor.id]?.checks.find((item) => {
      return item.date === checkDay
    })

    const monitorHistoryDataChecksItem: MonitorHistoryDataChecksItem = {
      date: checkDay,
      fails: (targetMonitorHistoryDataChecksItem?.fails || 0) + (monitorOperational ? 0 : 1),
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
      checks: [...kvData.monitorHistoryData[monitor.id]?.checks || [], monitorHistoryDataChecksItem],
      firstCheck: kvData.monitorHistoryData[monitor.id]?.firstCheck || checkDay,
      lastCheck: monitorLastCheck,
    }
  }

  // Call upsertKvStore also as a subrequest,
  // but only it have to count in advance.
  subrequests.required()

  kvData.lastUpdate = {
    time: Date.now(),
    location: checkLocation,
    subrequests: {
      total: subrequests.total,
      required: subrequests.requiredCount,
      notified: subrequests.notifiedCount,
    },
    checks: {
      ids: checkedIds,
      allOperational,
    },
  }

  await upsertKvStore(kvData)
  return new Response('OK')
}
