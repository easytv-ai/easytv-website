---
title: Docker Compose
description: Bring up the API with the compose file in easytv-api; optionally the whole front-end stack.
---

Needs Docker 24+ and Compose v2.

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

Edit `.env` and at least set:

- `ROOT_PASSWORD` — first admin password (username defaults to `admin`)
- `CRYPTO_SECRET` — HMAC secret; in production use `openssl rand -hex 32`

Then:

```bash
docker compose up -d
curl http://localhost:8383/healthz
```

Compose pulls `ghcr.io/easytv-ai/easytv-api:latest`, starts MySQL 8.4, Redis 7 and the API on 8383. Uploads and logs live in named volumes. The first start migrates the schema and creates the admin.

## Studio and admin as well

```bash
docker compose --profile full up -d
```

- Studio http://localhost:3005
- Admin http://localhost:3006

Images come from GHCR (`easytv-web`, `easytv-manage`). The partner console is deployed separately; see [Partner console](/docs/partner).

If other machines on the LAN need access, set the URLs the browser will actually open:

```bash
PUBLIC_API_URL=http://192.168.1.10:8383
PUBLIC_STUDIO_URL=http://192.168.1.10:3005
```

`NUXT_PUBLIC_API_BASE_URL` is baked into the front-end bundle. A compose hostname like `http://api:8383` is unreachable from the browser.

Change the default `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD` in production.

## Build the API image locally

The default is to pull. To build locally, uncomment `build: .` on the API service in `docker-compose.yml`.

Images are `linux/amd64` and `linux/arm64`, tagged by version, plus `latest` and `main`.
