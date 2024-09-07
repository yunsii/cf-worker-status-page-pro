export interface Config {
  settings: Settings
  monitors: Monitor[]
  monitorsCsvUrl?: string
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
   * Number of days you want to display in page,
   * outdated data will be removed.
   */
  displayDays: number
  /** Collects avg response times from CRON locations */
  collectResponseTimes: boolean
  /** Ref: https://developers.cloudflare.com/workers/platform/limits default=50 */
  subrequestsLimit?: number
  /**
   * Client side render, default: false
   *
   * If status page exceeded CPU time limit with SSR, you can use CSR instead.
   */
  csr?: boolean
}
