import { ApiManager } from '../_helpers'

import { defineStoreApi } from '../store'

export async function handleApi(request: Request) {
  try {
    defineStoreApi()

    return await ApiManager.match(request)
  }
  catch (err) {
    console.error('handleApi error:', err)
    if (err instanceof Error) {
      return new Response(JSON.stringify({
        message: err.message,
      }), { status: 500 })
    }
    return new Response(JSON.stringify({
      message: 'Unknown error',
    }), { status: 500 })
  }
}
