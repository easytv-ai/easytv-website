---
title: 定价与网关
description: 会员计划、积分包、模型定价、从网关拉模型并导入、订单退款和积分调整。
---

CRUD 会员 / 积分包 / 模型定价、退款、调账是 **RootAuth**（`role ≥ 100`）。普通管理员只读。

## 会员与积分包

`GET/POST/PUT/DELETE /admin/plan`、`/admin/points-pack`。下架用 PUT `status`。促销：`GET/PUT /admin/billing/promo`（写 setting `BillingPromo`）。

## GET `/admin/model-price`

| Query | 说明 |
| --- | --- |
| `page` / `page_size` | 默认 10，上限 100 |
| `sort_by` | `model` / `type` / `unit` / `points_per_unit` |
| `order` | `asc` / `desc` |

`POST/PUT/DELETE /admin/model-price/:id` 增改删。`model` 必须与网关标识一致，这是 `GET /generation/models` 的唯一数据源。

## 网关

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET/PUT | `/admin/gateway/config` | 地址、令牌、汇率、毛利。热更新 |
| GET | `/admin/gateway/fetch-models` | 从网关拉模型与建议积分 |
| POST | `/admin/gateway/models/import` | 写入 `model_price` 并定价 |

建议积分 = 网关美元成本 × 汇率 × 毛利系数 × 积分/元。按量模型按假设用量折成次 / 张 / 秒。详见 [对接网关](/docs/gateway)。

## 订单与调账

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/admin/order` | `kind?, status?, user_id?, keyword?`，附 `user_name` |
| POST | `/admin/order/:id/close` | 关闭待支付 |
| POST | `/admin/order/:id/mark-paid` | 线下收款，标记已支付并履约 |
| POST | `/admin/order/:id/refund` | `{ reason }` 全额退款，回收未消耗积分 |
| GET | `/admin/wallet` | 每用户一行余额 |
| POST | `/admin/wallet/:user_id/adjust` | `{ delta, reason, valid_days? }` 正加负扣 |
| GET | `/admin/points/log` | 全站流水 |

退款会走原支付渠道（微信 / 支付宝）；`manual` 订单不调渠道。返回 `{ revoked_points, refund_no, channel }`。
