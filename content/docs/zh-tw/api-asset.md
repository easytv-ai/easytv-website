---
title: 資產
description: 上傳、列表、資源回收筒。生成產物 source=generated，上傳 source=upload，媒體工具 source=media。
---

需要 [驗證](/docs/api-auth)。類型依 MIME 判斷：`image` / `video` / `audio` / `text` / `other`。單一檔案上限預設 200 MB（`UPLOAD_MAX_MB`）。設定了七牛時前端走直傳再 `POST /user/asset/import` 登記。
