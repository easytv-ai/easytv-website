---
title: 技能
description: 官方技能广场、私有 Skill、收藏。文本任务带 skill_id 时会注入执行规则。
---

官方列表可匿名，见 [公开信息流](/docs/api-public) 的 `GET /skill`。下面是登录用户自己的。

`guide` + `output_format` 合称执行契约：`POST /user/task` 带 `skill_id` 且 `type=text` 时，服务端按「执行规则 → 输出格式 → 用户需求」拼到提示词最前。图片 / 视频任务不注入。

## GET `/user/skill`

我的私有 Skill。`keyword?`。官方技能不在这里，走 `GET /skill`。

## POST `/user/skill`

新建私有。`prompt` 里 `{{prompt}}` 是灵感占位。传 `canvas_id` 会把该画布去敏后的 graph 存成模板；传 `0` 清除。

| 字段 | 说明 |
| --- | --- |
| `title` / `prompt` | 必填 |
| `description` / `category` / `cover_url` | 可选 |
| `scene` / `howto` / `output` | 弹窗三段文案 |
| `canvas_id` | 从画布「存为 Skill」 |

## GET `/user/skill/:id`

详情含 `graph`。官方已上架技能也可读。

## PUT `/user/skill/:id` · DELETE `/user/skill/:id`

改 / 删自己的私有 Skill。后台对用户私有 Skill 只能下架，不能改内容、不能重新上架、不能删。

## GET `/user/skill/favorites`

我的收藏。`keyword?` / `category?`。

## POST `/user/skill/:id/favorite`

收藏切换。返回 `{ favorited, stars }`。带登录态的 `GET /skill` 每条会附 `favorited`。
