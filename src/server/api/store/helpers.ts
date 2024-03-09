import { ensureWorkerEnv } from '#src/server/helpers'

export const DATA_KEY = 'data'

export type DataType = string | null

export async function upsertKvStore(value: DataType) {
  ensureWorkerEnv()
  const result = await (typeof value === 'string' ? KV_STORE.put(DATA_KEY, value) : KV_STORE.delete(DATA_KEY))
  return result
}

export async function getStore() {
  ensureWorkerEnv()
  const kvData = await KV_STORE.get(DATA_KEY)
  return { kvData }
}
