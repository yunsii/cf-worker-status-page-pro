import { upsertRemoteMonitors } from '../_helpers/store'

import getRemoteMonitors from '#src/helpers/monitors'

// Use cron task to update remote monitors to reduce SSR CPU time,
// it fetch and parse CSV data to JSON, the task seems not easy with limited CPU time.
export async function handleRemoteMonitors() {
  try {
    const result = await getRemoteMonitors()
    upsertRemoteMonitors(result)
  } catch (err) {
    console.error(err)
  }
}
