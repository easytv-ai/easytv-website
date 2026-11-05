---
title: 项目
description: 作品容器。画布挂在项目下；不传 project_id 新建画布时后端会自动建同名项目。
---

需要 [鉴权](/docs/api-auth)。调用方是创作台 `/projects`。

实体字段见契约 1.1：`id`、`user_id`、`name`、`description`、`cover_url`、`status`、`canvas_id`（只读，最近更新的画布）、时间戳。列表里 `cover_url` 为空时会附带最近一张画面，不写回数据库。

## GET `/user/project`

我的项目。

| Query | 说明 |
| --- | --- |
| `keyword` | 按名称模糊搜 |
| `page` / `page_size` | 分页，上限 100 |

```bash
curl "$API/user/project?page=1&page_size=20" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID"
```

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 12,
        "name": "夜城短剧",
        "description": "",
        "cover_url": "https://cdn.example/cover.jpg",
        "canvas_id": 88,
        "status": 1,
        "created_at": 1730000000,
        "updated_at": 1730000100,
        "deleted_at": 0
      }
    ],
    "total": 1
  }
}
```

点卡片打开画布用返回的 `canvas_id`：`/canvas?id=88`。

## POST `/user/project`

新建。

| 字段 | 类型 | 必填 |
| --- | --- | --- |
| `name` | string(100) | 是 |
| `description` | string(500) | 否 |

```bash
curl -X POST "$API/user/project" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -H "Content-Type: application/json" \
  -d '{"name":"夜城短剧","description":""}'
```

`data` 为新建的 project。

## GET `/user/project/:id`

详情，带该项目下的画布列表（不含 graph）。

```json
{
  "success": true,
  "data": {
    "project": { "id": 12, "name": "夜城短剧" },
    "canvases": [{ "id": 88, "name": "未命名草稿", "updated_at": 1730000100 }]
  }
}
```

越权或已删：`资源不存在`。

## PUT `/user/project/:id`

改名 / 描述 / 封面。字段均可选。

```bash
curl -X PUT "$API/user/project/12" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -H "Content-Type: application/json" \
  -d '{"name":"夜城短剧 v2","cover_url":"https://cdn.example/cover.jpg"}'
```

画布改名会同步项目名（见 [画布](/docs/api-canvas) 的 PUT）。

## DELETE `/user/project/:id`

进回收站，级联其画布。30 天后物理清理。

## POST `/user/project/:id/restore`

从回收站恢复。

## GET `/user/project/trash`

回收站列表，分页，项上带 `deleted_at`。
