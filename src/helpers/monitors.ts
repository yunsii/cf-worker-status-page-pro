import Papa from 'papaparse'

import type { Monitor } from '#src/types'

import { config } from '#src/config'
import { isWorkerEnv } from '#src/worker/_helpers'

export default async function getRemoteMonitors() {
  if (!config.monitorsCsvUrl || !isWorkerEnv) {
    return []
  }
  const response = await fetch(config.monitorsCsvUrl, {
    cf: {
      cacheTtlByStatus: {
        // Cache 10 minutes
        '200-299': 600,
        '404': 1,
        '500-599': 0,
      },
    },
  })
  const csvString = await response.text()
  const parsedResult = Papa.parse(csvString, { header: true, transform: (value, field) => {
    if (field === 'followRedirect') {
      return !!value
    }
    return value
  } })
  return parsedResult.data as Monitor[]
}
