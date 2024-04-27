import type { PageContext } from 'vike/types'
import type { DataV1 } from '#src/worker/_helpers/store'

import { getAllMonitors, getCoreData } from '#src/worker/_helpers/store'
import { isWorkerEnv } from '#src/worker/_helpers'
import { getDevKvData } from '#src/helpers/dev-data'

export async function data(pageContext: PageContext) {
  const { urlParsed } = pageContext
  // Worker env always use remote monitors
  const useRemoteMonitors = isWorkerEnv || !('no-remote-monitors' in urlParsed.search)

  try {
    const { allMonitors, kvData } = await getCoreData(useRemoteMonitors)
    const { lastUpdate, monitorHistoryData } = kvData

    if (!monitorHistoryData) {
      return { allMonitors, kvData }
    }

    return {
      allMonitors,
      kvData: {
        monitorHistoryData: Object.keys(monitorHistoryData).reduce((previous, current) => {
          if (!allMonitors.some((item) => item.id === current)) {
            return previous
          }

          return {
            ...previous,
            [current]: monitorHistoryData[current],
          }
        }, {}),
        lastUpdate,
      } as DataV1,
    }
  }
  catch (err) {
    if (isWorkerEnv) {
      throw err
    }
    // eslint-disable-next-line no-console
    console.debug('Error ignored in non worker env.')

    const allMonitors = await getAllMonitors(useRemoteMonitors)
    if ('no-data' in urlParsed.search) {
      return { allMonitors, kvData: null }
    }
    return {
      allMonitors,
      kvData: getDevKvData(),
      filter: new URLSearchParams(urlParsed.search).get('filter')?.trim(),
    }
  }
}

export type IndexPageData = Awaited<ReturnType<typeof data>>
