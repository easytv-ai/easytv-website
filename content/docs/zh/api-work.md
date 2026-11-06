---
title: 作品
description: 从资产发布成片、点赞评论、制作过程。公开信息流是另一组匿名接口。
---

登录用户的作品 CRUD 需要 [鉴权](/docs/api-auth)。广场信息流走 [公开接口](/docs/api-public)。

`status`：0 草稿 / 1 已发布 / 2 已下架 / -1 审核驳回。`review_status`：0 待审核 / 1 通过 / 2 驳回。发布不阻塞，审核事后处理。带上 `canvas_id` 才能公开制作过程。
