---
title: API overview
description: Base URL, envelope, auth headers. The left nav expands each resource into endpoints with typed params and a 200 body.
---

Entities, routes and state machines live in [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md). **Change that file before the code.** This site splits common routes into the left menu, with Header / Query / Body and a JSON response on each page.

## Conventions

- Base URL: `NUXT_PUBLIC_API_BASE_URL`, locally `http://127.0.0.1:8383`. Curl uses `$API`.
- HTTP is **always 200**. Read `success` in the JSON.
- Timestamps are Unix seconds. Empty `deleted_at` means not deleted.
- Pagination: `?page=1&page_size=20` (max 100), `data = { "items": [], "total": 123 }`.
- Soft delete: `DELETE` goes to trash, physical cleanup after 30 days; restore with `POST …/restore`.

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "reason" }
```

Headers and login are under [Auth](/docs/api-auth). Health check: [GET /healthz](/docs/api-healthz).

## Reverse proxy

Auth is headers, not cookies. Generation and uploads can run for minutes — raise timeouts and body size.

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8383/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 300s;
    client_max_body_size 512m;
}
```

## Page to API

| Page | API |
| --- | --- |
| web `/projects` | [List](/docs/api-project-list), [create](/docs/api-project-create) |
| web `/canvas?id=` | [Get canvas](/docs/api-canvas-get), [save](/docs/api-canvas-update) |
| web generate | [Models](/docs/api-models-list) → [create task](/docs/api-task-create) → [poll](/docs/api-task-get) |
| web `/studio` `/watch/:id` | [Feed](/docs/api-public-feed), [work](/docs/api-public-work) |
| web `/settings` wallet | [Wallet](/docs/api-wallet-get), [order](/docs/api-order-create) |
| manage `/user` | [Users](/docs/api-admin-user-list), [impersonate](/docs/api-admin-console-access) |
| manage `/community-audit` | [Review](/docs/api-admin-review-work), [reports](/docs/api-admin-report) |
| manage `/model-price` | [Prices](/docs/api-admin-model-price), [fetch](/docs/api-admin-fetch-models) |
| partner dashboard | [Overview](/docs/api-partner-overview), [stats](/docs/api-partner-stats) |
