---
title: Auth and sign-in
description: Bearer + EasyTV-User, the team header, email / SMS login, and the shared error envelope.
---

Studio, admin and partner share one login. **Do not authenticate with cookies.** `$API` defaults to `http://127.0.0.1:8383`.

## Headers

| Header | When | Notes |
| --- | --- | --- |
| `Authorization` | `/user/*`, `/admin/*` | `Bearer <access_token>` |
| `EasyTV-User` | same | Current user id; must match the token |
| `EasyTV-Team` | optional | Team space id. Missing / `0` is personal space |
| `Content-Type` | JSON body | `application/json` |
| `Accept-Language` | model detail | Forwarded to the gateway |

`/admin/*` also needs `role ≥ 10`. Settings, refunds and credit adjustments need `role ≥ 100` (RootAuth).

```bash
curl "$API/user/wallet" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID"
```

Add `-H "EasyTV-Team: $TEAM_ID"` for team space. Generation in team space spends the owner pool; personal space always spends the caller's wallet.

## Envelope

HTTP is **always 200**:

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "invalid username or password" }
```

No-access and missing resources both return `资源不存在`, so you cannot probe existence. Some routes add `code` (`not_applied` / `not_approved` on the partner console).

## POST `/user/login`

Email / username + password. No auth header.

| Field | Type | Required |
| --- | --- | --- |
| `username` | string | yes — not `email` |
| `password` | string | yes |

```bash
curl -X POST "$API/user/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo@easytv.ai","password":"demo123456"}'
```

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "demo@easytv.ai",
    "nickname": "demo",
    "role": 1,
    "status": 1,
    "group": "default",
    "access_token": "…"
  }
}
```

Then send `Authorization` and `EasyTV-User` on every authed call.

Errors: `无效的参数`, `用户名或密码错误`. Seed account: `demo@easytv.ai` / `demo123456`.

## GET `/sms/verification`

Send an SMS code. Query `mobile`. Rate limited.

## POST `/user/sms_login`

`{ mobile, code }`. Missing users are registered automatically. Same success payload as password login.

## POST `/user/logout`

Clears the current `access_token`. Auth required.

## Impersonation

`POST /admin/user/:id/console_access` returns `{ ticket, path, expires_in }`. Open studio or partner URL + `path`. See [Admin users](/docs/api-admin-user).

## Common errors

| message | Meaning |
| --- | --- |
| `无效的参数` | Bad JSON or empty required field |
| `用户名或密码错误` | Login failed |
| `资源不存在` | Missing or no access |
| `权限不足` | Admin hit a RootAuth route |
| `积分不足，还需 N 积分` | Not enough credits to create a task |
| `模型未定价` / `模型暂未接入` | `model` is not on the live `model_price` list |
