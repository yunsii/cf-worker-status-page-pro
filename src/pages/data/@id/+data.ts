import type { PageContext } from 'vike/types'

import { getStore } from '#src/server/api/store/_helpers'
import { isWorkerEnv } from '#src/server/helpers'

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
      r2Data: null,
    }
  }
}

export type AboutPageData = Awaited<ReturnType<typeof data>>
