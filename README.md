# Cloudflare Worker - Status Page Pro

[![](https://dcbadge.vercel.app/api/server/h2tKCshs)](https://discord.gg/h2tKCshs)

Monitor your websites, showcase status including daily history, and get Slack notification whenever your website status changes. Using **Cloudflare Workers**, **CRON Triggers,** and **KV storage**. Check [my status page](https://cf-worker-status-page-pro-production.yunsii.workers.dev/) out! 🚀

## Features

- 🦄 Written in TypeScript
- ✨ Support remote csv monitors
- 🚀 No limit for max monitors of cron task, even with workers KV free tier
- 🪁 [Auto GC](./src/worker/_helpers/store.ts#L77) for KV value size
- 💎 More DX/UX detail you want

## Pre-requisites

You'll need a [Cloudflare Workers account](https://dash.cloudflare.com/sign-up/workers) with

- A workers domain set up
- The Workers Bundled subscription \($5/mo\)
  - [It works with Workers Free!](https://blog.cloudflare.com/workers-kv-free-tier/) Check [more info](#workers-kv-free-tier) on how to run on Workers Free.
- Some websites/APIs to watch 🙂

Also, prepare the following secrets

- Cloudflare API token with `Edit Cloudflare Workers` permissions
- Slack incoming webhook \(optional\)
- Discord incoming webhook \(optional\)

## Getting started

You can use GitHub Actions to deploy on your own.

1. Click the button and follow the instructions, you should end up with a clone of this repository
2. Navigate to your new **GitHub repository > Settings > Secrets and variables > Actions** and add the following secrets:

   ```yaml
   - Name: CLOUDFLARE_API_TOKEN

   - Name: SECRET_SLACK_WEBHOOK_URL (optional)
   - Value: your-slack-webhook-url

   - Name: SECRET_DISCORD_WEBHOOK_URL (optional)
   - Value: your-discord-webhook-url
   ```

3. Edit [config.ts](./src/config.ts) to adjust configuration and list all of your websites/APIs you want to monitor

4. Push to `master` branch to trigger the deployment
5. 🎉
6. _\(optional\)_ Go to [Cloudflare Workers settings](https://dash.cloudflare.com/?to=/workers) and assign custom domain/route
7. _\(optional\)_ Edit [wrangler.toml](./wrangler.toml) to adjust Worker settings or CRON Trigger schedule, especially if you are on [Workers Free plan](#workers-kv-free-tier)

## Workers KV free tier

The Workers Free plan includes limited KV usage, but the quota is sufficient for 2-minute checks only

- Change the CRON trigger to 2 minutes interval (`crons = ["*/2 * * * *"]`) in [wrangler.toml](./wrangler.toml)

## Known issues

- **KV replication lag** - You might get Slack notification instantly, however it may take couple of more seconds to see the change on your status page as [Cron Triggers are usually running on underutilized quiet hours machines](https://blog.cloudflare.com/introducing-cron-triggers-for-cloudflare-workers/#how-are-you-able-to-offer-this-feature-at-no-additional-cost).

- **Initial delay (no data)** - It takes couple of minutes to schedule and run CRON Triggers for the first time

## Running project locally

**Requirements**

- Pnpm (`npm i -g pnpm`)

### Steps to get server up and running

**Install dependencies**

```
pnpm i
```

**Login With Wrangler to Cloudflare**

```
npx wrangler login
```

**Create your KV namespace in cloudflare**

```
On the workers page navigate to KV, and create a namespace
```

**Update your wrangler.toml with**

```
kv-namespaces = [{binding="KV_STORE", id="<KV_ID>", preview_id="<KV_ID>"}]
```

_Note: you may need to change `kv-namespaces` to `kv_namespaces`_

**Run**

```
pnpm run dev
```

## Remote CSV Monitors

You can use remote CSV monitors like [this template](https://docs.google.com/spreadsheets/d/1eNhgeS0ElQGFeaVLNJwFWI8JW-Ppv158necdqASJ6TY/edit?usp=sharing). You can get the URL by **File > Share > Publish to web** and select specific sheet and Comma-separated values (.csv).

## Credits

- [eidam/cf-workers-status-page](https://github.com/eidam/cf-workers-status-page)
- [Vike](https://vike.dev/)
