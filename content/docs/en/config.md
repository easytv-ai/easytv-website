---
title: Configuration
description: Required API env vars, front-end NUXT_PUBLIC_* values, and what lives in the setting table.
---

Config has two layers: environment variables read at process start, and the `setting` table the admin console hot-reloads. Annotated lists live in each repo's `.env.example`.

## API required

| Variable | Meaning |
| --- | --- |
| `SQL_DSN` | MySQL DSN, e.g. `user:pass@tcp(127.0.0.1:3306)/easytv?charset=utf8mb4&parseTime=true&loc=Local` |
| `ROOT_PASSWORD` | First admin password. The process refuses to start if there is no admin and this is empty |
| `CRYPTO_SECRET` | HMAC secret for OTP and tokens; ≥ 32 random characters in production |

## API common

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | `8383` | HTTP port (`--port` wins) |
| `DEBUG` | `false` | Verbose logs and SQL echo |
| `REDIS_CONN_STRING` | — | Without it, rate limits / OTP use memory |
| `UPLOAD_DIR` | `./upload` | Local storage directory |
| `FFMPEG_PATH` / `FFPROBE_PATH` | from `PATH` | Can also be overridden in settings |
| `WORKER_TAG` | — | Multi-node: only jobs with this tag |

Gateway, payments, OSS / Qiniu, SMTP and SMS can be env vars too; in production they usually live under **System** so you do not restart the API.

## Optional integrations

| Area | Variables / settings |
| --- | --- |
| Email OTP | `EMAIL_VERIFICATION_ENABLED`, `SMTP_*`, `VERIFICATION_VALID_MINUTES`. In dev you can turn mail off; the code is printed in the API log |
| SMS (SubMail) | `SMS_ENABLED`, `SUBMAIL_*`, `SMS_SIGNATURE` |
| Model gateway | settings `EasyAPIGatewayBaseUrl` / `EasyAPIGatewayKey` / `EasyAPIGatewayEnabled`. Prices live in `model_price` |
| Aliyun OSS | `OSS_BUCKET`, `OSS_ENDPOINT`, `OSS_ACCESS_KEY_ID`, `OSS_ACCESS_KEY_SECRET`, `OSS_BASE_URL`, `OSS_PREFIX`. Setting `OSS_BUCKET` stops writing to local `upload/` |
| Qiniu | settings `QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`. Public URLs mean image-to-video does not need `UPLOAD_BASE_URL` |
| Payments | `WECHATPAY_*`, `ALIPAY_APPID` or the matching settings; callback host is setting `ServerAddress` |
| Free quota | `FREE_CONCURRENT`, `FREE_STORAGE_GB` |

## Extra Docker Compose variables

These live in `easytv-api`'s `.env` and are compose-only:

| Variable | Default | Meaning |
| --- | --- | --- |
| `MYSQL_PASSWORD` | `change-me-easytv` | Password for the bundled MySQL app user |
| `MYSQL_ROOT_PASSWORD` | `change-me-root` | Bundled MySQL root |
| `PUBLIC_API_URL` | `http://localhost:8383` | URL the **browser** uses for the API, not the compose hostname |
| `PUBLIC_STUDIO_URL` | `http://localhost:3005` | Public studio URL |
| `API_PORT` / `WEB_PORT` / `MANAGE_PORT` | 8383 / 3005 / 3006 | Host port maps |

## Studio `easytv-web`

All of these are public runtime config (baked into the client — **no secrets**).

| Variable | Required | Meaning |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | yes | API URL |
| `NUXT_PUBLIC_SITE_URL` | yes in prod | canonical, sitemap, OG |
| `NUXT_PUBLIC_SITE_NAME` | no | default `EasyTV` |
| `NUXT_PUBLIC_MEDIA_HOSTS` | no | extra OSS / CDN hosts the media proxy may fetch |
| `NUXT_PUBLIC_CONTACT_EMAIL` | no | contact on legal pages |

Dev reads `.env.development`; production builds read `.env.production`.

## Admin `easytv-manage`

| Variable | Meaning |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | API URL |
| `NUXT_PUBLIC_STUDIO_URL` | Studio URL: header “site”, review → player, static assets |
| `NUXT_PUBLIC_PARTNER_URL` | Partner console URL: “open partner console” on the Partners page |
| `NUXT_PUBLIC_SITE_NAME` | Name in the title bar |

## Partner `easytv-partner`

| Variable | Meaning |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | API URL |
| `NUXT_PUBLIC_STUDIO_URL` | Studio URL: header “site” and promo-link fallback |
| `NUXT_PUBLIC_SITE_NAME` | Name in the title bar |
