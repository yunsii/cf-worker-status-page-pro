// https://vike.dev/onRenderClient
import React from 'react'
import { hydrateRoot } from 'react-dom/client'

import { PageLayout } from './PageLayout'

import type { PageContext } from 'vike/types'

export async function onRenderClient(pageContext: PageContext) {
  const { Page, pageProps } = pageContext
  hydrateRoot(
    document.getElementById('page-view')!,
    <React.StrictMode>
      <PageLayout pageContext={pageContext}>
        <Page {...pageProps} />
      </PageLayout>
    </React.StrictMode>,
  )
}
