---
title: Admin review
description: Publish review, featured films, reports, comments, categories, banners, notices, skills.
---

## GET `/admin/work`

All statuses. `review_status?`, `featured=1` sorts by `sort_order`.

## PUT `/admin/work/:id/review`

`{ status: 1 pass | 2 reject, remark? }`. Reject sets work `status=-1`.

## PUT `/admin/work/:id`

Title, category, cover, `featured`, `sort_order`.

## PUT `/admin/work/:id/status`

Take down / restore.

## GET `/admin/work-report`

`target_type=work|comment`. Acting `status: 1` takes the work down or hides the comment.

## GET `/admin/comment`

Hide/restore via `PUT …/status`. Deleting a top-level comment deletes replies.

CRUD: `/admin/category`, `/admin/banner`, `/admin/notice`, `/admin/skill`. Private skills can only be taken down.
