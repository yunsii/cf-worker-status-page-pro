import type { PageContext } from 'vike/types'

import { getStore } from '#src/worker/_helpers/store'
import { isWorkerEnv } from '#src/worker/_helpers'

export async function data(pageContext: PageContext) {
  try {
    const store = await getStore()
    return store.kvData
  }
  catch (err) {
    if (isWorkerEnv) {
      throw err
    }
    // eslint-disable-next-line no-console
    console.debug('Error ignored in non worker env.')
    return null
  }
}

export type IndexPageData = Awaited<ReturnType<typeof data>>
