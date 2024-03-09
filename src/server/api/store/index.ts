import { getStore, upsertKvStore } from './helpers'

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
    pathname: ['/api/store'],
    headers: [
      {
        key: 'content-type',
        value: 'text',
      },
    ],
    runner: async (request) => {
      const text = await request.text()
      await upsertKvStore(text)
      return new Response(null, { status: 204 })
    },
  })
}
