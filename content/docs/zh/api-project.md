---
title: 项目
description: 作品容器。画布挂在项目下；不传 project_id 新建画布时后端会自动建同名项目。
---

需要 [鉴权](/docs/api-auth)。调用方是创作台 `/projects`。

实体字段：`id`、`user_id`、`name`、`description`、`cover_url`、`status`、`canvas_id`（只读，最近更新的画布）、时间戳。列表里 `cover_url` 为空时会附带最近一张画面，不写回数据库。点卡片打开画布用返回的 `canvas_id`。
