---
title: 接口概览
description: 鉴权、响应包、三端如何分工；完整契约仍以 API.md 为准。
---

完整实体、路由和状态机写在 [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md)。**改接口先改那份文件，再改代码。** 下面只放对接时最常用的约定。

## 约定

- Base URL：`NUXT_PUBLIC_API_BASE_URL`，本地默认 `http://127.0.0.1:8383`
- HTTP 恒 200，用 JSON 里的 `success` 判断成败：

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "错误原因" }
```

- 分页：`?page=1&page_size=20`（上限 100），`data = { "items": [], "total": 123 }`
- 时间：Unix 秒。`deleted_at` 为空表示未删除
- 软删：`DELETE` 进回收站，30 天后物理清理

## 鉴权

登录：`POST /user/login`（邮箱）或短信验证码 + `POST /user/sms_login`，响应带 `access_token`。

之后每个需登录请求带：

```
Authorization: Bearer <access_token>
EasyTV-User: <user_id>
```

可选 `EasyTV-Team: <team_id>` 切换团队空间。`/admin/*` 要求 `role ≥ 10`。

越权时统一返回 `success: false, message: "资源不存在"`，不区分没有和没权。

## 健康检查

`GET /healthz` → `200 {"status":"ok"}`。Docker 与 Compose 都用它做探针。

## 反向代理示例

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

鉴权走 Header 而不是 Cookie。契约里的用户侧、公开、管理侧路由表见 GitHub 上的 API.md 第 2 章。

## 路由怎么分

| 前缀 | 谁调 | 做什么 |
| --- | --- | --- |
| `/user/*` | 创作台 | 项目、画布、资产、任务、作品、技能、通知 |
| `/user/partner/*` | 渠道后台 | 入驻、看板、客户、返佣、提现、物料 |
| `/admin/*` | 运营后台 | 用户、审核、定价、网关、支付、增长。`role ≥ 10`；改系统设置要 `role ≥ 100` |
| `/work` `/skill` `/share/*` | 公开 | 信息流、技能广场、画布只读分享 |
| `/generation/models` | 公开 | 已导入定价的可用模型 |
| `POST /user/login` · `POST /user/sms_login` | 公开 | 登录，返回 `access_token` |

画布 `PUT` 必须带当前 `version`（乐观锁）。整张 `graph` 上限 2 MB，导演台节点不要塞机位截图 base64。

生成：`POST /user/task` 创建，前端轮询 `GET /user/task/:id`。积分按 `model_price` 预扣，失败或取消后退回。
