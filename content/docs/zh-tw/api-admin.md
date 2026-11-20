---
title: 管理側總表
description: 營運後台 /admin/* 。role ≥ 10；改系統設定、退款、調積分要 role ≥ 100。
---

呼叫方是 [easytv-manage](https://github.com/easytv-ai/easytv-manage)。驗證同 [使用者側](/docs/api-auth-login)，另加管理員角色。

超級管理員（`role ≥ 100`，RootAuth）才能：系統設定、註銷使用者、換綁、調額度、提領撥款、訂單退款 / 手動標記已付款、積分調整、會員方案 / 積分包 / 促銷 / 模型定價的新增刪除修改。一般管理員呼叫這些會回傳 `权限不足`。

拆開的詳細頁在左側：使用者、審核、定價與閘道。
