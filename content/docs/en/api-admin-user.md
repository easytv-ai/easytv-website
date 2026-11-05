---
title: Admin users
description: List, enable, identity, rebind, console tickets, deactivate.
---

AdminAuth. Rebind and deactivate are RootAuth.

## GET `/admin/user`

`keyword`, `status`, `deleted=1` (soft-deleted). Default omits deleted.

## GET `/admin/user/:id`

Redacted detail.

## PUT `/admin/user/:id/status`

`{ status: 1 | 2 }`.

## PUT `/admin/user/:id/identity`

`easytv_official` / `enterprise` / `easytv_teacher` / `easytv_teaching_assistant`. Empty or `__none__` clears. Regular admins cannot edit admin accounts.

## PUT `/admin/user/:id/bind`

RootAuth. `{ mobile?, wechat_unbind? }`. SMS-registered accounts cannot drop the phone. Keep at least one login method.

## POST `/admin/user/:id/console_access`

`{ ticket, path, expires_in }`. Studio: `STUDIO_URL + path`. Partner: `PARTNER_URL + /console?ticket=`. One-shot. Does not bump last-login.

## DELETE `/admin/user/:id`

Soft deactivate. Cannot delete admins.
