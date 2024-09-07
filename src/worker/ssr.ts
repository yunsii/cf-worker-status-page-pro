import { renderPage } from 'vike/server'

export interface CustomPageContext {
  env: Env
  urlOriginal: string
  // ref: https://vike.dev/cloudflare-workers#universal-fetch
  fetch: typeof fetch
  userAgent: string | null
}

export async function handleSsr(env: Env, url: string, userAgent: string | null) {
  const pageContextInit: CustomPageContext = {
    env,
    urlOriginal: url,
    fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
    userAgent,
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return null
  } else {
    const { statusCode: status, headers } = httpResponse
    const stream = httpResponse.getReadableWebStream()
    return new Response(stream, { headers, status })
  }
}
