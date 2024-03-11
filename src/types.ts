export interface Config {
  settings: Settings
  monitors: Monitor[]
}

export interface Monitor {
  /** Unique identifier */
  id: string
  url: string
  /** Display name, default=`id` */
  name?: string
  description?: string
  /** Fetch method, default=GET */
  method?: string
  /** Operational status, default=200 */
  expectStatus?: number
  /** Should fetch follow redirects, default=false */
  followRedirect?: boolean
}

export interface Settings {
  title: string
  /** Status page url, used for notification */
  url: string
  /**
   * Number of days you want to display in histogram,
   * outdated data will be removed.
   */
  daysInHistogram: number
  /** Collects avg response times from CRON locations */
  collectResponseTimes: boolean
  /** Ref: https://developers.cloudflare.com/workers/platform/limits default=50 */
  subrequestsLimit?: number
}
