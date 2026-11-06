---
title: Auth and sign-in
description: Bearer + EasyTV-User, the team header, email / SMS login, and the shared error envelope.
---

Studio, admin and partner share one login. **Do not authenticate with cookies.** `$API` defaults to `http://127.0.0.1:8383`.

Header, body and 200 payloads for each route are in the left submenu.

## Headers

| Header | When | Notes |
| --- | --- | --- |
| `Authorization` | `/user/*`, `/admin/*` | `Bearer <access_token>` |
| `EasyTV-User` | same | Current user id; must match the token |
| `EasyTV-Team` | optional | Team space id. Missing / `0` is personal space |
| `Content-Type` | JSON body | `application/json` |
| `Accept-Language` | model detail | Forwarded to the gateway |

`/admin/*` also needs `role ≥ 10`. Settings, refunds and credit adjustments need `role ≥ 100` (RootAuth). Add `EasyTV-Team` for team space. Generation in team space spends the owner pool; personal space always spends the caller's wallet.

## Envelope

HTTP is **always 200**. Read `success` in the JSON. No-access and missing resources both return `资源不存在`, so you cannot probe existence. Some routes add `code` (`not_applied` / `not_approved` on the partner console).

## Common errors

| message | Meaning |
| --- | --- |
| `无效的参数` | Bad JSON or empty required field |
| `用户名或密码错误` | Login failed |
| `资源不存在` | Missing or no access |
| `权限不足` | Admin hit a RootAuth route |
| `积分不足，还需 N 积分` | Not enough credits to create a task |
| `模型未定价` / `模型暂未接入` | `model` is not on the live `model_price` list |
