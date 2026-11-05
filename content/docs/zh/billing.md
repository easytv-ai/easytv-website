---
title: 计费与支付
description: 积分批次、会员价、预扣结算，以及微信 / 支付宝怎么接到创作台。
---

创作只认 **积分**。历史遗留的 `quota` 只给提现等旧功能，不参与生成。契约在 `API.md` 第 6 章。

![运营后台看板里的积分与成交](/images/docs/admin.svg)

## 积分怎么算

- 入账是「批次」：来源 + 数量 + 过期时间。消耗按 **最早过期优先**
- 余额 = 未过期批次剩余之和
- 创建任务时按模型参数 **预扣**（`freeze` 流水）；成功 `settle`（金额 0，估算即结算）；失败 / 取消退回一笔 365 天有效的 `refund` 批次
- **没有定价的模型不能创建任务**
- 服务端重新计价，前端展示的报价只是参考。下单响应里的 `price` 才是应付

模型单价在 `model_price`：

| 字段 | 含义 |
| --- | --- |
| `type` | `text` / `image` / `video` / `audio` |
| `unit` | `second`（视频按秒）/ `image`（按张）/ `call`（文本、语音按次） |
| `points_per_unit` | 标准价 |
| `member_points_per_unit` | 会员价，0 表示同标准价 |

估算：视频 `duration × count × 单价`；图片 / 文本 / 语音 `count × 单价`。创建任务时 `count` 只能是 1，批量由前端拆成多条。

导入定价时的建议积分：网关美元成本 × 汇率（默认 7.3）× 毛利系数（默认 3）× 积分/元（默认 20）。按量模型会按假设 token 用量折成次 / 张 / 秒。运营可在网关设置里改这些系数。

## 会员与积分包

会员计划（`starter` / `creator` / `pro` / `flagship`）每月发积分，有效期内生成走会员价。开通即发首月（31 天有效），之后由后台任务按发放日补发。

积分包按天有效（30 / 90 / 365 / 730）。会员买积分包走 `member_price`。

年 / 季折扣、团队席位折扣写在 setting `BillingPromo` JSON 里，过期后倍率全部回到 1。

免费账号还有并发路数和云存储上限（`FREE_CONCURRENT` / `FREE_STORAGE_GB`，会员计划会覆盖）。

## 下单

创作台 `/pricing`：`POST /user/order`，`payment_method` 为

- `wechat_native`：返回 `code_url`，前端画二维码
- `alipay_f2f`：当面付二维码
- `alipay_pc`：跳转收银台 `payment_url`

渠道没开时订单仍是 `pending`，`pay` 为 null。`order_no` 同时当支付单号。微信 `/wechat/webhook`、支付宝 `/alipay/webhook` 回调后履约（发会员或发积分），幂等。

## 后台要配的

1. **系统 → 站点**：`ServerAddress` 填 API 对外根地址（不要末尾斜杠），用来拼回调
2. **系统 → 支付**：微信 APIv3 Native、支付宝证书模式（当面付 / 电脑网站支付可分开）
3. **会员计划 / 积分包 / 模型定价** 三页维护商品
4. 本地不想接支付：在用户页给测试账号手动加积分

发票、退款、手动标记已支付只有超级管理员（`role ≥ 100`）能做。
