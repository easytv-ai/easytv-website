---
title: Развёртывание в продакшене
description: Как разделить домены, настроить обратный прокси Nginx, Cloudflare и воркеры на нескольких узлах, а также список перед запуском.
---

На ноутбуке достаточно [Docker Compose](/docs/install-docker). В продакшене разместите четыре процесса на разных хостах (или поддоменах), которые используют один API.

## Домены

| Сервис | Пример | Где используется |
| --- | --- | --- |
| easytv-api | `https://api.example.com` | `NUXT_PUBLIC_API_BASE_URL` каждого фронтенда |
| easytv-web | `https://studio.example.com` | `NUXT_PUBLIC_SITE_URL` / «адрес студии» в админ-панели |
| easytv-manage | `https://admin.example.com` | не оставляйте в открытом интернете |
| easytv-partner | `https://partner.example.com` | `NUXT_PUBLIC_PARTNER_URL` админ-панели |

CORS возвращает любой `Origin` и разрешает учётные данные, поэтому три фронтенда могут находиться на разных доменах. Авторизация — через заголовки, а не cookie.

## Nginx

Генерация и загрузка файлов — медленные и объёмные операции:

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

Три приложения Nuxt:

- **Cloudflare Workers** (по умолчанию в репозиториях): `cp .env.example .env.production && pnpm deploy`
- **Хост с Node**: `NITRO_PRESET=node-server pnpm build`, затем `node .output/server/index.mjs`
- **Docker**: образы из GHCR, все `NUXT_PUBLIC_*` переопределяются при запуске

## API на нескольких узлах

Каждый процесс API обрабатывает только задания со своим тегом — переменная окружения `WORKER_TAG`. Так можно распределять задания генерации, монтажа и медиа. Процессы без тега берут задания без тега.

MySQL должен быть общим. Redis настоятельно рекомендуется (ограничение частоты и одноразовые коды; без него каждый процесс хранит их в памяти). Используйте OSS / Qiniu, а не диски отдельных узлов.

## Список перед запуском

1. Смените `ROOT_PASSWORD`, `CRYPTO_SECRET` (≥ 32 символов) и пароли MySQL
2. `DEBUG=false`
3. [Подключите шлюз](/docs/gateway) и импортируйте цены
4. Переключите [хранилище](/docs/storage) на OSS / Qiniu или задайте локальному диску публичный `UploadBaseUrl`
5. [Платежи](/docs/billing): `ServerAddress` = `https://api.example.com`
6. SMTP или SMS; перестаньте выводить одноразовые коды в лог
7. `NUXT_PUBLIC_SITE_URL` и `NUXT_PUBLIC_MEDIA_HOSTS` студии
8. Проверьте тексты `/legal/*` на соответствие вашему юридическому лицу и юрисдикции
9. Не открывайте админ-панель всему миру
