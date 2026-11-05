---
title: FAQ
description: The usual traps around deploy, gateway, sign-in and licensing.
---

## The studio opens but nothing generates

The API is missing, or the gateway / model prices are not set. Point `NUXT_PUBLIC_API_BASE_URL` at a live API, then [connect a gateway](/docs/gateway).

## Front ends in Docker cannot reach the API

The browser talks to your machine, not `api:8383` on the compose network. Set `PUBLIC_API_URL` to a URL the browser can open, e.g. `http://192.168.x.x:8383`.

## Boot fails with no admin

`ROOT_PASSWORD` is empty. If the database has no admin, the API refuses to start.

## No verification code

In development set `EMAIL_VERIFICATION_ENABLED=false`; the code is printed in the API log. Wire SMTP or SMS for production.

## Media trim fails / CORS

If the bucket has no CORS, let the studio use the server-side media proxy and add the bucket host to `NUXT_PUBLIC_MEDIA_HOSTS`.

## Port 3000 is busy

The marketing site `easytv-website` also defaults to 3000. Stop that `nuxt dev`, or give the site another port. The studio defaults to 3005.

## Do I have to use pnpm?

The three front-end repos pin pnpm. npm / yarn / cnpm will fight the lockfile and `packageManager` field, and the install will not match CI.

## Canvas save fails / “over 2 MB”

The whole `graph` is capped at 2 MB. Do not persist director-stage camera stills (base64 PNG); the front end already strips them on save.

## Tasks stay pending

Something has to process jobs. On multiple nodes, check `WORKER_TAG`. Search logs for gateway 429 / moderation / `unsupported duration`.

## Image-to-video fails, text-to-video works

The gateway cannot GET the source URL. Local disk needs a public `UploadBaseUrl`; OSS / Qiniu need a public host. See [Storage](/docs/storage).

## Member prices do not apply

Personal space looks at *your* active membership. Team space looks at the **owner’s** team plan. Viewers cannot generate.

## Payment callback 404 / bad signature

`ServerAddress` must be the public https root of the API. WeChat and Alipay notify URLs should hit `/wechat/webhook` and `/alipay/webhook`.

## Can I use this closed-source commercially?

Yes under AGPL-3.0 if you publish corresponding source when you offer a modified version as a network service. You do not need to buy a license for that. Closed-source or white-label without those obligations needs the [commercial license](/docs/license). New API-inspired modules in `easytv-api` stay AGPL.
