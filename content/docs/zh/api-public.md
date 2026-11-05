---
title: 公开信息流
description: 无需登录的作品、技能、公告、分类、画布分享。带登录态时会多 liked / favorited / mine。
---

这些接口可匿名。带上鉴权头时，作品会附 `liked`，技能附 `favorited`，评论附 `mine`。

## GET `/work`

作品信息流。只返回 `status=1`。排序 `featured desc, sort_order asc, published_at desc`。

| Query | 说明 |
| --- | --- |
| `keyword` | 标题 |
| `category` | 分类 |
| `featured=1` | 只取精选 |
| `user_id` | 某作者 |
| `page` / `page_size` | 分页 |

每条附 `author: { id, nickname }`。

```bash
curl "$API/work?featured=1&page=1&page_size=12"
```

## GET `/work/:id`

详情，浏览数 +1。

## GET `/work/:id/process`

制作过程。作者关了 `show_process` 或没带 `canvas_id` 时不可看。返回节点（kind / label / prompt / content / model）与连线，供播放页只读展示。

## GET `/work/:id/comments`

一级评论分页（最新在前），每条附最多 3 条回复。全部回复：`GET /comment/:id/replies`。

## GET `/author/:id`

作者主页：`{ id, nickname, joined_at, work_count, like_total, view_total, mine }`。

## GET `/skill` · GET `/skill/:id`

官方已上架技能。`category` / `keyword`。详情会把 `uses` +1。列表只返回 `graph_nodes`，详情返回 `graph`。

## GET `/category`

`scope=work|skill`，默认 work。

## GET `/banner`

首页轮播。上架且在生效期内，按 `sort_order` 倒序，最多 10 条。

## GET `/notice` · GET `/notice/:id`

已发布公告，置顶优先。

## GET `/prompt`

提示词库（已上架，列表不含正文）。详情 `GET /prompt/:id` 含正文，复制次数 +1。标签云 `GET /prompt/tags`。

## GET `/share/canvas/:token`

画布只读分享。graph 会去掉任务状态和资产 ID，保留节点内容、提示词、媒体地址。

```json
{
  "success": true,
  "data": {
    "name": "未命名草稿",
    "node_count": 6,
    "updated_at": 1730000000,
    "owner": { "id": 1, "nickname": "demo" },
    "graph": {},
    "mine": false
  }
}
```

复制为我的：登录后 `POST /user/share/canvas/:token/copy`。

## GET `/partner/:code`

渠道落地页 `{ name, intro, valid }`。无效 `success=false`。

钱包、套餐的公开接口在 [订单](/docs/api-order)：`GET /billing/plans`、`POST /billing/quote`。模型清单在 [模型](/docs/api-models)。
