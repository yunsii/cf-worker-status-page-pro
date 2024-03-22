import type { PageContext } from 'vike/types'
import type { DataV1 } from '#src/worker/_helpers/store'

import { getAllMonitors, getCoreData } from '#src/worker/_helpers/store'
import { isWorkerEnv } from '#src/worker/_helpers'

export async function data(pageContext: PageContext) {
  const { urlParsed } = pageContext
  // Worker env always use remote monitors
  const useRemoteMonitors = isWorkerEnv || !('no-remote-monitors' in urlParsed.search)

  try {
    const { allMonitors, kvData } = await getCoreData(useRemoteMonitors)
    const { lastUpdate, monitorHistoryData } = kvData

    if (!monitorHistoryData) {
      return kvData
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
      kvData: {
        monitorHistoryData: {
          'workers.cloudflare.com': { checks: [{ date: '2024-03-11', fails: 0, stats: { MEL: { count: 156, totalMs: 207819 }, EWR: { count: 94, totalMs: 34242 } } }, { date: '2024-03-12', fails: 0, stats: { EWR: { count: 182, totalMs: 64796 }, SCL: { count: 184, totalMs: 192428 }, KIX: { count: 263, totalMs: 306854 }, MAD: { count: 91, totalMs: 88465 } } }, { date: '2024-03-13', fails: 0, stats: { MAD: { count: 187, totalMs: 155177 }, DTW: { count: 172, totalMs: 52438 }, TPE: { count: 269, totalMs: 326894 }, WAW: { count: 93, totalMs: 88056 } } }, { date: '2024-03-14', fails: 0, stats: { WAW: { count: 133, totalMs: 124996 }, EWR: { count: 139, totalMs: 46724 }, DFW: { count: 170, totalMs: 42493 }, KIX: { count: 278, totalMs: 314829 } } }, { date: '2024-03-15', fails: 0, stats: { WAW: { count: 176, totalMs: 161034 }, IAH: { count: 6, totalMs: 3051 }, DTW: { count: 176, totalMs: 50369 }, MEL: { count: 269, totalMs: 341545 }, ZRH: { count: 95, totalMs: 98759 } } }, { date: '2024-03-16', fails: 0, stats: { ZRH: { count: 185, totalMs: 179920 }, SCL: { count: 171, totalMs: 166146 }, MEL: { count: 279, totalMs: 349758 }, LHR: { count: 86, totalMs: 67320 } } }, { date: '2024-03-17', fails: 0, stats: { LHR: { count: 178, totalMs: 133167 }, DTW: { count: 179, totalMs: 49658 } } }], firstCheck: '2024-03-11', lastCheck: { status: 200, statusText: 'OK', operational: true } },
          'www.cloudflare.com': { checks: [{ date: '2024-03-11', fails: 0, stats: { MEL: { count: 156, totalMs: 8166 }, EWR: { count: 94, totalMs: 8911 } } }, { date: '2024-03-12', fails: 0, stats: { EWR: { count: 182, totalMs: 14920 }, SCL: { count: 184, totalMs: 14278 }, KIX: { count: 263, totalMs: 20522 }, MAD: { count: 91, totalMs: 9961 } } }, { date: '2024-03-13', fails: 0, stats: { MAD: { count: 187, totalMs: 10493 }, DTW: { count: 172, totalMs: 13914 }, TPE: { count: 269, totalMs: 12516 }, WAW: { count: 93, totalMs: 5919 } } }, { date: '2024-03-14', fails: 0, stats: { WAW: { count: 133, totalMs: 7895 }, EWR: { count: 139, totalMs: 9776 }, DFW: { count: 170, totalMs: 9552 }, KIX: { count: 278, totalMs: 23132 } } }, { date: '2024-03-15', fails: 0, stats: { WAW: { count: 176, totalMs: 8852 }, IAH: { count: 6, totalMs: 513 }, DTW: { count: 176, totalMs: 11084 }, MEL: { count: 269, totalMs: 14192 }, ZRH: { count: 95, totalMs: 10565 } } }, { date: '2024-03-16', fails: 0, stats: { ZRH: { count: 185, totalMs: 11660 }, SCL: { count: 171, totalMs: 9571 }, MEL: { count: 279, totalMs: 15217 }, LHR: { count: 86, totalMs: 6395 } } }, { date: '2024-03-17', fails: 0, stats: { LHR: { count: 178, totalMs: 10922 }, DTW: { count: 179, totalMs: 9388 } } }], firstCheck: '2024-03-11', lastCheck: { status: 200, statusText: 'OK', operational: true } },
          'blog.cloudflare.com': { checks: [{ date: '2024-03-11', fails: 0, stats: { MEL: { count: 156, totalMs: 37479 }, EWR: { count: 94, totalMs: 21724 } } }, { date: '2024-03-12', fails: 22, stats: { EWR: { count: 182, totalMs: 118385 }, SCL: { count: 162, totalMs: 94316 }, KIX: { count: 263, totalMs: 149374 }, MAD: { count: 91, totalMs: 27274 } } }, { date: '2024-03-13', fails: 1, stats: { MAD: { count: 187, totalMs: 44440 }, DTW: { count: 171, totalMs: 91833 }, TPE: { count: 269, totalMs: 43827 }, WAW: { count: 93, totalMs: 16745 } } }, { date: '2024-03-14', fails: 0, stats: { WAW: { count: 133, totalMs: 25047 }, EWR: { count: 139, totalMs: 25172 }, DFW: { count: 170, totalMs: 72643 }, KIX: { count: 278, totalMs: 232273 } } }, { date: '2024-03-15', fails: 0, stats: { WAW: { count: 176, totalMs: 24054 }, IAH: { count: 6, totalMs: 1549 }, DTW: { count: 176, totalMs: 34973 }, MEL: { count: 269, totalMs: 89398 }, ZRH: { count: 95, totalMs: 26471 } } }, { date: '2024-03-16', fails: 0, stats: { ZRH: { count: 185, totalMs: 33723 }, SCL: { count: 171, totalMs: 27671 }, MEL: { count: 279, totalMs: 36913 }, LHR: { count: 86, totalMs: 19077 } } }, { date: '2024-03-17', fails: 0, stats: { LHR: { count: 178, totalMs: 29960 }, DTW: { count: 179, totalMs: 26184 } } }], firstCheck: '2024-03-11', lastCheck: { status: 200, statusText: 'OK', operational: true } },
          'google': { checks: [{ date: '2024-03-11', fails: 0, stats: { MEL: { count: 156, totalMs: 33435 }, EWR: { count: 94, totalMs: 22597 } } }, { date: '2024-03-12', fails: 373, stats: { EWR: { count: 182, totalMs: 21537 }, SCL: { count: 68, totalMs: 4632 }, KIX: { count: 6, totalMs: 624 }, MAD: { count: 91, totalMs: 16768 } } }, { date: '2024-03-13', fails: 265, stats: { MAD: { count: 187, totalMs: 16580 }, DTW: { count: 113, totalMs: 13465 }, TPE: { count: 90, totalMs: 6198 }, WAW: { count: 66, totalMs: 5729 } } }, { date: '2024-03-14', fails: 432, stats: { WAW: { count: 133, totalMs: 11498 }, EWR: { count: 139, totalMs: 16753 }, DFW: { count: 10, totalMs: 1056 }, KIX: { count: 6, totalMs: 834 } } }, { date: '2024-03-15', fails: 336, stats: { WAW: { count: 88, totalMs: 6921 }, DTW: { count: 176, totalMs: 22592 }, MEL: { count: 35, totalMs: 9056 }, ZRH: { count: 87, totalMs: 11139 } } }, { date: '2024-03-16', fails: 248, stats: { ZRH: { count: 162, totalMs: 17893 }, SCL: { count: 67, totalMs: 5664 }, MEL: { count: 158, totalMs: 38167 }, LHR: { count: 86, totalMs: 7490 } } }, { date: '2024-03-17', fails: 0, stats: { LHR: { count: 178, totalMs: 13211 }, DTW: { count: 179, totalMs: 24610 } } }], firstCheck: '2024-03-11', lastCheck: { status: 200, statusText: 'OK', operational: true } },
          'bilibili': { checks: [{ date: '2024-03-11', fails: 0, stats: { MEL: { count: 156, totalMs: 193258 }, EWR: { count: 94, totalMs: 84402 } } }, { date: '2024-03-12', fails: 0, stats: { EWR: { count: 182, totalMs: 164075 }, SCL: { count: 184, totalMs: 228305 }, KIX: { count: 263, totalMs: 139536 }, MAD: { count: 91, totalMs: 57994 } } }, { date: '2024-03-13', fails: 0, stats: { MAD: { count: 187, totalMs: 98844 }, DTW: { count: 172, totalMs: 134928 }, TPE: { count: 269, totalMs: 225962 }, WAW: { count: 93, totalMs: 62832 } } }, { date: '2024-03-14', fails: 0, stats: { WAW: { count: 133, totalMs: 87040 }, EWR: { count: 139, totalMs: 115685 }, DFW: { count: 170, totalMs: 108955 }, KIX: { count: 278, totalMs: 141834 } } }, { date: '2024-03-15', fails: 0, stats: { WAW: { count: 176, totalMs: 103864 }, IAH: { count: 6, totalMs: 7206 }, DTW: { count: 176, totalMs: 131789 }, MEL: { count: 269, totalMs: 373797 }, ZRH: { count: 95, totalMs: 56376 } } }, { date: '2024-03-16', fails: 1, stats: { ZRH: { count: 185, totalMs: 92766 }, SCL: { count: 171, totalMs: 213526 }, MEL: { count: 278, totalMs: 355881 }, LHR: { count: 86, totalMs: 54931 } } }, { date: '2024-03-17', fails: 1, stats: { LHR: { count: 178, totalMs: 88273 }, DTW: { count: 178, totalMs: 139576 } } }], firstCheck: '2024-03-11', lastCheck: { status: 200, statusText: 'OK', operational: true } },
          'GitHub': { checks: [{ date: '2024-03-11', fails: 0, stats: { MEL: { count: 155, totalMs: 7816 }, SIN: { count: 1, totalMs: 35 }, EWR: { count: 94, totalMs: 4397 } } }, { date: '2024-03-12', fails: 0, stats: { EWR: { count: 182, totalMs: 7931 }, SCL: { count: 184, totalMs: 20746 }, KIX: { count: 263, totalMs: 10316 }, MAD: { count: 91, totalMs: 8108 } } }, { date: '2024-03-13', fails: 0, stats: { MAD: { count: 187, totalMs: 14026 }, DTW: { count: 172, totalMs: 14346 }, TPE: { count: 269, totalMs: 19065 }, WAW: { count: 93, totalMs: 7164 } } }, { date: '2024-03-14', fails: 0, stats: { WAW: { count: 133, totalMs: 9159 }, EWR: { count: 139, totalMs: 5398 }, DFW: { count: 170, totalMs: 14509 }, KIX: { count: 278, totalMs: 13200 } } }, { date: '2024-03-15', fails: 0, stats: { WAW: { count: 176, totalMs: 11598 }, IAH: { count: 6, totalMs: 3143 }, DTW: { count: 176, totalMs: 11130 }, MEL: { count: 269, totalMs: 15618 }, ZRH: { count: 95, totalMs: 3317 } } }, { date: '2024-03-16', fails: 0, stats: { ZRH: { count: 185, totalMs: 4640 }, SCL: { count: 171, totalMs: 23350 }, MEL: { count: 279, totalMs: 12629 }, LHR: { count: 86, totalMs: 2724 } } }, { date: '2024-03-17', fails: 0, stats: { LHR: { count: 178, totalMs: 5157 }, DTW: { count: 179, totalMs: 14782 } } }], firstCheck: '2024-03-11', lastCheck: { status: 200, statusText: 'OK', operational: true } },
        },
        lastUpdate: { time: 1710676258473, location: 'DTW', subrequests: { total: 9, required: 3, notified: 0 }, checks: { ids: ['workers.cloudflare.com', 'www.cloudflare.com', 'blog.cloudflare.com', 'google', 'bilibili', 'GitHub'], allOperational: true } },
      } as DataV1,
    }
  }
}

export type IndexPageData = Awaited<ReturnType<typeof data>>
