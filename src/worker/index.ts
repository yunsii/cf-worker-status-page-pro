import { handleSsr } from './ssr'
import { handleStaticAssets } from './static-assets'
import { isAssetUrl } from './static-assets/helpers'
import { handleFetchError } from './_helpers'
import { handleCronTrigger } from './cron'
import { handleRemoteMonitors } from './cron/remote-monitors'

import type { FetchHandler } from '#src/types'

const handleFetchEvent: FetchHandler = async (request, env, context) => {
  const { url } = request
  const userAgent = request.headers.get('User-Agent')

  if (!isAssetUrl(url)) {
    const response = await handleSsr(env, url, userAgent)
    if (response !== null) {
      return response
    }
  }
  const response = await handleStaticAssets(request, env, context)
  return response
}

const handler: ExportedHandler<Env> = {
  // Worker startup time limit: 400ms
  // ref: https://developers.cloudflare.com/workers/platform/limits/#worker-startup-time
  fetch: async (request, env, ctx) => {
    try {
      return await handleFetchEvent(request, env, ctx)
    } catch (err) {
      return handleFetchError(err)
    }
  },
  // Time limit:
  // When the schedule interval is less than 1 hour, a Scheduled Worker may run for up to 30 seconds.
  // When the schedule interval is more than 1 hour, a scheduled Worker may run for up to 15 minutes.
  // ref: https://developers.cloudflare.com/workers/platform/limits/#cpu-time Note block
  scheduled: async (controller, env, ctx) => {
    switch (controller.cron) {
      case '*/2 * * * *':
        // Every two minutes
        await handleCronTrigger(env, ctx)
        break
      case '*/10 * * * *':
        // Every ten minutes
        await handleRemoteMonitors(env)
        break
    }
  },
}

export default handler
