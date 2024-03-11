// https://vike.dev/onRenderHtml
import React from 'react'
import { renderToStream } from 'react-streaming/server'
import { dangerouslySkipEscape, escapeInject } from 'vike/server'

import { PageLayout } from './PageLayout'
import styles from './_global.css?inline'

import type { OnRenderHtmlAsync } from 'vike/types'

export const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const { Page, pageProps } = pageContext

  const page = (
    <React.StrictMode>
      <PageLayout pageContext={pageContext}>
        <Page {...pageProps} />
      </PageLayout>
    </React.StrictMode>
  )

  // Streaming is optional and we can use renderToString() instead
  const stream = await renderToStream(page, { userAgent: pageContext.userAgent })

  return escapeInject`
    <!DOCTYPE html>
    <html>
      <style>${dangerouslySkipEscape(styles)}</style>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>
  `
}
