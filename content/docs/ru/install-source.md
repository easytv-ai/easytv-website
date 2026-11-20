---
title: Запуск из исходников
description: Запустите API, студию, админ-панель и кабинет партнёра по отдельности, пока меняете код.
---

## Бэкенд

Нужны Go 1.27+, MySQL 8.x, при желании Redis, а также `ffmpeg` / `ffprobe` в `PATH`.

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS easytv DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
go run . --port 8383
```

Задайте `SQL_DSN`, `ROOT_PASSWORD` и `CRYPTO_SECRET` в `.env`. Необязательные демо-данные:

```bash
go run ./cmd/seed --env-file .env
```

## Студия

Нужны Node.js 22.21+ (минимум для Nuxt 4.6; в `engines` репозитория пока указано 22.5+) и pnpm 10+.

```bash
git clone https://github.com/easytv-ai/easytv-web.git
cd easytv-web
pnpm install
cp .env.example .env.development
```

Укажите в `NUXT_PUBLIC_API_BASE_URL` адрес `http://127.0.0.1:8383`, затем:

```bash
pnpm dev          # http://localhost:3005
```

Без бэкенда главная страница, обзор и витрина навыков всё равно отображаются; при попытке создания открывается окно входа. Используйте **pnpm**, а не npm или cnpm.

## Админ-панель

```bash
git clone https://github.com/easytv-ai/easytv-manage.git
cd easytv-manage
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3006
```

Войдите под учётной записью `admin`, созданной при первом запуске API.

## Кабинет партнёра

```bash
git clone https://github.com/easytv-ai/easytv-partner.git
cd easytv-partner
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3010
```

Войти может любая учётная запись EasyTV. Учётные записи, которые ещё не стали партнёрами, попадают на страницу заявки.

## Бинарный файл + systemd

Без Docker возьмите сборку для Linux в разделе [Releases](https://github.com/easytv-ai/easytv-api/releases) или скомпилируйте сами:

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

На хостах без systemd можно использовать `deploy.sh start|stop|restart|status` из репозитория. Пример обратного прокси: [обзор API](/docs/api).
