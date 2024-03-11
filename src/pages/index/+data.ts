import type { PageContext } from 'vike/types'

import { getStore } from '#src/worker/_helpers/store'
import { isWorkerEnv } from '#src/worker/_helpers'

export async function data(pageContext: PageContext) {
  try {
    const id = pageContext.routeParams?.id
    const store = await getStore()

    return {
      id,
      ...store,
    }
  }
  catch (err) {
    if (isWorkerEnv) {
      throw err
    }
    // eslint-disable-next-line no-console
    console.debug('Error ignored in non worker env.')
    return {
      kvData: null,
    }
  }
}

export type AboutPageData = Awaited<ReturnType<typeof data>>
