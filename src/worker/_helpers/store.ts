import { getHistoryDates } from './datetime'

import type { Monitor } from '#src/types'

import { config } from '#src/config'
import { aMiB, memorySizeOf } from '#src/helpers/memory'
import { ensureWorkerEnv } from '#src/worker/_helpers'

export const WORKER_SUBREQUESTS_LIMIT = 50

export const DATA_KEY = 'data-v1'
export const REMOTE_MONITORS_KEY = 'remote-monitors-v1'

export interface MonitorLastCheck {
  /** Timestamp(ms) */
  time?: number
  operational: boolean
  status: number
  statusText: string
}

export interface DataV1LastCheck {
  /** Timestamp(ms) */
  time: number
  location: string
  /** Requests has been initiated, subrequest including required/check/notify request */
  subrequests: {
    total: number
    /** Monitor notified subrequests has been initiated */
    notified: number
    /** Monitor required subrequests has been initiated */
    required: number
  }
  /** Monitor check subrequests has been initiated, store with monitor id */
  checks: {
    ids: string[]
    allOperational: boolean
  }
}

export interface MonitorDailyChecksItem {
  date: string
  fails: number
  /**
   * Stats for operational monitor
   *
   * Key: location, No value if config.settings.collectResponseTimes=false
   */
  stats: Record<string, {
    count: number
    totalMs: number
    // totalMs / count
    // avgMs: number
  }>
}

export interface MonitorAllData {
  checks: MonitorDailyChecksItem[]
  firstCheck: string
  lastCheck: MonitorLastCheck
}

export interface DataV1 {
  /** Key: monitor id */
  monitorHistoryData?: Record<string, MonitorAllData>
  lastUpdate?: DataV1LastCheck
}

export async function upsertRemoteMonitors(value: Monitor[] | null) {
  ensureWorkerEnv()
  if (value === null) {
    await KV_STORE.delete(REMOTE_MONITORS_KEY)
    return
  }
  await KV_STORE.put(REMOTE_MONITORS_KEY, JSON.stringify(value))
}

export async function upsertData(value: DataV1 | null, allMonitors: Monitor[]) {
  ensureWorkerEnv()
  if (value === null) {
    await KV_STORE.delete(DATA_KEY)
    return
  }
  const cleanedValue = await cleanDataV1(value, allMonitors)
  await KV_STORE.put(DATA_KEY, JSON.stringify(cleanedValue))
}

export async function cleanDataV1(value: DataV1, allMonitors: Monitor[]) {
  const { bytes } = memorySizeOf(JSON.stringify(value))

  // https://developers.cloudflare.com/kv/platform/limits/
  // Value max size 25 MiB, in case of exceptions, we clean data when bytes bigger than 24 MiB.
  if (bytes < 24 * aMiB) {
    return value
  }

  const { monitorHistoryData, ...rest } = value

  if (!monitorHistoryData) {
    return value
  }

  const historyDates = getHistoryDates()

  return {
    ...rest,
    ...(Object.keys(monitorHistoryData).filter((item) => {
      // Remove monitor data from state if missing in monitors config
      return allMonitors.some((monitorItem) => monitorItem.id === item)
    }).reduce<Record<string, MonitorAllData>>((previous, current) => {
      const { checks, ...restHistoryData } = monitorHistoryData[current]
      return {
        ...previous,
        [current]: {
          ...restHistoryData,
          // Remove dates older than config.settings.displayDays
          checks: checks.filter((item) => {
            return historyDates.includes(item.date)
          }),
        },
      }
    }, {})),
  }
}

async function getStore() {
  ensureWorkerEnv()
  // https://developers.cloudflare.com/kv/api/read-key-value-pairs/
  let kvData = await KV_STORE.get<DataV1>(DATA_KEY, 'json')
  if (!kvData) {
    kvData = {}
  }
  return { kvData }
}

export async function getAllMonitors(useRemoteMonitors = true) {
  if (useRemoteMonitors) {
    const remoteMonitors = await KV_STORE.get<Monitor[]>(REMOTE_MONITORS_KEY, 'json')
    return [...config.monitors, ...(remoteMonitors || [])]
  }
  return config.monitors
}

export async function getCoreData(useRemoteMonitors?: boolean) {
  const [allMonitors, { kvData }] = await Promise.all([getAllMonitors(useRemoteMonitors), getStore()])
  return {
    allMonitors,
    kvData,
  }
}

export async function prepareData() {
  const { allMonitors, kvData } = await getCoreData()

  const lastCheckedMonitorIds = kvData.lastUpdate?.checks.ids || []
  const uncheckMonitors = lastCheckedMonitorIds.length === 0
    ? allMonitors
    : allMonitors.filter((item) => {
      return !lastCheckedMonitorIds.includes(item.id)
    })

  if (uncheckMonitors.length === 0) {
    return {
      kvData,
      allMonitors,
      uncheckMonitors: allMonitors,
      lastCheckedMonitorIds: [],
    }
  }

  return {
    kvData,
    allMonitors,
    uncheckMonitors,
    lastCheckedMonitorIds,
  }
}
