export function isApiUrl(url: string) {
  const { pathname } = new URL(url)
  return pathname.startsWith('/api/')
}
