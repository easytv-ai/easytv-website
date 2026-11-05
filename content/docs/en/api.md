---
title: API overview
description: Base URL, the response envelope, and the resource index. The contract is still API.md.
---

Entities, routes and state machines live in [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md). **Change that file before the code.** This site splits the common routes by resource, with method, params, curl and example responses.

## Conventions

- Base URL: `NUXT_PUBLIC_API_BASE_URL`, locally `http://127.0.0.1:8383`. Curl below uses `$API`.
- HTTP is **always 200**. Read `success` in the JSON.
- Timestamps are Unix seconds. Empty `deleted_at` means not deleted.
- Pagination: `?page=1&page_size=20` (max 100), `data = { "items": [], "total": 123 }`.
- Soft delete: `DELETE` goes to trash, physical cleanup after 30 days; restore with `POST …/restore`.

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "reason" }
```

Headers, sign-in and no-access replies: [Auth](/docs/api-auth).

## Health

### GET `/healthz`

Anonymous. Used as the Docker / Compose probe. Body is not the usual envelope:

```json
{ "status": "ok" }
```

## Index

| Group | Pages |
| --- | --- |
| Basics | [Auth](/docs/api-auth) · [User API index](/docs/api-user) |
| Studio | [Projects](/docs/api-project) · [Canvas](/docs/api-canvas) · [Assets](/docs/api-asset) · [Tasks](/docs/api-task) |
| Community | [Works](/docs/api-work) · [Skills](/docs/api-skill) · [Public feed](/docs/api-public) |
| Billing | [Models](/docs/api-models) · [Wallet](/docs/api-wallet) · [Orders](/docs/api-order) |
| Collab | [Teams](/docs/api-team) · [Media jobs](/docs/api-media) |
| Admin | [Admin index](/docs/api-admin) · [Users](/docs/api-admin-user) · [Review](/docs/api-admin-review) · [Pricing](/docs/api-admin-price) |
| Partner | [Partner console](/docs/api-partner) |

## Reverse proxy

Auth is headers, not cookies. Generation and uploads can run for minutes.

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
