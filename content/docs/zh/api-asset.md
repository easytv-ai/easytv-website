---
title: 资产
description: 上传、列表、回收站。生成产物 source=generated，上传 source=upload，媒体工具 source=media。
---

需要 [鉴权](/docs/api-auth)。类型按 MIME 判断：`image` / `video` / `audio` / `text` / `other`。单文件上限默认 200 MB（`UPLOAD_MAX_MB`）。配了七牛时前端走直传再 `POST /user/asset/import` 登记。
