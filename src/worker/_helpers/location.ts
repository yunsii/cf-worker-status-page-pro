import { UNKNOWN_LOCATION } from '#src/helpers/locations'

export async function getCheckLocation() {
  // try: `curl -kvH 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query' -X OPTIONS`
  const res = await fetch('https://cloudflare-dns.com/dns-query', {
    method: 'OPTIONS',
  })
  return res.headers.get('cf-ray')?.split('-')[1] || UNKNOWN_LOCATION
}
