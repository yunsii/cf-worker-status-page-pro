import type fetch from 'node-fetch'

type Page = (pageProps: PageProps) => React.ReactElement
export type PageProps = Record<string, unknown>

// https://vike.dev/pageContext#typescript
declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace Vike {
    interface PageContext {
      Page: Page
      pageProps?: PageProps
      userAgent?: string
      fetch?: typeof fetch
    }
  }
}
