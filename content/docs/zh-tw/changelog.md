---
title: 更新日誌
description: 文件站和四個產品儲存庫最近在補什麼。完整紀錄在各儲存庫 CHANGELOG.md。
---

這裡只記文件站看得見的變化。產品儲存庫各自維護 `CHANGELOG.md`。

## 文件站 easytv-website

- 七語系文件站（簡體、繁體、英、法、日、俄、越），預設在 `/docs`，其餘語系帶前綴如 `/en/docs`：開始、安裝、使用指南、API 參考、參考分開
- 主題跟首頁同一套，不再一進文件就強制暗色
- 架構圖標籤不再和 API / 閘道方塊疊在一起
- pnpm、AGPL-3.0、貢獻與安全說明

## 創作台 easytv-web

- Docker 映像檔與執行時 `NUXT_PUBLIC_*`
- 雙授權：AGPL-3.0 + 商業授權範本
- 媒體代理白名單改從執行時設定讀取

## 後端 easytv-api

- 契約仍以儲存庫裡的 `API.md` 為準（目前寫到第 40 章）
- 生成只走 OpenAI 相容閘道，不直連廠商
- 積分依 `model_price` 預扣，失敗或取消退回

未發布項目以各儲存庫 `CHANGELOG.md` 的 `[Unreleased]` 為準。
