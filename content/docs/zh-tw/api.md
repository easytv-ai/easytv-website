---
title: API 參考
description: EasyTV 完整介面文件。依資源分組，每條含參數型別和 200 回應。
---

後端提供完整 REST 介面，分成 **創作與使用者** 和 **管理與通路** 兩類。創作台、營運後台、通路後台共用同一套登入。**不要用 Cookie 做驗證。**

- Base URL：`NUXT_PUBLIC_API_BASE_URL`，本機預設 `http://127.0.0.1:8383`。curl 裡寫成 `$API`。
- HTTP **恆為 200**。成敗看 JSON 裡的 `success`。
- 時間：Unix 秒。`deleted_at` 為空表示未刪除。
- 分頁：`?page=1&page_size=20`（上限 100）。
- 軟刪除：`DELETE` 進資源回收筒，30 天後實體清除。

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "错误原因" }
```

驗證標頭是 `Authorization: Bearer <token>` 和 `EasyTV-User`。完整實體和狀態機寫在 [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md)。**改介面先改那份檔案。**
