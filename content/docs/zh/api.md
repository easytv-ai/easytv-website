---
title: API 参考
description: EasyTV 完整接口文档。按资源分组，每条含参数类型和 200 响应。
---

后端提供完整 REST 接口，分成 **创作与用户** 和 **管理与渠道** 两类。创作台、运营后台、渠道后台共用同一套登录。**不要用 Cookie 做鉴权。**

- Base URL：`NUXT_PUBLIC_API_BASE_URL`，本地默认 `http://127.0.0.1:8383`。curl 里写成 `$API`。
- HTTP **恒 200**。成败看 JSON 里的 `success`。
- 时间：Unix 秒。`deleted_at` 为空表示未删除。
- 分页：`?page=1&page_size=20`（上限 100）。
- 软删：`DELETE` 进回收站，30 天后物理清理。

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "错误原因" }
```

鉴权头是 `Authorization: Bearer <token>` 和 `EasyTV-User`。完整实体和状态机写在 [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md)。**改接口先改那份文件。**
