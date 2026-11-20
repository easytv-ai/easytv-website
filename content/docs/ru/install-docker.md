---
title: Docker Compose
description: Поднимите API с помощью compose-файла из easytv-api; при желании — весь набор фронтендов.
---

Нужны Docker 24+ и Compose v2.

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

Отредактируйте `.env` и задайте как минимум:

- `ROOT_PASSWORD` — пароль первого администратора (имя пользователя по умолчанию — `admin`)
- `CRYPTO_SECRET` — секрет HMAC; в продакшене используйте `openssl rand -hex 32`

Затем:

```bash
docker compose up -d
curl http://localhost:8383/healthz
```

Compose скачивает `ghcr.io/easytv-ai/easytv-api:latest`, запускает MySQL 8.4, Redis 7 и API на порту 8383. Загруженные файлы и логи хранятся в именованных томах. При первом запуске выполняется миграция схемы и создаётся администратор.

## Студия и админ-панель заодно

```bash
docker compose --profile full up -d
```

- Студия http://localhost:3005
- Админ-панель http://localhost:3006

Образы берутся из GHCR (`easytv-web`, `easytv-manage`). Кабинет партнёра разворачивается отдельно; см. [Кабинет партнёра](/docs/partner).

Если доступ нужен другим машинам в локальной сети, задайте адреса, которые браузер будет открывать на самом деле:

```bash
PUBLIC_API_URL=http://192.168.1.10:8383
PUBLIC_STUDIO_URL=http://192.168.1.10:3005
```

`NUXT_PUBLIC_API_BASE_URL` попадает в бандл фронтенда. Имя хоста в compose вроде `http://api:8383` из браузера недоступно.

В продакшене смените значения по умолчанию `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD`.

## Локальная сборка образа API

По умолчанию образ скачивается. Чтобы собрать его локально, раскомментируйте `build: .` у сервиса API в `docker-compose.yml`.

Образы выпускаются для `linux/amd64` и `linux/arm64`, помечаются тегами версий, а также `latest` и `main`.
