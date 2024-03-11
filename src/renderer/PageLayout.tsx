import React from 'react'

import { PageContextProvider } from './usePageContext'

import type { PageContext } from 'vike/types'

export interface PageLayoutProps {
  pageContext: PageContext
}

export function PageLayout(props: React.PropsWithChildren<PageLayoutProps>) {
  const { pageContext, children } = props

  return (
    <PageContextProvider pageContext={pageContext}>
      {children}
    </PageContextProvider>
  )
}
