---
title: API reference
description: Full EasyTV API. Grouped by resource, with typed params and a 200 body on each page.
---

The backend is a REST API in two families: **studio & user** and **admin & partner**. The studio, admin console and partner console share one login. **Do not use cookies for auth.**

- Base URL: `NUXT_PUBLIC_API_BASE_URL`, locally `http://127.0.0.1:8383`. Curl uses `$API`.
- HTTP is **always 200**. Read `success` in the JSON.
- Timestamps are Unix seconds. Empty `deleted_at` means not deleted.
- Pagination: `?page=1&page_size=20` (max 100).
- Soft delete: `DELETE` goes to trash; physical cleanup after 30 days.

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "reason" }
```

Auth headers are `Authorization: Bearer <token>` and `EasyTV-User`. Entities and state machines live in [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md). **Change that file before the code.**
