---
title: 管理：用户
description: 用户列表、启用禁用、运营身份、换绑、代登创作台 / 渠道后台、注销。
---

需要 AdminAuth。换绑、注销是 RootAuth。

## GET `/admin/user`

| Query | 说明 |
| --- | --- |
| `keyword` | 昵称 / 邮箱 / 手机 |
| `status` | 启用 / 禁用 |
| `deleted=1` | 已注销软删账号。缺省不含 |

## GET `/admin/user/:id`

详情（脱敏）。

## PUT `/admin/user/:id/status`

`{ status: 1 | 2 }` 启用 / 禁用。

## PUT `/admin/user/:id/identity`

运营身份：`easytv_official` / `enterprise` / `easytv_teacher` / `easytv_teaching_assistant`。空或 `__none__` 去掉。普通管理员不能改管理员账号。

## PUT `/admin/user/:id/bind`

RootAuth。`{ mobile?, wechat_unbind? }` 换绑手机 / 解绑微信，不走短信。短信注册账号不能清空手机号；至少保留一种登录方式。

## POST `/admin/user/:id/console_access`

代登。返回 `{ ticket, path, expires_in }`。

- 创作台：打开 `NUXT_PUBLIC_STUDIO_URL + path`
- 渠道后台：`NUXT_PUBLIC_PARTNER_URL + /console?ticket=`

ticket 一次性，过期作废。不更新该用户的最近登录时间。

## DELETE `/admin/user/:id`

注销（软删）。不可删管理员。
