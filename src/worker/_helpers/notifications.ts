import type { Monitor } from '#src/types'

import { config } from '#src/config'

const operationalLabel = 'Active'
const notOperationalLabel = 'Inactive'

function getOperationalLabel(operational: boolean) {
  return operational
    ? operationalLabel
    : notOperationalLabel
}

export interface NotifyCoreData {
  operational: boolean
  status: number
  statusText: string
}

export interface NotifySlackOptions {
  webhook: string
  data: NotifyCoreData
}

export async function notifySlack(monitor: Monitor, options: NotifySlackOptions) {
  const { webhook, data } = options

  const monitorName = monitor.name || monitor.id
  const payload = {
    attachments: [
      {
        fallback: `Monitor ${monitorName} changed status to ${getOperationalLabel(data.operational)} [${data.status}|${data.statusText}]`,
        color: data.operational ? '#36a64f' : '#f2c744',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Monitor *${
                monitorName
              }* changed status to *${getOperationalLabel(data.operational)}*`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `${data.operational ? ':white_check_mark:' : ':x:'} \`${
                  monitor.method ? monitor.method : 'GET'
                } ${monitor.url}\` - :eyes: <${
                  config.settings.url
                }|Status Page>`,
              },
            ],
          },
        ],
      },
    ],
  }
  return await fetch(webhook, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

export interface INotifyTelegramOptions {
  chatId: string
  apiToken: string
  data: NotifyCoreData
}

export async function notifyTelegram(monitor: Monitor, options: INotifyTelegramOptions) {
  const { chatId, apiToken, data } = options

  const monitorName = monitor.name || monitor.id

  const text = [
    `
      Monitor *${monitorName.replaceAll(
      '-',
      '\\-',
    )}* changed status to *${getOperationalLabel(data.operational)}* [${data.status}|${data.statusText}]
    `.trim(),
    `
      ${data.operational ? '✅' : '❌'} \`${monitor.method ? monitor.method : 'GET'} ${
      monitor.url
    }\` \\- 👀 [Status Page](${config.settings.url})
    `.trim(),
  ].join('\n')

  const payload = new FormData()
  payload.append('chat_id', chatId)
  payload.append('parse_mode', 'MarkdownV2')
  payload.append('text', text)

  const telegramUrl = `https://api.telegram.org/bot${apiToken}/sendMessage`
  return await fetch(telegramUrl, {
    body: payload,
    method: 'POST',
  })
}

export interface INotifyDiscordOptions {
  webhook: string
  data: NotifyCoreData
}

// Visualize your payload using https://leovoel.github.io/embed-visualizer/
export async function notifyDiscord(monitor: Monitor, options: INotifyDiscordOptions) {
  const { webhook, data } = options

  const monitorName = monitor.name || monitor.id

  const payload = {
    username: `${config.settings.title}`,
    avatar_url: `${config.settings.url}/logo.svg`,
    embeds: [
      {
        title: `${monitorName} is ${getOperationalLabel(data.operational)} [${data.status}|${data.statusText}] ${
          data.operational ? ':white_check_mark:' : ':x:'
        }`,
        description: `\`${monitor.method ? monitor.method : 'GET'} ${
          monitor.url
        }\` - :eyes: [Status Page](${config.settings.url})`,
        color: data.operational ? 3581519 : 13632027,
      },
    ],
  }
  return await fetch(webhook, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

export function getNotificationCount() {
  return [
    typeof SECRET_SLACK_WEBHOOK_URL === 'undefined',
    typeof SECRET_TELEGRAM_CHAT_ID === 'undefined' || typeof SECRET_TELEGRAM_API_TOKEN === 'undefined',
    typeof SECRET_DISCORD_WEBHOOK_URL === 'undefined',
  ].filter((item) => !item).length
}

export function getNotifications(monitor: Monitor, data: NotifyCoreData, afterFetch?: () => void) {
  return [
    async () => {
      if (typeof SECRET_SLACK_WEBHOOK_URL === 'undefined') {
        return
      }
      await notifySlack(monitor, {
        webhook: SECRET_SLACK_WEBHOOK_URL,
        data,
      })
      afterFetch?.()
    },
    async () => {
      if (typeof SECRET_TELEGRAM_CHAT_ID === 'undefined' || typeof SECRET_TELEGRAM_API_TOKEN === 'undefined') {
        return
      }
      await notifyTelegram(monitor, {
        chatId: SECRET_TELEGRAM_CHAT_ID,
        apiToken: SECRET_TELEGRAM_API_TOKEN,
        data,
      })
      afterFetch?.()
    },
    async () => {
      if (typeof SECRET_DISCORD_WEBHOOK_URL === 'undefined') {
        return
      }
      await notifyDiscord(monitor, {
        webhook: SECRET_DISCORD_WEBHOOK_URL,
        data,
      })
      afterFetch?.()
    },
  ]
}
