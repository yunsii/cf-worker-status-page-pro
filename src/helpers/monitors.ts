import Papa from 'papaparse'

import type { Monitor } from '#src/types'

import { config } from '#src/config'

export const fetchFailedMsg = 'Fetch failed'

export default async function getRemoteMonitors() {
  if (!config.monitorsCsvUrl) {
    return []
  }
  const response = await fetch(config.monitorsCsvUrl)

  if (!response.ok) {
    throw new Error(fetchFailedMsg)
  }

  const csvString = await response.text()
  const parsedResult = Papa.parse(csvString, { header: true, transform: (value, field) => {
    if (field === 'followRedirect') {
      return !!value
    }
    return value
  } })
  return parsedResult.data as Monitor[]
}
