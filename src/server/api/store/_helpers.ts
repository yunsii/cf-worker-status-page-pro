import { enabledR2, ensureWorkerEnv } from '#src/server/helpers'

export const DATA_KEY = 'data'

export type DataType = string | null

const r2DisabledMessage = 'R2 bucket has been disabled'

export async function upsertKvStore(value: DataType) {
  ensureWorkerEnv()
  const result = await (typeof value === 'string' ? KV_STORE.put(DATA_KEY, value) : KV_STORE.delete(DATA_KEY))
  return result
}

export async function upsertR2Store(value: DataType) {
  ensureWorkerEnv()
  if (!enabledR2) {
    throw new Error('R2 bucket has been disabled')
  }
  const result = await (R2_BUCKET.put(DATA_KEY, value))
  return result
}

export async function getStore() {
  ensureWorkerEnv()
  const [kvData, r2Data] = await Promise.all([
    KV_STORE.get(DATA_KEY),
    enabledR2 ? R2_BUCKET.get(DATA_KEY).then((response) => response?.text() || null) : Promise.resolve(r2DisabledMessage),
  ])
  return {
    kvData,
    r2Data,
  }
}
