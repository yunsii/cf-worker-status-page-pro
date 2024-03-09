import React from 'react'
import { cls } from 'tagged-classnames-free'

import { PageContextProvider } from './usePageContext'

import type { PageContext } from 'vike/types'

export interface PageLayoutProps {
  pageContext: PageContext
}

export function PageLayout(props: React.PropsWithChildren<PageLayoutProps>) {
  const { pageContext, children } = props

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>
          <Sidebar>
            {[
              {
                href: '/',
                label: 'Home',
              },
              {
                href: '/about',
                label: 'About',
              },
              {
                href: '/star-wars',
                label: 'Star Wars',
              },
              {
                href: '/data',
                label: 'Data',
              },
            ].map((item) => {
              return (
                <a
                  key={item.href}
                  className={cls`
                    p-1 text-cyan-600 
                    hover:text-cyan-500 hover:underline
                  `}
                  href={item.href}
                >
                  {item.label}
                </a>
              )
            })}
          </Sidebar>
          <Content>{children}</Content>
        </Layout>
      </PageContextProvider>
    </React.StrictMode>
  )
}

function Layout({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto',
      }}
    >
      {children}
    </div>
  )
}

function Sidebar({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        padding: 20,
        paddingTop: 42,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.8em',
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: '2px solid #eee',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}
