import React from 'react'

import type { PageContext } from 'vike/types'

const Context = React.createContext<PageContext>(undefined as any)

export function PageContextProvider({ pageContext, children }: { pageContext: PageContext, children: React.ReactNode }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePageContext<T = unknown>() {
  const pageContext = useContext(Context)
  return pageContext as PageContext<T>
}
