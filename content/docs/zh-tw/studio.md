---
title: 創作台
description: easytv-web 能做什麼、常用路由，以及如何指向你的後端。
---

創作台是創作者用的前端，儲存庫 [easytv-web](https://github.com/easytv-ai/easytv-web)。分功能的說明見 [畫布](/docs/canvas)、[一句話成片](/docs/create)、[導演台](/docs/director)、[社群](/docs/community)、[登入與團隊](/docs/team)。

![創作台首頁與精選成片](/images/docs/studio.png)

## 能做什麼

- **自由畫布**：文字、圖片、影片、音訊、分鏡組節點連線即跑，帶版本歷史和唯讀分享
- **一句話成片**：自動企劃案、角色與場景、分鏡與配音，再逐鏡精修
- **3D 導演台**：瀏覽器裡擺站位、定機位，鏡頭描述寫回畫布
- **瀏覽器內剪輯**：FFmpeg.wasm 本機裁剪、拆分、拼接
- **社群**：探索、追蹤、排行榜、評論、公開播放頁
- **技能與提示詞**：可重複使用的工作流範本
- **七語系**：簡體 / 繁體 / 英 / 法 / 日 / 俄 / 越

## 常用路由

| 路徑 | 說明 |
| --- | --- |
| `/agent` | 首頁（`/` 會 301 到這裡） |
| `/explore` `/studio` `/following` `/rank` | 作品流、推薦、追蹤、排行榜 |
| `/create` | 一句話成片：輸入 → 企劃案 → 分層生成 → 合成 |
| `/canvas` | 自由畫布。`?id=` 開啟既有畫布，`?project_id=` 從專案新建 |
| `/canvas/director` | 3D 導演台，場景寫回同一張畫布 |
| `/share/:token` | 畫布唯讀分享 |
| `/projects` `/assets` `/subjects` `/prompts` | 專案與素材庫 |
| `/skills` | 技能廣場 |
| `/watch/:id` | 成片播放 |
| `/pricing` | 方案 |
| `/settings` | 帳號、團隊、訂單、發票、邀請 |
| `/legal/*` | 協議、隱私、AI 規範（範例文案，上線前請自行審閱） |

## 部署

Cloudflare Workers 預設組態：

```bash
cp .env.example .env.production
pnpm deploy
```

Node 主機：`NITRO_PRESET=node-server pnpm build`，再 `node .output/server/index.mjs`。

Docker：

```bash
docker run -d -p 3005:3005 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_SITE_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-web:latest
```
