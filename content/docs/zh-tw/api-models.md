---
title: 模型
description: 可用模型清單和詳情。清單 = model_price 表 status=1，是建立任務的唯一白名單。
---

這兩條都 **可匿名**。建立任務前先拉清單，再用回傳的 `model` 去 `POST /user/task`。閘道沒設定或資料表為空時回傳空陣列。

每條附帶積分定價：`unit`（`second` / `image` / `call`）、`points_per_unit`、`member_points_per_unit`、`priced`。營運從閘道拉取並匯入見 [定價與閘道](/docs/api-admin-price)。
