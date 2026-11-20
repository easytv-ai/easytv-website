---
title: 團隊
description: 團隊空間、邀請、席位。只有請求標頭帶 EasyTV-Team 時生成才花團隊積分池。
---

需要 [驗證](/docs/api-auth)。

- 未帶 / `EasyTV-Team: 0`：個人空間，花自己的錢包。
- `EasyTV-Team: <team_id>`：團隊空間，成員生成從 owner 積分池預扣。

一個人只屬於一個團隊。購買團隊版會員即成為 owner，席位 = 訂單 `seats`（2–10）。
