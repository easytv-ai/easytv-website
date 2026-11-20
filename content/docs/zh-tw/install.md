---
title: 安裝部署
description: 部署 EasyTV 需要哪些相依元件，Docker 和原始碼兩條路怎麼選。
---

整套最少包括 **API + MySQL + 一個 OpenAI 相容閘道**。創作台、營運後台可以稍後加；沒有它們也能先把 `/healthz` 跑通。

## 你需要準備

| 元件 | 說明 |
| --- | --- |
| MySQL 8.x | 必填。首次啟動 AutoMigrate 建表 |
| Redis | 建議。不填則限流和驗證碼走記憶體 |
| ffmpeg / ffprobe | 合成、抽幀、音畫分離 |
| OpenAI 相容閘道 | 文字 / 圖像 / 影片 / 音訊模型入口 |
| Node.js 22.21+ 與 pnpm 10+ | 只在以原始碼執行前端時需要 |

## 怎麼選

| 方式 | 適合 |
| --- | --- |
| [Docker Compose](/docs/install-docker) | 建議。一行指令啟動 API，可選 `full` 把創作台和後台一起啟動 |
| [原始碼執行](/docs/install-source) | 改後端或前端時用 |
| 二進位檔 + systemd | 正式環境機器不想裝 Docker 時，從 GitHub Releases 下載 Linux 套件 |

## 連接埠

| 服務 | 連接埠 |
| --- | --- |
| easytv-api | 8383 |
| easytv-web | 3005 |
| easytv-manage | 3006 |
| easytv-partner | 3010 |

瀏覽器不是從本機存取容器時，在 `.env` 裡把 `PUBLIC_API_URL` 和 `PUBLIC_STUDIO_URL` 設為瀏覽器實際開啟的位址。
