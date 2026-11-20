---
title: 架構
description: 創作台、營運後台、通路後台如何連到 easytv-api，以及閘道與儲存。
---

架構圖在 [開始使用](/docs) 頁，是會跟著主題變色的那一張。三端都打到同一個 API，模型再轉送到閘道。

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api (Gin)  ── MySQL / Redis
easytv-partner  ──┘           │            ── 对象存储（本地 / OSS / 七牛）
                              │            ── ffmpeg
                              ▼
                    OpenAI 兼容网关
                              ▼
                    Kling · 即梦 · Seedance · Sora · GPT · …
```

## 驗證

- 創作台與通路後台：`Authorization: Bearer <token>` + `EasyTV-User: <用户 id>`
- 營運後台走 `/admin/*`，還要求角色 `role ≥ 10`
- 團隊空間用 `EasyTV-Team: <team_id>`，未帶則為個人空間
- CORS 回顯請求來源，三端可以部署在不同網域

## 執行期設定

環境變數只在行程啟動時讀一次。站點名稱、金流、閘道位址、邀請規則等放在後端 `setting` 表，營運後台改完立即生效，不必重啟 API。

儲存三選一：本機 `upload/`、阿里雲 OSS、七牛。圖生影片時閘道要能拉到素材：OSS / 七牛給公網 URL；本機儲存就要設定 `UPLOAD_BASE_URL`（或 setting `UploadBaseUrl`）讓閘道存取得到。

多節點 API 用 `WORKER_TAG`：每個行程只處理打了相同標籤的作業。

## 契約

改介面先改 [`easytv-api` 的 API.md](https://github.com/easytv-ai/easytv-api/blob/main/API.md)，再改三個前端。摘要見 [介面概覽](/docs/api)。
