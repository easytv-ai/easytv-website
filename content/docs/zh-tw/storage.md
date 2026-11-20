---
title: 物件儲存
description: 本機 upload、阿里雲 OSS、七牛怎麼選，以及圖生影片為什麼要公網 URL。
---

生成產物、使用者上傳、合成成片都要落地儲存。三選一，執行期可切換，不必改程式碼。

## 本機磁碟

預設。目錄 `UPLOAD_DIR`（未設定時為 `./upload`），對外走 `GET /upload/*`。

Docker Compose 把該目錄放在具名卷 `upload` 裡。圖生影片時閘道要能 **HTTP GET** 到素材：

- 本機串接測試：把 setting `UploadBaseUrl` 設成閘道能存取的位址，例如 `http://你的公网IP:8383/upload` 或一條內網穿透
- 只在同一台機器上玩、閘道也在本機：有時 `http://host.docker.internal:8383/upload` 就夠

沒有公網 URL 時，圖生影片 / 參考圖會失敗，文生影片一般不受影響。

## 阿里雲 OSS

環境變數（啟動時讀一次）：

| 變數 | 說明 |
| --- | --- |
| `OSS_BUCKET` | 設定了就啟用 OSS，不再寫本機 |
| `OSS_ENDPOINT` | 如 `oss-cn-hangzhou.aliyuncs.com` |
| `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | 正式環境用最小權限子帳號（PutObject / GetObject） |
| `OSS_BASE_URL` | CDN 或 Bucket 公網網域 |
| `OSS_PREFIX` | 物件前綴，預設 `easytv` |
| `OSS_PUBLIC_READ` | 是否公開讀取 |

啟用後 `/upload/*` 不再作為主路徑。儲存桶如果沒設定 CORS，創作台裁切 / 抽幀讀不到像素，要把該網域加進 `NUXT_PUBLIC_MEDIA_HOSTS`，走伺服器端代理。

## 七牛

寫在 setting 裡（後台 **系統 → 閘道與儲存**），熱更新：

`QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`

啟用後上傳和產物走七牛 CDN 公網 URL，圖生影片一般不必再設定 `UploadBaseUrl`。前端直傳憑證：`GET /user/qiniu/upload-token`、`GET /user/qiniu/key`。

## 怎麼選

| 情境 | 建議 |
| --- | --- |
| 本機開發 | 本機 + 需要圖生影片時再設定 `UploadBaseUrl` |
| 單機自架 | 本機磁碟，Nginx 把 `/upload/` 直接對外提供 |
| 正式環境、要 CDN | OSS 或七牛，Bucket 公開讀取或簽名 URL |
