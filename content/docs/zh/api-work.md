---
title: 作品
description: 从资产发布成片、点赞评论、制作过程。公开信息流是另一组匿名接口。
---

登录用户的作品 CRUD 需要 [鉴权](/docs/api-auth)。广场信息流、评论列表走 [公开信息流](/docs/api-public)。

`status`：0 草稿 / 1 已发布 / 2 已下架 / -1 审核驳回。`review_status`：0 待审核 / 1 通过 / 2 驳回。发布不阻塞，审核事后处理。

## GET `/user/work`

我的作品。`status?`、`keyword?`（标题）、分页。

## POST `/user/work`

从资产发布，直接 `status=1`。

| 字段 | 说明 |
| --- | --- |
| `title` | 必填 |
| `description` | 可选 |
| `asset_id` | 成片资产，必填 |
| `project_id` / `canvas_id` | 可选。带上才能公开制作过程 |
| `cover_url` | 留空则用成片抽帧 |
| `category` | 来自 `GET /category?scope=work` |
| `show_process` | 默认 true |

```bash
curl -X POST "$API/user/work" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -H "Content-Type: application/json" \
  -d '{"title":"赛博夜雨","asset_id":99,"canvas_id":88,"show_process":true}'
```

## PUT `/user/work/:id`

`title` / `description` / `cover_url` / `category` / `status`（1 或 2）/ `show_process`。传空串 `cover_url` 会重新抽帧。

## DELETE `/user/work/:id`

删除。

## POST `/user/work/:id/like`

点赞切换。返回 `{ liked, like_count }`。公开列表带登录态时每条作品有 `liked`。

## GET `/user/work/likes`

我赞过的、仍在发布中的作品，按点赞时间倒序。

## POST `/user/work/:id/comment`

`{ content, parent_id? }`，30 次/分钟。返回评论（含 `author`）。删自己的或作品作者可删：`DELETE /user/comment/:id`。举报：`POST /user/comment/:id/report`、`POST /user/work/:id/report`，body `{ reason, content? }`。

公开读评论：`GET /work/:id/comments`、`GET /comment/:id/replies`。
