import type { Config } from './types'

export const config: Config = {
  settings: {
    title: 'Status Page',
    url: 'https://status-page.eidam.dev',
    daysInHistogram: 90,
    collectResponseTimes: true,
  },
  monitors: [
    {
      id: 'workers.cloudflare.com',
      url: 'https://workers.cloudflare.com',
      description: 'You write code. They handle the rest.',
      followRedirect: false,
    },
    {
      id: 'www.cloudflare.com',
      url: 'https://www.cloudflare.com',
      description: 'Built for anything connected to the Internet.',
    },
    {
      id: 'blog.cloudflare.com',
      url: 'https://blog.cloudflare.com',
      name: 'The Cloudflare Blog',
    },
    {
      id: 'google',
      url: 'https://www.google.com/',
      name: 'Google',
    },
  ],
}
