import type { PageContext } from 'vike/types'
import type { DataV1 } from '#src/worker/_helpers/store'

import { getAllMonitors, getCoreData } from '#src/worker/_helpers/store'
import { isWorkerEnv } from '#src/worker/_helpers'
import { getDevKvData } from '#src/helpers/dev-data'

// Use search param `no-remote-monitors` to prevent load remote monitors
// Use search param `no-data` preview no data page
export async function data(pageContext: PageContext) {
  const { urlParsed } = pageContext
  const searchParams = new URLSearchParams(urlParsed.search)
  const searchParamKeys = Array.from(searchParams.keys())
  // Only use remote monitors in worker env
  const useRemoteMonitors = isWorkerEnv

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
  } catch (err) {
    if (isWorkerEnv) {
      throw err
    }
    // eslint-disable-next-line no-console
    console.debug('Error ignored in non worker env.')

    const allMonitors = await getAllMonitors(useRemoteMonitors)
    if (searchParamKeys.includes('no-data')) {
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
