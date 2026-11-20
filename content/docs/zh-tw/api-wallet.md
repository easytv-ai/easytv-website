---
title: 錢包
description: 積分餘額、批次、流水和會員狀態。積分是唯一計價單位，不再用遺留 quota。
---

需要 [驗證](/docs/api-auth)。公開定價頁用 [訂單](/docs/api-order) 裡的 `/billing/plans`。

積分依批次管理，消耗 **最早過期優先**。餘額 = 未過期批次剩餘之和。帶 `EasyTV-Team` 時看的是團隊空間錢包。
