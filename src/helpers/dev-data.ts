import type { DataV1 } from '#src/worker/_helpers/store'

import { getDate } from '#src/worker/_helpers/datetime'

export function getDevKvData() {
  const date = getDate()

  const result = {
    monitorHistoryData: {
      'workers.cloudflare.com': {
        checks:
        [
          { date, fails: 0, stats: { MEL: { count: 156, totalMs: 207819 }, EWR: { count: 94, totalMs: 34242 } } },
        ],
        firstCheck: '2024-03-11',
        lastCheck: { status: 200, statusText: 'OK', operational: true },
      },
      'www.cloudflare.com': {
        checks:
        [
          { date, fails: 0, stats: { MEL: { count: 156, totalMs: 8166 }, EWR: { count: 94, totalMs: 8911 } } },
        ],
        firstCheck: '2024-03-11',
        lastCheck: { status: 200, statusText: 'OK', operational: true },
      },
      'blog.cloudflare.com': {
        checks:
        [
          { date, fails: 0, stats: { MEL: { count: 156, totalMs: 37479 }, EWR: { count: 94, totalMs: 21724 } } },
        ],
        firstCheck: '2024-03-11',
        lastCheck: { status: 200, statusText: 'OK', operational: true },
      },
      'google': { checks:
        [
          { date, fails: 0, stats: { MEL: { count: 156, totalMs: 33435 }, EWR: { count: 94, totalMs: 22597 } } },
        ], firstCheck: '2024-03-11', lastCheck: { status: 200, statusText: 'OK', operational: true } },
      'bilibili': {
        checks:
        [
          { date, fails: 0, stats: { MEL: { count: 156, totalMs: 193258 }, EWR: { count: 94, totalMs: 84402 } } },
        ],
        firstCheck: '2024-03-11',
        lastCheck: { status: 200, statusText: 'OK', operational: true },
      },
      'GitHub': {
        checks:
        [
          { date, fails: 0, stats: { MEL: { count: 155, totalMs: 7816 }, SIN: { count: 1, totalMs: 35 }, EWR: { count: 94, totalMs: 4397 } } },
        ],
        firstCheck: '2024-03-11',
        lastCheck: { status: 200, statusText: 'OK', operational: true },
      },
    },
    lastUpdate: { time: 1710676258473, location: 'DTW', subrequests: { total: 9, required: 3, notified: 0 }, checks: { ids: ['workers.cloudflare.com', 'www.cloudflare.com', 'blog.cloudflare.com', 'google', 'bilibili', 'GitHub'], allOperational: true } },
  } as DataV1

  return result
}
