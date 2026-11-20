---
title: 設定
description: API 必填環境變數、前端 NUXT_PUBLIC_*，以及哪些東西改 setting 表。
---

設定分兩層：行程啟動時讀的環境變數，和營運後台熱更新的 `setting` 表。完整帶註解的清單在各儲存庫 `.env.example`。

## API 必填

| 變數 | 說明 |
| --- | --- |
| `SQL_DSN` | MySQL DSN，例如 `user:pass@tcp(127.0.0.1:3306)/easytv?charset=utf8mb4&parseTime=true&loc=Local` |
| `ROOT_PASSWORD` | 首個管理員密碼。系統無管理員且未設定時拒絕啟動 |
| `CRYPTO_SECRET` | 簽署驗證碼與權杖的 HMAC 金鑰，正式環境 ≥ 32 位隨機字元 |

## API 常用

| 變數 | 預設 | 說明 |
| --- | --- | --- |
| `PORT` | `8383` | HTTP 連接埠（`--port` 優先） |
| `DEBUG` | `false` | 詳細日誌與 SQL 回顯 |
| `REDIS_CONN_STRING` | — | 不填則限流 / 驗證碼走記憶體 |
| `UPLOAD_DIR` | `./upload` | 本機儲存目錄 |
| `FFMPEG_PATH` / `FFPROBE_PATH` | 讀 `PATH` | 也可在 setting 裡覆寫 |
| `WORKER_TAG` | — | 多節點時只處理帶該標籤的作業 |

閘道、金流、OSS / 七牛、SMTP、簡訊多數也可以寫進環境變數，但正式環境更常見的是在 **系統設定** 裡改，免重啟。

## 可選整合

| 領域 | 變數 / setting |
| --- | --- |
| 信箱驗證碼 | `EMAIL_VERIFICATION_ENABLED`、`SMTP_*`、`VERIFICATION_VALID_MINUTES`。開發時可關閉郵件，驗證碼印在 API 日誌 |
| 簡訊（SubMail） | `SMS_ENABLED`、`SUBMAIL_*`、`SMS_SIGNATURE` |
| 模型閘道 | setting `EasyAPIGatewayBaseUrl` / `EasyAPIGatewayKey` / `EasyAPIGatewayEnabled`。單價在 `model_price` 表 |
| 阿里雲 OSS | `OSS_BUCKET`、`OSS_ENDPOINT`、`OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`、`OSS_BASE_URL`、`OSS_PREFIX`。設定了 `OSS_BUCKET` 就不再寫本機 `upload/` |
| 七牛 | setting `QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`。啟用後素材走公網 URL，圖生影片不必再設定 `UPLOAD_BASE_URL` |
| 金流 | `WECHATPAY_*`、`ALIPAY_APPID` 或對應 setting；回呼網域用 setting `ServerAddress` |
| 免費額度 | `FREE_CONCURRENT`、`FREE_STORAGE_GB` |

## Docker Compose 額外變數

這些寫在 `easytv-api` 的 `.env` 裡，只給 Compose 用：

| 變數 | 預設 | 說明 |
| --- | --- | --- |
| `MYSQL_PASSWORD` | `change-me-easytv` | 隨附 MySQL 的業務帳號密碼 |
| `MYSQL_ROOT_PASSWORD` | `change-me-root` | 隨附 MySQL 的 root |
| `PUBLIC_API_URL` | `http://localhost:8383` | **瀏覽器**存取 API 的位址，不是容器內主機名稱 |
| `PUBLIC_STUDIO_URL` | `http://localhost:3005` | 創作台公開位址 |
| `API_PORT` / `WEB_PORT` / `MANAGE_PORT` | 8383 / 3005 / 3006 | 宿主機連接埠對應 |

## 創作台 `easytv-web`

全部是公開的執行時設定（會打包進前端套件，**不要放金鑰**）。

| 變數 | 必填 | 說明 |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | 是 | API 位址 |
| `NUXT_PUBLIC_SITE_URL` | 正式環境必填 | canonical、sitemap、OG |
| `NUXT_PUBLIC_SITE_NAME` | 否 | 預設 `EasyTV` |
| `NUXT_PUBLIC_MEDIA_HOSTS` | 否 | 媒體代理額外放行的 OSS / CDN 網域 |
| `NUXT_PUBLIC_CONTACT_EMAIL` | 否 | 協議頁聯絡信箱 |

開發讀 `.env.development`，正式環境建置讀 `.env.production`。

## 營運後台 `easytv-manage`

| 變數 | 說明 |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | API 位址 |
| `NUXT_PUBLIC_STUDIO_URL` | 創作台位址：頂欄「官網」、審核跳轉播放頁、靜態資源 |
| `NUXT_PUBLIC_PARTNER_URL` | 通路後台位址：夥伴頁「開啟通路後台」 |
| `NUXT_PUBLIC_SITE_NAME` | 標題列站點名稱 |

## 通路後台 `easytv-partner`

| 變數 | 說明 |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | API 位址 |
| `NUXT_PUBLIC_STUDIO_URL` | 創作台位址：頂欄「官網」與推廣連結的備援 |
| `NUXT_PUBLIC_SITE_NAME` | 標題列站點名稱 |
