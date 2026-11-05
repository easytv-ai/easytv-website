---
title: Production
description: How to split hostnames, reverse-proxy with Nginx, Cloudflare, multi-node workers, and a go-live list.
---

[Docker Compose](/docs/install-docker) is enough on a laptop. In production, put the four processes on different hosts (or subdomains) that share one API.

## Hostnames

| Service | Example | Used as |
| --- | --- | --- |
| easytv-api | `https://api.example.com` | every front end’s `NUXT_PUBLIC_API_BASE_URL` |
| easytv-web | `https://studio.example.com` | `NUXT_PUBLIC_SITE_URL` / admin “studio URL” |
| easytv-manage | `https://admin.example.com` | do not leave this on the open internet |
| easytv-partner | `https://partner.example.com` | admin `NUXT_PUBLIC_PARTNER_URL` |

CORS echoes any `Origin` and allows credentials, so the three front ends can differ. Auth is headers, not cookies.

## Nginx

Generation and uploads are slow and large:

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    client_max_body_size 512m;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://127.0.0.1:8383;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The three Nuxt apps:

- **Cloudflare Workers** (repo default): `cp .env.example .env.production && pnpm deploy`
- **Node host**: `NITRO_PRESET=node-server pnpm build`, then `node .output/server/index.mjs`
- **Docker**: GHCR images, override every `NUXT_PUBLIC_*` at runtime

## Multi-node API

Each API process only handles jobs stamped with its tag: env `WORKER_TAG`. Generation, compose and media jobs can be sharded that way. Untagged processes take untagged jobs.

MySQL must be shared. Redis is strongly recommended (rate limits and OTP; without it each process uses in-memory maps). Use OSS / Qiniu, not per-node disks.

## Go-live list

1. Change `ROOT_PASSWORD`, `CRYPTO_SECRET` (≥ 32 chars) and MySQL passwords
2. `DEBUG=false`
3. [Connect a gateway](/docs/gateway) and import prices
4. Switch [storage](/docs/storage) to OSS / Qiniu, or give local disk a public `UploadBaseUrl`
5. [Payments](/docs/billing): `ServerAddress` = `https://api.example.com`
6. SMTP or SMS; stop printing OTPs in the log
7. Studio `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_MEDIA_HOSTS`
8. Review `/legal/*` copy for your entity and jurisdiction
9. Do not expose the admin console to the world
