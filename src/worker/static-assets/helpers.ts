import { publicAssets } from './public'

const workerAssets = ['/assets/']
const assets = [...workerAssets, ...publicAssets]

export function isAssetUrl(url: string) {
  const { pathname } = new URL(url)

  return assets.some((item) => {
    if (item.endsWith('/')) {
      return pathname.startsWith(item)
    }
    return pathname === item
  })
}
