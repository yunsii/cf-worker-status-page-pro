// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export const isWorkerEnv = typeof importScripts === 'function'

export function ensureWorkerEnv() {
  if (isWorkerEnv) {
    return
  }
  throw new Error('Non worker env')
}

export function isApiUrl(url: string) {
  const { pathname } = new URL(url)
  return pathname.startsWith('/api/')
}

export interface DefinedApi {
  method: 'GET' | 'POST'
  pathname: string | string[]
  headers?: {
    key: string
    value: string
    /** default: contains */
    match?: 'equals' | 'contains'
  }[]
  runner: (request: Request, url: URL) => Promise<Response>
}

export class ApiManager {
  static apis: DefinedApi[] = []

  static define(options: DefinedApi) {
    ApiManager.apis.push(options)
  }

  static async match(request: Request) {
    const parsedUrl = new URL(request.url)

    const method = request.method
    const pathname = parsedUrl.pathname
    const headers = request.headers

    const targetApi = ApiManager.apis.find((item) => {
      const matchedHeaders = item.headers
        ? item.headers.every((headerItem) => {
          switch (headerItem.match) {
            case 'equals':
              return headers.get(headerItem.key) === headerItem.value
            default:
              return headers.get(headerItem.key)?.includes(headerItem.value)
          }
        })
        : true
      const matchedPathname = typeof item.pathname === 'string' ? item.pathname === pathname : item.pathname.includes(pathname)
      return (item.method === method.toUpperCase() && matchedPathname && matchedHeaders)
    })

    if (!targetApi) {
      return new Response(JSON.stringify({
        message: 'Unexpected api request',
      }), { status: 400 })
    }

    return await targetApi.runner(request, parsedUrl)
  }
}
