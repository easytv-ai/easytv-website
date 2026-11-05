---
title: Run from source
description: Start the API, studio, admin and partner consoles separately while you change code.
---

## Backend

Needs Go 1.27+, MySQL 8.x, optional Redis, and `ffmpeg` / `ffprobe` on `PATH`.

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS easytv DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
go run . --port 8383
```

Set `SQL_DSN`, `ROOT_PASSWORD` and `CRYPTO_SECRET` in `.env`. Optional demo seed:

```bash
go run ./cmd/seed --env-file .env
```

## Studio

Needs Node.js 22.21+ (Nuxt 4.6's floor; `engines` in the repo still says 22.5+) and pnpm 10+.

```bash
git clone https://github.com/easytv-ai/easytv-web.git
cd easytv-web
pnpm install
cp .env.example .env.development
```

Point `NUXT_PUBLIC_API_BASE_URL` at `http://127.0.0.1:8383`, then:

```bash
pnpm dev          # http://localhost:3005
```

Without a backend, home, explore and the skill plaza still render; creation opens a sign-in dialog. Use **pnpm**, not npm or cnpm.

## Admin console

```bash
git clone https://github.com/easytv-ai/easytv-manage.git
cd easytv-manage
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3006
```

Sign in with the `admin` account created on the API's first boot.

## Partner console

```bash
git clone https://github.com/easytv-ai/easytv-partner.git
cd easytv-partner
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3010
```

Any EasyTV account can sign in. Accounts that are not partners yet land on the application page.

## Binary + systemd

Without Docker, grab a Linux build from [Releases](https://github.com/easytv-ai/easytv-api/releases), or compile:

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o easytv-api .
```

```ini
# /etc/systemd/system/easytv-api.service
[Unit]
Description=EasyTV API
After=network.target mysql.service

[Service]
User=easytv
WorkingDirectory=/opt/easytv-api
ExecStart=/opt/easytv-api/easytv-api --port 8383 --env-file /opt/easytv-api/.env
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Hosts without systemd can use `deploy.sh start|stop|restart|status` in the repo. Reverse-proxy example: [API overview](/docs/api).
