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

addEventListener('fetch', (event: FetchEvent) => {
  try {
    event.respondWith(handleFetchEvent(event))
  }
  catch (err) {
    handleFetchError(event, err)
  }
})

addEventListener('scheduled', (event: FetchEvent) => {
  event.waitUntil(handleCronTrigger(event))
})
