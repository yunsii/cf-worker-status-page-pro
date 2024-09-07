import { upsertRemoteMonitors } from '../_helpers/store'

import getRemoteMonitors from '#src/helpers/monitors'

// Use cron task to update remote monitors to reduce SSR CPU time,
// it fetch and parse CSV data to JSON, the task seems not easy with limited CPU time.
export async function handleRemoteMonitors(env: Env) {
  try {
    const result = await getRemoteMonitors()
    await upsertRemoteMonitors(env, result)
  } catch (err) {
    console.error(err)
  }
}
