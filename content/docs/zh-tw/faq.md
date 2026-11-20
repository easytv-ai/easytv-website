---
title: 常見問題
description: 部署、閘道、登入和開源授權上最常碰到的坑。
---

## 創作台能開啟，但不能生成

後端沒連上，或閘道 / 模型定價沒設定。確認 `NUXT_PUBLIC_API_BASE_URL` 指向運作中的 API，然後依 [串接閘道](/docs/gateway) 匯入模型。

## Docker 裡前端連不上 API

瀏覽器存取的是你的機器，不是容器網路裡的 `api:8383`。把 `PUBLIC_API_URL` 設成瀏覽器能開啟的位址，例如 `http://192.168.x.x:8383`。

## 啟動時回報沒有管理員

`ROOT_PASSWORD` 沒設定。系統裡沒有管理員時，API 會拒絕啟動。

## 驗證碼出不來

開發時可以把 `EMAIL_VERIFICATION_ENABLED=false`，驗證碼印在 API 日誌裡。正式環境再設定 SMTP 或簡訊。

## 媒體裁剪失敗 / 跨網域

物件儲存沒設定 CORS 時，讓創作台走伺服器端媒體代理，並把儲存桶網域加到 `NUXT_PUBLIC_MEDIA_HOSTS`。

## 3000 連接埠被占用

官網 `easytv-website` 預設也是 3000。關掉那個 `nuxt dev`，或給官網換連接埠。創作台預設 3005，一般不衝突。

## 必須用 pnpm 嗎

三個前端儲存庫都鎖定了 pnpm。npm / yarn / cnpm 會把 lockfile 和 `packageManager` 搞亂，安裝結果也不一樣。

## 畫布儲存失敗 / 提示超過 2 MB

整張 `graph` 上限 2 MB。導演台節點不要把機位截圖（base64 PNG）寫進去，前端持久化時已經會移除。

## 任務一直 pending

API 行程要有人處理作業。多節點時看 `WORKER_TAG` 是否對得上。日誌裡搜尋閘道 429 / 內容審核 / `unsupported duration`。

## 圖生影片失敗、文生影片成功

閘道拿不到素材 URL。本機儲存要設定公網 `UploadBaseUrl`；OSS / 七牛要用公網網域。見 [物件儲存](/docs/storage)。

## 會員價沒生效

個人空間看自己有沒有有效會員。團隊空間看 **owner** 的團隊版是否在效期內，檢視者不能生成。

## 付款回呼 404 / 簽章失敗

`ServerAddress` 必須是 API 的 https 根位址。微信和支付寶控制台裡的通知 URL 要指到 `/wechat/webhook`、`/alipay/webhook`。

## 我能閉源商用嗎

遵守 AGPL-3.0（對外提供修改版網路服務時公開對應原始碼）就可以商用，不必買授權。想閉源或白牌且不開源改動，需要 [商業授權](/docs/license)。`easytv-api` 裡衍生自上游 AGPL 專案的模組仍受 AGPL 約束。
