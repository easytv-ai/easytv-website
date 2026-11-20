---
title: Конфигурация
description: Обязательные переменные окружения API, значения NUXT_PUBLIC_* для фронтендов и то, что хранится в таблице setting.
---

У конфигурации два уровня: переменные окружения, которые читаются при запуске процесса, и таблица `setting`, которую админ-панель применяет на лету. Списки с комментариями — в `.env.example` каждого репозитория.

## Обязательные для API

| Переменная | Значение |
| --- | --- |
| `SQL_DSN` | DSN MySQL, например `user:pass@tcp(127.0.0.1:3306)/easytv?charset=utf8mb4&parseTime=true&loc=Local` |
| `ROOT_PASSWORD` | Пароль первого администратора. Процесс отказывается запускаться, если администратора нет, а значение пусто |
| `CRYPTO_SECRET` | Секрет HMAC для одноразовых кодов и токенов; в продакшене — не менее 32 случайных символов |

## Часто используемые для API

| Переменная | По умолчанию | Значение |
| --- | --- | --- |
| `PORT` | `8383` | HTTP-порт (`--port` имеет приоритет) |
| `DEBUG` | `false` | Подробные логи и вывод SQL |
| `REDIS_CONN_STRING` | — | Без неё ограничение частоты / одноразовые коды работают в памяти |
| `UPLOAD_DIR` | `./upload` | Каталог локального хранилища |
| `FFMPEG_PATH` / `FFPROBE_PATH` | из `PATH` | Можно переопределить и в настройках |
| `WORKER_TAG` | — | Несколько узлов: только задания с этим тегом |

Шлюз, платежи, OSS / Qiniu, SMTP и SMS тоже можно задать переменными окружения; в продакшене их обычно хранят в разделе **Система**, чтобы не перезапускать API.

## Необязательные интеграции

| Раздел | Переменные / настройки |
| --- | --- |
| Код по e-mail | `EMAIL_VERIFICATION_ENABLED`, `SMTP_*`, `VERIFICATION_VALID_MINUTES`. В разработке почту можно отключить; код выводится в лог API |
| SMS (SubMail) | `SMS_ENABLED`, `SUBMAIL_*`, `SMS_SIGNATURE` |
| Шлюз моделей | настройки `EasyAPIGatewayBaseUrl` / `EasyAPIGatewayKey` / `EasyAPIGatewayEnabled`. Цены хранятся в `model_price` |
| Aliyun OSS | `OSS_BUCKET`, `OSS_ENDPOINT`, `OSS_ACCESS_KEY_ID`, `OSS_ACCESS_KEY_SECRET`, `OSS_BASE_URL`, `OSS_PREFIX`. Если задан `OSS_BUCKET`, запись в локальный `upload/` прекращается |
| Qiniu | настройки `QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`. Публичные URL означают, что для генерации видео по изображению `UPLOAD_BASE_URL` не нужен |
| Платежи | `WECHATPAY_*`, `ALIPAY_APPID` или соответствующие настройки; хост обратных вызовов — настройка `ServerAddress` |
| Бесплатные лимиты | `FREE_CONCURRENT`, `FREE_STORAGE_GB` |

## Дополнительные переменные Docker Compose

Они находятся в `.env` репозитория `easytv-api` и используются только в compose:

| Переменная | По умолчанию | Значение |
| --- | --- | --- |
| `MYSQL_PASSWORD` | `change-me-easytv` | Пароль пользователя приложения во встроенном MySQL |
| `MYSQL_ROOT_PASSWORD` | `change-me-root` | Пароль root встроенного MySQL |
| `PUBLIC_API_URL` | `http://localhost:8383` | Адрес, по которому **браузер** обращается к API, а не имя хоста в compose |
| `PUBLIC_STUDIO_URL` | `http://localhost:3005` | Публичный адрес студии |
| `API_PORT` / `WEB_PORT` / `MANAGE_PORT` | 8383 / 3005 / 3006 | Проброс портов на хост |

## Студия `easytv-web`

Всё это — публичная конфигурация времени выполнения (попадает в клиент — **никаких секретов**).

| Переменная | Обязательна | Значение |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | да | Адрес API |
| `NUXT_PUBLIC_SITE_URL` | да в продакшене | canonical, sitemap, OG |
| `NUXT_PUBLIC_SITE_NAME` | нет | по умолчанию `EasyTV` |
| `NUXT_PUBLIC_MEDIA_HOSTS` | нет | дополнительные хосты OSS / CDN, к которым может обращаться медиапрокси |
| `NUXT_PUBLIC_CONTACT_EMAIL` | нет | контакт на юридических страницах |

В разработке читается `.env.development`; продакшен-сборки читают `.env.production`.

## Админ-панель `easytv-manage`

| Переменная | Значение |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | Адрес API |
| `NUXT_PUBLIC_STUDIO_URL` | Адрес студии: ссылка «сайт» в шапке, переход из модерации в плеер, статические ресурсы |
| `NUXT_PUBLIC_PARTNER_URL` | Адрес кабинета партнёра: «открыть кабинет партнёра» на странице «Партнёры» |
| `NUXT_PUBLIC_SITE_NAME` | Название в строке заголовка |

## Кабинет партнёра `easytv-partner`

| Переменная | Значение |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | Адрес API |
| `NUXT_PUBLIC_STUDIO_URL` | Адрес студии: ссылка «сайт» в шапке и запасной вариант для промоссылок |
| `NUXT_PUBLIC_SITE_NAME` | Название в строке заголовка |
