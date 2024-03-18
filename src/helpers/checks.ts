import type { MonitorAllData, MonitorDailyChecksItem } from '#src/worker/_helpers/store'

export type Status = null | 'all-good' | 'all-incidents' | 'has-incident'

export function getChecksItemStatus(checksItem?: MonitorDailyChecksItem) {
  let status: Status = null
  if (checksItem) {
    if (checksItem.fails === 0) {
      status = 'all-good'
    }
    else {
      const checksTotalCount = Object.values(checksItem.stats).reduce((previous, current) => {
        return previous + current.count
      }, 0)
      if (checksItem.fails === checksTotalCount) {
        status = 'all-incidents'
      }
      else {
        status = 'has-incident'
      }
    }
  }
  return status
}

export function getTargetDateChecksItem(monitorAllData: MonitorAllData, date: string) {
  return monitorAllData.checks.find((item) => item.date === date)
}

export type RenderStatus = Status | 'latest-incident'

export function getChecksItemRenderStatus(monitorAllData: MonitorAllData, date: string) {
  let status: RenderStatus = null

  const targetDateChecksItem = getTargetDateChecksItem(monitorAllData, date)

  const checksItemStatus = getChecksItemStatus(targetDateChecksItem)

  if (monitorAllData.lastCheck.operational === false) {
    status = 'latest-incident'
  }
  else {
    status = checksItemStatus
  }

  return status
}
