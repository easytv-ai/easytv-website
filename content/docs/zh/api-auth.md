---
title: 鉴权与登录
description: Bearer + EasyTV-User、团队空间头、邮箱 / 短信登录，以及统一错误返回。
---

创作台、运营后台、渠道后台共用同一套登录。**不要用 Cookie 做鉴权。** 下文 `$API` 默认 `http://127.0.0.1:8383`。

## 请求头

| Header | 何时需要 | 说明 |
| --- | --- | --- |
| `Authorization` | `/user/*`、`/admin/*` | `Bearer <access_token>` |
| `EasyTV-User` | 同上 | 当前用户 id，必须和 token 里的用户一致 |
| `EasyTV-Team` | 可选 | 团队空间 id。缺省 / `0` 为个人空间 |
| `Content-Type` | JSON 请求体 | `application/json` |
| `Accept-Language` | 模型详情等 | 原样转发给网关，用于文案语言 |

`/admin/*` 还要求 `role ≥ 10`。改系统设置、退款、调积分等要 `role ≥ 100`（RootAuth）。

curl 模板：

```bash
curl "$API/user/wallet" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID"
```

切到团队空间时再加 `-H "EasyTV-Team: $TEAM_ID"`。团队空间里的生成花团队积分池；个人空间一律花自己的钱包。

## 响应包

HTTP **恒 200**。用 JSON 里的 `success`：

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "用户名或密码错误" }
```

越权与资源不存在都返回 `success: false, message: "资源不存在"`，避免枚举。部分接口另带 `code`（例如渠道控制台 `not_applied` / `not_approved`）。

## 分页与时间

- 列表：`?page=1&page_size=20`，上限 100。`data = { "items": [], "total": 123 }`
- 时间字段全是 Unix 秒。`deleted_at` 为空表示未删除
- `DELETE` 进回收站，30 天后物理清理；对应 `POST …/restore`

## POST `/user/login`

邮箱 / 账号密码登录。无需鉴权。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `username` | string | 是 | 邮箱或用户名，不是 `email` |
| `password` | string | 是 | |

```bash
curl -X POST "$API/user/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo@easytv.ai","password":"demo123456"}'
```

成功：

```json
{
  "success": true,
  "message": "",
  "data": {
    "id": 1,
    "username": "demo@easytv.ai",
    "nickname": "demo",
    "role": 1,
    "status": 1,
    "group": "default",
    "access_token": "……"
  }
}
```

之后每个需登录请求带 `Authorization: Bearer <access_token>` 和 `EasyTV-User: <id>`。

失败：`无效的参数`（缺字段）、`用户名或密码错误`。

本地 seed 账号：`demo@easytv.ai` / `demo123456`（可用 `SEED_USER` / `SEED_PASSWORD` 覆盖）。

## GET `/sms/verification`

发短信验证码。无需鉴权。限流，重发间隔内再调返回 `发送过于频繁，请稍后再试`。

| Query | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `mobile` | string | 是 | 大陆手机号 |

```bash
curl "$API/sms/verification?mobile=13800138000"
```

成功 `data` 为 `null`。测试号（`SMS_TEST_ACCOUNTS`）不发短信，登录时认固定验证码。

失败：`手机号格式不正确`、`验证码发送失败`。

## POST `/user/sms_login`

手机号验证码登录。用户不存在则自动注册。无需鉴权。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `mobile` | string | 是 | |
| `code` | string | 是 | 6 位验证码 |

```bash
curl -X POST "$API/user/sms_login" \
  -H "Content-Type: application/json" \
  -d '{"mobile":"13800138000","code":"123456"}'
```

成功响应与 `POST /user/login` 相同，含 `access_token` 和 `id`。

失败：`手机号格式不正确`、`验证码错误或已过期`、`登录失败，请稍后重试`。

## POST `/user/logout`

登出，清除当前 `access_token`。需要鉴权。

```bash
curl -X POST "$API/user/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID"
```

```json
{ "success": true, "message": "" }
```

## 代登录

运营后台给某个用户开创作台 / 渠道后台：`POST /admin/user/:id/console_access`（Root / Admin），返回 `{ ticket, path, expires_in }`。打开 `创作台或渠道 URL + path`（渠道后台是 `/console?ticket=`）。详见 [管理：用户](/docs/api-admin-user)。

## 常见错误

| message | 含义 |
| --- | --- |
| `无效的参数` | JSON 解不出或必填空 |
| `用户名或密码错误` | 登录失败，不区分账号是否存在 |
| `资源不存在` | 越权或真的没有。不要靠这条做存在性探测 |
| `权限不足` | 普通管理员调了 RootAuth 接口 |
| `积分不足，还需 N 积分` | 创建任务预扣失败 |
| `模型未定价` / `模型暂未接入` | `model` 不在 `model_price` 生效清单 |
