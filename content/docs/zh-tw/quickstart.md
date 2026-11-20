---
title: 快速開始
description: 從空機器到第一次出片：Docker 啟動、登入後台、接通閘道、跑一條一句話成片。
---

目標是 **15 分鐘內**看到一條成片。以下預設本機已經有 Docker 24+，以及一個能呼叫文字 / 圖像 / 影片模型的 OpenAI 相容閘道權杖。

更細的安裝選項見 [安裝部署](/docs/install)；只想先看能力見 [創作台](/docs/studio)。

## 1. 啟動整套

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

編輯 `.env`：

- `ROOT_PASSWORD`：第一個管理員密碼（使用者名稱預設 `admin`）
- `CRYPTO_SECRET`：`openssl rand -hex 32`

```bash
docker compose --profile full up -d
curl http://localhost:8383/healthz
```

| 開啟 | 位址 |
| --- | --- |
| API | http://localhost:8383 |
| 創作台 | http://localhost:3005 |
| 營運後台 | http://localhost:3006 |

通路後台要另外啟動，見 [通路後台](/docs/partner)。

## 2. 登入營運後台

開啟 `http://localhost:3006`，用 `admin` + 你設的 `ROOT_PASSWORD` 登入。

依這個順序改設定（都在 **系統** 裡，改完立刻生效）：

1. **站點**：創作台公開位址填 `http://localhost:3005`（邀請連結、付款回呼都用它）
2. **閘道**：填 OpenAI 相容閘道的 Base URL 與 Key → 拉取模型 → **匯入定價**
3. **模型定價**：核對接進來的文字 / 圖像 / 影片單價（沒有定價的模型，創作台不允許生成）

細節見 [串接閘道](/docs/gateway)。

## 3. 給管理員加點積分

生成要扣積分。在後台 **使用者** 裡找到 `admin`，用「調整積分」發一筆測試額度（或先給自己開通一個會員方案）。

也可以在創作台 `/pricing` 走付款，但本機串接測試通常先手動加點。

## 4. 跑一條一句話成片

開啟 `http://localhost:3005/create`（沒登入會彈出登入框，用同一個 `admin` 帳號）。

1. 輸入一句話，選時長 15 / 30 / 60 秒
2. 生成企劃案（會扣一次文字模型積分）
3. 核對角色、場景、分鏡，點「建畫布」
4. 分層生成角色圖、分鏡圖、鏡頭影片、配音
5. 合成：ffmpeg 拼接、燒錄字幕、混 BGM，免費帳號會加浮水印

完整步驟見 [一句話成片](/docs/create)。

## 5. 接下來

- 在畫布上改鏡頭、加節點：[自由畫布](/docs/canvas)
- 擺機位：[3D 導演台](/docs/director)
- 賣方案：[計費與金流](/docs/billing)
- 上線到自己的網域：[正式環境部署](/docs/deploy)
