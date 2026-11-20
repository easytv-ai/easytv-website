---
title: 作品
description: 從資產發布成片、按讚評論、製作過程。公開資訊流是另一組匿名介面。
---

登入使用者的作品 CRUD 需要 [驗證](/docs/api-auth)。廣場資訊流走 [公開介面](/docs/api-public)。

`status`：0 草稿 / 1 已發布 / 2 已下架 / -1 審核駁回。`review_status`：0 待審核 / 1 通過 / 2 駁回。發布不阻塞，審核事後處理。帶上 `canvas_id` 才能公開製作過程。
