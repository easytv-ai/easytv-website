---
title: 用户侧总表
description: 创作台调用的 /user/* 一览。详细参数、curl 和响应在各资源页。
---

前缀 `/user/*`，需要 [鉴权](/docs/api-auth)。调用方主要是 [easytv-web](https://github.com/easytv-ai/easytv-web)。下面是完整路由表；点进去看请求体和示例。

## 项目与画布

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/user/project` | 我的项目。`keyword, page, page_size` |
| POST | `/user/project` | 新建 `{ name, description }` |
| GET | `/user/project/:id` | 详情，带 `canvases` |
| PUT | `/user/project/:id` | 改名 / 描述 / 封面 |
| DELETE | `/user/project/:id` | 进回收站（级联画布） |
| POST | `/user/project/:id/restore` | 恢复 |
| GET | `/user/project/trash` | 项目回收站 |
| GET | `/user/canvas` | 画布列表。`project_id?` |
| POST | `/user/canvas` | 新建。不传 `project_id` 会自动建同名项目 |
| GET | `/user/canvas/:id` | 含 `graph` |
| PUT | `/user/canvas/:id` | 保存。**必须带当前 `version`** |
| DELETE | `/user/canvas/:id` | 进回收站 |
| GET | `/user/canvas/:id/versions` | 版本历史 |
| GET | `/user/canvas/:id/versions/:vid` | 单条版本（含 graph） |
| POST | `/user/canvas/:id/versions/:vid/restore` | 回滚 |
| GET/PUT | `/user/canvas/:id/share` | 只读分享开关 |
| GET/POST/PUT/DELETE | `/user/canvas/:id/chat` | 对话历史 |
| POST | `/user/share/canvas/:token/copy` | 复制分享画布为我的项目 |

详见 [项目](/docs/api-project)、[画布](/docs/api-canvas)。

## 资产与生成

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/user/asset` | 列表。`type?, project_id?, source?, keyword?` |
| GET | `/user/asset/:id` | 单个 |
| POST | `/user/asset/upload` | multipart，字段 `file` |
| POST | `/user/asset/import` | 从 URL / 已有资产引入 |
| DELETE | `/user/asset/:id` | 进回收站 |
| GET | `/user/asset/trash` | 回收站 |
| POST | `/user/asset/:id/restore` | 恢复 |
| GET | `/generation/models` | 已导入定价的可用模型（可匿名） |
| GET | `/generation/models/detail` | 模型详情（可匿名） |
| POST | `/user/task` | 创建生成 |
| GET | `/user/task` | 任务列表 |
| GET | `/user/task/:id` | 详情，前端轮询 |
| POST | `/user/task/:id/cancel` | 取消 pending / running |
| POST | `/user/task/:id/retry` | 按原参数重试 |
| GET | `/user/task/summary` | 任务中心概览 |
| GET | `/user/media/actions` | 媒体工具动作清单 |
| POST | `/user/media/jobs` | 创建媒体作业 |
| GET | `/user/media/jobs` `/user/media/jobs/:id` | 作业列表 / 详情 |

详见 [资产](/docs/api-asset)、[生成任务](/docs/api-task)、[模型](/docs/api-models)、[媒体工具](/docs/api-media)。

## 作品、技能、通知

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET/POST | `/user/work` | 我的作品 / 从资产发布 |
| PUT / DELETE | `/user/work/:id` | 修改、上下架、删除 |
| POST | `/user/work/:id/like` | 点赞切换 |
| GET | `/user/work/likes` | 我赞过的 |
| POST | `/user/work/:id/comment` | 评论 |
| POST | `/user/work/:id/report` | 举报作品 |
| DELETE | `/user/comment/:id` | 删评论 |
| GET/POST/PUT/DELETE | `/user/skill` | 私有 Skill |
| GET | `/user/skill/favorites` | 收藏 |
| POST | `/user/skill/:id/favorite` | 收藏切换 |
| GET | `/user/notification` | 站内通知。`unread=1?` |
| POST | `/user/notification/read` | `{ ids?: [] }` 标记已读 |
| GET/PUT | `/user/notification/prefs` | 通知偏好 |
| POST | `/user/self/mobile` | `{ mobile, code }` 绑手机 |
| POST | `/user/self/deactivate` | `{ password }` 自助注销 |

详见 [作品](/docs/api-work)、[技能](/docs/api-skill)。

## 钱包、订单、团队

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/user/wallet` | 余额、冻结、会员 |
| GET | `/user/points/log` | 积分流水 |
| GET | `/user/points/lots` | 未过期批次 |
| POST | `/user/order` | 下单并发起支付 |
| GET | `/user/order` `/user/order/:id` | 我的订单 / 详情 |
| POST | `/user/order/:id/pay` | 换渠道支付 |
| POST | `/user/order/:id/close` | 取消待支付 |
| GET | `/user/membership` | 当前会员 |
| GET | `/user/team` | 我的团队 |
| PUT | `/user/team` | 改名 |
| POST | `/user/team/invite` `/user/team/join` | 邀请码 / 加入 |
| GET | `/user/usage` `/user/team/usage` | 额度 |

详见 [钱包](/docs/api-wallet)、[订单](/docs/api-order)、[团队](/docs/api-team)。
