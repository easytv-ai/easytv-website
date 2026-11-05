---
title: Public feed
description: Anonymous works, skills, notices, categories, canvas share. Auth adds liked / favorited / mine.
---

## GET `/work`

Published only. Sort `featured desc, sort_order asc, published_at desc`. Query `keyword`, `category`, `featured=1`, `user_id`, pagination. Each row has `author: { id, nickname }`.

## GET `/work/:id`

Increments views.

## GET `/work/:id/process`

Process graph when the author left `show_process` on and set `canvas_id`.

## GET `/work/:id/comments`

Top-level comments, newest first, up to 3 replies each. All replies: `GET /comment/:id/replies`.

## GET `/author/:id`

`{ id, nickname, joined_at, work_count, like_total, view_total, mine }`.

## GET `/skill` · GET `/skill/:id`

Official listed skills. Detail increments `uses`. List has `graph_nodes`; detail has `graph`.

## GET `/category`

`scope=work|skill`.

## GET `/banner` · GET `/notice`

Home carousel (max 10) and published notices.

## GET `/share/canvas/:token`

Read-only share. Graph strips task state and asset ids, keeps prompts and media URLs. Copy as mine after login: `POST /user/share/canvas/:token/copy`.

## GET `/partner/:code`

Landing `{ name, intro, valid }`.

Plans and quotes: [Orders](/docs/api-order). Model list: [Models](/docs/api-models).
