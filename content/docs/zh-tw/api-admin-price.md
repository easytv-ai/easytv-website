---
title: 定價與閘道
description: 會員方案、積分包、模型定價、從閘道拉模型並匯入、訂單退款和積分調整。
---

CRUD 會員 / 積分包 / 模型定價、退款、調帳是 **RootAuth**（`role ≥ 100`）。一般管理員唯讀。`model` 必須與閘道識別碼一致，這是 `GET /generation/models` 的唯一資料來源。
