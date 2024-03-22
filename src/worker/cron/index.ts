/* eslint-disable no-console */
import { getCheckLocation } from '../_helpers/location'
import { getStore, prepareMonitors, upsertKvStore } from '../_helpers/store'
import { getNotificationCount, getNotifications } from '../_helpers/notifications'
import { getDate } from '../_helpers/datetime'

import { Subrequests } from './Subrequests'

import type { MonitorDailyChecksItem, MonitorLastCheck } from '../_helpers/store'

import { config } from '#src/config'

const defaultSubrequestsLimit = 50

export async function handleCronTrigger(event: FetchEvent) {
  const subrequests = new Subrequests()
  const checkedIds: string[] = []
  let allOperational = true

  const checkLocation = await getCheckLocation()
  subrequests.required()
  const checkDay = getDate()
  const { kvData } = await getStore()
  subrequests.required()

  const { uncheckMonitors, lastCheckedMonitorIds, allMonitors } = await prepareMonitors()
  console.debug('uncheckMonitors:', uncheckMonitors)

  for (const monitor of uncheckMonitors) {
    const notificationCount = getNotificationCount()
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

    if (monitorStatusChanged) {
      const notifications = getNotifications(monitor, monitorOperational, () => {
        subrequests.notified()
      })
      event.waitUntil(Promise.allSettled(notifications.map((item) => item())))
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
      time: Date.now(),
    }

    const targetMonitorHistoryDataChecksItem = kvData.monitorHistoryData?.[monitor.id]?.checks.find((item) => {
      return item.date === checkDay
    })

    const monitorHistoryDataChecksItem: MonitorDailyChecksItem = targetMonitorHistoryDataChecksItem || {
      date: checkDay,
      fails: 0,
      stats: {},
    }
    monitorHistoryDataChecksItem.fails = (monitorHistoryDataChecksItem.fails || 0) + (monitorOperational ? 0 : 1)

    if (config.settings.collectResponseTimes && monitorOperational) {
      if (Object.keys(monitorHistoryDataChecksItem.stats).length === 0) {
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
      const count = monitorHistoryDataChecksItem.stats[checkLocation]!.count + 1
      const totalMs = monitorHistoryDataChecksItem.stats[checkLocation]!.totalMs + requestTime

      monitorHistoryDataChecksItem.stats[checkLocation] = {
        count,
        totalMs,
      }
    }

    if (!kvData.monitorHistoryData) {
      kvData.monitorHistoryData = {}
    }

    kvData.monitorHistoryData[monitor.id] = {
      checks: [...(kvData.monitorHistoryData[monitor.id]?.checks || []).filter((item) => {
        return item.date !== monitorHistoryDataChecksItem.date
      }), monitorHistoryDataChecksItem],
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
      ids: [...lastCheckedMonitorIds, ...checkedIds],
      allOperational,
    },
  }

  await upsertKvStore(kvData, allMonitors)
  return new Response('OK')
}
