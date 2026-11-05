---
title: 配置
description: API 必填环境变量、前端 NUXT_PUBLIC_*，以及哪些东西改 setting 表。
---

配置分两层：进程启动时读的环境变量，和运营后台热更新的 `setting` 表。完整带注释的清单在各仓库 `.env.example`。

## API 必填

| 变量 | 说明 |
| --- | --- |
| `SQL_DSN` | MySQL DSN，例如 `user:pass@tcp(127.0.0.1:3306)/easytv?charset=utf8mb4&parseTime=true&loc=Local` |
| `ROOT_PASSWORD` | 首个管理员密码。系统无管理员且未设置时拒绝启动 |
| `CRYPTO_SECRET` | 签名验证码与令牌的 HMAC 密钥，生产 ≥ 32 位随机字符 |

## API 常用

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `PORT` | `8383` | HTTP 端口（`--port` 优先） |
| `DEBUG` | `false` | 详细日志与 SQL 回显 |
| `REDIS_CONN_STRING` | — | 不填则限流 / 验证码走内存 |
| `UPLOAD_DIR` | `./upload` | 本地存储目录 |
| `FFMPEG_PATH` / `FFPROBE_PATH` | 读 `PATH` | 也可在 setting 里覆盖 |
| `WORKER_TAG` | — | 多节点时只处理带该标签的作业 |

网关、支付、OSS / 七牛、SMTP、短信多数也可以写进环境变量，但生产更常见的是在 **系统设置** 里改，免重启。

## 可选集成

| 领域 | 变量 / setting |
| --- | --- |
| 邮箱验证码 | `EMAIL_VERIFICATION_ENABLED`、`SMTP_*`、`VERIFICATION_VALID_MINUTES`。开发可关邮件，验证码打在 API 日志 |
| 短信（SubMail） | `SMS_ENABLED`、`SUBMAIL_*`、`SMS_SIGNATURE` |
| 模型网关 | setting `EasyAPIGatewayBaseUrl` / `EasyAPIGatewayKey` / `EasyAPIGatewayEnabled`。单价在 `model_price` 表 |
| 阿里云 OSS | `OSS_BUCKET`、`OSS_ENDPOINT`、`OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`、`OSS_BASE_URL`、`OSS_PREFIX`。配了 `OSS_BUCKET` 就不再写本地 `upload/` |
| 七牛 | setting `QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`。启用后素材走公网 URL，图生视频不必再配 `UPLOAD_BASE_URL` |
| 支付 | `WECHATPAY_*`、`ALIPAY_APPID` 或对应 setting；回调域名用 setting `ServerAddress` |
| 免费额度 | `FREE_CONCURRENT`、`FREE_STORAGE_GB` |

## Docker Compose 额外变量

这些写在 `easytv-api` 的 `.env` 里，只给 Compose 用：

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `MYSQL_PASSWORD` | `change-me-easytv` | 捆绑 MySQL 的业务账号密码 |
| `MYSQL_ROOT_PASSWORD` | `change-me-root` | 捆绑 MySQL 的 root |
| `PUBLIC_API_URL` | `http://localhost:8383` | **浏览器**访问 API 的地址，不是容器内主机名 |
| `PUBLIC_STUDIO_URL` | `http://localhost:3005` | 创作台公开地址 |
| `API_PORT` / `WEB_PORT` / `MANAGE_PORT` | 8383 / 3005 / 3006 | 宿主机端口映射 |

## 创作台 `easytv-web`

全部是公开运行时配置（会打进前端包，**不要放密钥**）。

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | 是 | API 地址 |
| `NUXT_PUBLIC_SITE_URL` | 生产必填 | canonical、sitemap、OG |
| `NUXT_PUBLIC_SITE_NAME` | 否 | 默认 `EasyTV` |
| `NUXT_PUBLIC_MEDIA_HOSTS` | 否 | 媒体代理额外放行的 OSS / CDN 域名 |
| `NUXT_PUBLIC_CONTACT_EMAIL` | 否 | 协议页联系邮箱 |

开发读 `.env.development`，生产构建读 `.env.production`。

## 运营后台 `easytv-manage`

| 变量 | 说明 |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | API 地址 |
| `NUXT_PUBLIC_STUDIO_URL` | 创作台地址：顶栏「官网」、审核跳播放页、静态资源 |
| `NUXT_PUBLIC_PARTNER_URL` | 渠道后台地址：伙伴页「打开渠道后台」 |
| `NUXT_PUBLIC_SITE_NAME` | 标题栏站点名 |

## 渠道后台 `easytv-partner`

| 变量 | 说明 |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | API 地址 |
| `NUXT_PUBLIC_STUDIO_URL` | 创作台地址：顶栏「官网」与推广链接兜底 |
| `NUXT_PUBLIC_SITE_NAME` | 标题栏站点名 |
