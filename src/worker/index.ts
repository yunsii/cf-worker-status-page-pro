import { handleSsr } from './ssr'
import { handleStaticAssets } from './static-assets'
import { isAssetUrl } from './static-assets/helpers'
import { isApiUrl } from './api/helpers'

import { handleFetchError } from '#src/helpers/worker'
import { handleApi } from '#src/worker/api/root'

async function handleFetchEvent(event: FetchEvent) {
  const { url } = event.request
  const userAgent = event.request.headers.get('User-Agent')

  if (isApiUrl(url)) {
    const response = await handleApi(event.request)
    if (response !== null) {
      return response
    }
  }
  else if (!isAssetUrl(url)) {
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
