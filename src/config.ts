import type { Config } from './types'

export const config: Config = {
  settings: {
    title: 'Status Page Pro',
    url: 'https://cf-worker-status-page-pro-production.yunsii.workers.dev',
    displayDays: 90,
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
      followRedirect: true,
    },
    {
      id: 'bilibili',
      url: 'https://www.bilibili.com/',
    },
    {
      id: 'GitHub',
      url: 'https://github.com/',
    },
  ],
  monitorsCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnewwW9OuXgtuutyYSfFJ_AZdI-UpkUjP2wWi-zZWM3MKa8IzBceWCe9qB_-Lmk-S7mSFgqKVnokam/pub?gid=0&single=true&output=csv',
}
