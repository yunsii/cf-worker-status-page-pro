import { handleSsr } from './ssr'
import { handleStaticAssets } from './static-assets'
import { isAssetUrl } from './static-assets/helpers'
import { handleFetchError } from './_helpers'
import { handleCronTrigger } from './cron'

async function handleFetchEvent(event: FetchEvent) {
  const { url } = event.request
  const userAgent = event.request.headers.get('User-Agent')

  if (!isAssetUrl(url)) {
    const response = await handleSsr(url, userAgent)
    if (response !== null) {
      return response
    }
  }
  const response = await handleStaticAssets(event)
  return response
}

// Worker startup time limit: 400ms
// ref: https://developers.cloudflare.com/workers/platform/limits/#worker-startup-time
addEventListener('fetch', (event: FetchEvent) => {
  try {
    event.respondWith(handleFetchEvent(event))
  } catch (err) {
    handleFetchError(event, err)
  }
})

// Time limit:
// When the schedule interval is less than 1 hour, a Scheduled Worker may run for up to 30 seconds.
// When the schedule interval is more than 1 hour, a scheduled Worker may run for up to 15 minutes.
// ref: https://developers.cloudflare.com/workers/platform/limits/#cpu-time Note block
addEventListener('scheduled', (event: FetchEvent) => {
  event.waitUntil(handleCronTrigger(event))
})
