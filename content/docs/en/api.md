---
title: API overview
description: Auth, response envelope, how the three clients split; the full contract is still API.md.
---

Entities, routes and state machines live in [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md). **Change that file before you change code.** This page is only the glue you need to wire a client.

## Conventions

- Base URL: `NUXT_PUBLIC_API_BASE_URL`, locally `http://127.0.0.1:8383`
- HTTP is always 200; read `success` in the JSON:

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "why it failed" }
```

- Pagination: `?page=1&page_size=20` (max 100), `data = { "items": [], "total": 123 }`
- Time: Unix seconds. Empty `deleted_at` means not deleted
- Soft delete: `DELETE` goes to the trash; physical purge after 30 days

## Auth

Sign-in: `POST /user/login` (email) or SMS code + `POST /user/sms_login`. The response includes `access_token`.

Every authenticated request then sends:

```
Authorization: Bearer <access_token>
EasyTV-User: <user_id>
```

Optional `EasyTV-Team: <team_id>` selects a team space. `/admin/*` needs `role ≥ 10`.

Authorization failures return `success: false, message: "资源不存在"` so absence and no-access look the same.

## Health

`GET /healthz` → `200 {"status":"ok"}`. Docker and Compose use this as the probe.

## Reverse proxy

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

Auth is headers, not cookies. User, public and admin route tables are chapter 2 of API.md on GitHub.

## How routes split

| Prefix | Who calls it | What it covers |
| --- | --- | --- |
| `/user/*` | Studio | Projects, canvases, assets, tasks, works, skills, notifications |
| `/user/partner/*` | Partner console | Apply, dashboard, customers, rebates, withdrawals, materials |
| `/admin/*` | Admin console | Users, review, prices, gateway, payments, growth. `role ≥ 10`; system settings need `role ≥ 100` |
| `/work` `/skill` `/share/*` | Public | Feed, skill plaza, read-only canvas share |
| `/generation/models` | Public | Models that already have prices imported |
| `POST /user/login` · `POST /user/sms_login` | Public | Sign-in, returns `access_token` |

Canvas `PUT` must send the current `version` (optimistic lock). The whole `graph` is capped at 2 MB — do not embed director-stage camera stills as base64.

Generation: `POST /user/task` to create, poll `GET /user/task/:id`. Credits are reserved from `model_price` and refunded on failure or cancel.
