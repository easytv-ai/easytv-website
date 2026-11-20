---
title: Обзор проекта
description: Что делают четыре репозитория продукта, порты по умолчанию и почему сайт проекта не участвует в процессе создания.
---

EasyTV — это четыре развёртываемых репозитория с общим [контрактом API](/docs/api). Сначала меняйте `easytv-api/API.md`, затем любой клиент.

![Студия](/images/docs/studio.png)

## Репозитории

| Репозиторий | Роль | Порт | Документация |
| --- | --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | API на Go: авторизация, холст, задачи, биллинг, хранилище, шлюз | 8383 | [Справочник API](/docs/api) |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | Студия: холст, фильм по одной фразе, режиссёрская сцена, сообщество | 3005 | [Студия](/docs/studio) |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | Админ-панель: пользователи, модерация, цены, шлюз, рост | 3006 | [Админ-панель](/docs/admin) |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | Кабинет партнёра: вознаграждения, вывод средств, промоматериалы | 3010 | [Кабинет партнёра](/docs/partner) |

Сайт проекта [easytv-website](https://github.com/easytv-ai/easytv-website) — это только документация и лендинг.

## Кто кого вызывает

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api  ── MySQL / Redis / object storage
easytv-partner  ──┘         │
                            ▼
                    OpenAI-compatible gateway
```

Все три клиента отправляют `Authorization: Bearer` + `EasyTV-User`. Админ-панели также нужна `role ≥ 10`. Вызовы моделей никогда не идут к поставщикам напрямую.

## Локальный запуск

Когда все четыре репозитория находятся на этой машине, откройте перечисленные выше порты. Docker Compose с `--profile full` запускает API, студию и админ-панель; кабинет партнёра запускается отдельно через `pnpm dev`. См. [быстрый старт](/docs/quickstart) и [запуск из исходников](/docs/install-source).
