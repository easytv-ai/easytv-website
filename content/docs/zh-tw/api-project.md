---
title: 專案
description: 作品容器。畫布掛在專案下；不傳 project_id 新建畫布時後端會自動建同名專案。
---

需要 [驗證](/docs/api-auth)。呼叫方是創作台 `/projects`。

實體欄位：`id`、`user_id`、`name`、`description`、`cover_url`、`status`、`canvas_id`（唯讀，最近更新的畫布）、時間戳記。列表裡 `cover_url` 為空時會附帶最近一張畫面，不寫回資料庫。點卡片開啟畫布用回傳的 `canvas_id`。
