---
title: 鉴权与登录
description: Bearer + EasyTV-User、团队空间头、邮箱 / 短信登录，以及统一错误返回。
---

创作台、运营后台、渠道后台共用同一套登录。**不要用 Cookie 做鉴权。** 下文 `$API` 默认 `http://127.0.0.1:8383`。

每条接口的 Header、请求体、200 响应在左侧子菜单里。

## 请求头

| Header | 何时需要 | 说明 |
| --- | --- | --- |
| `Authorization` | `/user/*`、`/admin/*` | `Bearer <access_token>` |
| `EasyTV-User` | 同上 | 当前用户 id，必须和 token 里的用户一致 |
| `EasyTV-Team` | 可选 | 团队空间 id。缺省 / `0` 为个人空间 |
| `Content-Type` | JSON 请求体 | `application/json` |
| `Accept-Language` | 模型详情等 | 原样转发给网关，用于文案语言 |

`/admin/*` 还要求 `role ≥ 10`。改系统设置、退款、调积分等要 `role ≥ 100`（RootAuth）。切到团队空间时再加 `EasyTV-Team`。团队空间里的生成花团队积分池；个人空间一律花自己的钱包。

## 响应包

HTTP **恒 200**。用 JSON 里的 `success`。越权与资源不存在都返回 `success: false, message: "资源不存在"`，避免枚举。部分接口另带 `code`（例如渠道控制台 `not_applied` / `not_approved`）。

## 常见错误

| message | 含义 |
| --- | --- |
| `无效的参数` | JSON 解不出或必填空 |
| `用户名或密码错误` | 登录失败，不区分账号是否存在 |
| `资源不存在` | 越权或真的没有 |
| `权限不足` | 普通管理员调了 RootAuth 接口 |
| `积分不足，还需 N 积分` | 创建任务预扣失败 |
| `模型未定价` / `模型暂未接入` | `model` 不在 `model_price` 生效清单 |
