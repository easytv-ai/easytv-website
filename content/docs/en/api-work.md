---
title: Works
description: Publish a film from an asset, likes, comments, process graph. The public feed is a separate anonymous set.
---

CRUD needs [auth](/docs/api-auth). Feed and comment lists: [Public feed](/docs/api-public).

`status`: 0 draft / 1 published / 2 taken down / -1 rejected. `review_status`: 0 pending / 1 pass / 2 reject. Publish is not blocked; review is after the fact.

## POST `/user/work`

`{ title, asset_id, description?, project_id?, canvas_id?, cover_url?, category?, show_process? }`. Lands as `status=1`. Empty cover uses the asset frame. `show_process` defaults true.

## GET `/user/work`

Mine. `status?`, `keyword?`, pagination.

## PUT `/user/work/:id`

`status` 1 or 2 to publish / take down. Empty-string `cover_url` re-extracts a frame.

## POST `/user/work/:id/like`

Toggle. `{ liked, like_count }`.

## GET `/user/work/likes`

Works I liked that are still published.

## POST `/user/work/:id/comment`

`{ content, parent_id? }`, 30/min. Delete: `DELETE /user/comment/:id`. Report work / comment with `{ reason, content? }`.
