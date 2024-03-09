import { getStore, upsertKvStore, upsertR2Store } from './_helpers'

import { ApiManager } from '#src/server/helpers'

export function defineStoreApi() {
  ApiManager.define({
    method: 'GET',
    pathname: '/api/store',
    runner: async () => {
      const data = await getStore()
      return new Response(JSON.stringify(data), { status: 200 })
    },
  })
  ApiManager.define({
    method: 'POST',
    pathname: ['/api/store/kv', '/api/store/r2'],
    headers: [
      {
        key: 'content-type',
        value: 'text',
      },
    ],
    runner: async (request, url) => {
      const text = await request.text()

      if (url.pathname.endsWith('kv')) {
        await upsertKvStore(text)
      }
      else {
        await upsertR2Store(text)
      }

      return new Response(null, { status: 204 })
    },
  })
}
