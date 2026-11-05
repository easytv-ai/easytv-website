---
title: 管理：审核
description: 作品发布审核、精选、举报、评论、分类、轮播、公告和技能上下架。
---

需要 AdminAuth。对应运营后台「社区审核」「精选成片」「分类」等页。

## GET `/admin/work`

全站作品（含所有状态）。`user_id?, status?, keyword?, category?, featured?, review_status?`。`featured=1` 时按 `sort_order` 升序。

## PUT `/admin/work/:id/review`

`{ status: 1 通过 | 2 驳回, remark? }`。驳回后作品 `status=-1`；通过会恢复被驳回的作品。

## PUT `/admin/work/:id`

编辑标题、分类、封面、`featured`、`sort_order`。精选成片页用。

## PUT `/admin/work/:id/status`

`{ status, remark? }` 上下架。

## GET `/admin/work-report`

举报。`status?, target_type? (work|comment), keyword?`。待审核优先。评论举报附 `comment_id`、`comment_content`。

## PUT `/admin/work-report/:id/status`

`{ status: 1 成立 | 2 驳回, remark? }`。作品举报成立即下架；评论举报成立即隐藏评论。

## GET `/admin/comment`

`status? (1|2), work_id?, user_id?, keyword?`，附 author 与 work_title。

## PUT `/admin/comment/:id/status`

`{ status: 1 恢复 | 2 隐藏, remark? }`。隐藏时通知评论人。`DELETE` 删一级评论会连带回复。

## 分类 / 轮播 / 公告 / 技能

`GET/POST/PUT/DELETE /admin/category`、`/admin/banner`、`/admin/notice`、`/admin/skill`。

技能列表 `source=official|user`。私有 Skill 只能下架，不能改内容、不能重新上架、不能删除。
