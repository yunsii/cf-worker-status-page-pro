import { config } from '#src/config'
import { ensureWorkerEnv } from '#src/worker/_helpers'

export const WORKER_SUBREQUESTS_LIMIT = 50

export const DATA_KEY = 'data-v1'

export interface MonitorLastCheck {
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

export interface MonitorHistoryDataChecksItem {
  date: string
  fails: number
  /**
   * Stats for operational monitor
   *
   * Key: location, No value if config.settings.collectResponseTimes=false
   */
  stats?: Record<string, {
    count: number
    totalMs: number
    // totalMs / count
    // avgMs: number
  }>
}

export interface DataV1 {
  /** Key: monitor id */
  monitorHistoryData?: Partial<Record<string, {
    checks: MonitorHistoryDataChecksItem[]
    firstCheck: string
    lastCheck: MonitorLastCheck
  }>>
  lastUpdate?: DataV1LastCheck
}

export async function upsertKvStore(value: DataV1 | null) {
  ensureWorkerEnv()
  const result = await (value === null ? KV_STORE.delete(DATA_KEY) : KV_STORE.put(DATA_KEY, JSON.stringify(value)))
  return result
}

export async function getStore() {
  ensureWorkerEnv()
  // https://developers.cloudflare.com/kv/api/read-key-value-pairs/
  let kvData = await KV_STORE.get<DataV1>(DATA_KEY, 'json')
  if (!kvData) {
    kvData = {}
  }
  return { kvData }
}

export async function prepareMonitors() {
  const { kvData } = await getStore()

  const lastCheckedMonitorIds = kvData.lastUpdate?.checks.ids || []
  const uncheckMonitors = lastCheckedMonitorIds.length === 0
    ? config.monitors
    : config.monitors.filter((item) => {
      return !lastCheckedMonitorIds.includes(item.id)
    })

  if (uncheckMonitors.length === 0) {
    return {
      uncheckMonitors: config.monitors,
    }
  }

  return {
    uncheckMonitors,
  }
}
