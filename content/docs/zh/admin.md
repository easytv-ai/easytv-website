---
title: 运营后台
description: easytv-manage 管哪些东西，以及上线后要先改哪几项设置。
---

运营后台对接 API 的 `/admin/*`，仓库 [easytv-manage](https://github.com/easytv-ai/easytv-manage)。用首次启动创建的 `admin` 账号登录。

![运营后台：看板、用户、审核、定价和网关](/images/docs/admin.svg)

## 能管什么

| 领域 | 页面 |
| --- | --- |
| 人 | 用户、团队额度、渠道伙伴 |
| 内容 | 作品、精选、分类、轮播、技能、提示词、风格、主体、项目、资产、画布 |
| 社区 | 评论 / 举报 / 动态审核、公告、通知 |
| 钱 | 订单、充值、提现、流水、会员、积分包、模型定价、发票 |
| 增长 | 活动、邀请与签到、看板 |
| 系统 | 站点、支付、网关、增长与发票（仅超级管理员） |

这里改的设置写入 `setting` 表，无需重启 API。

系统设置（仅超级管理员）分这些页签：站点、短信、发票、支付、网关与存储、AI 对话、媒体工具。增长规则（邀请、签到、成片默认模型、分成汇率）在增长页。

## 首次上线清单

1. **系统 → 网关**：填 New API 兼容地址与 Key，拉取模型并导入定价
2. **系统 → 站点**：创作台公开地址（邀请链接和回调用它）
3. **系统 → 支付**：要卖套餐或积分时开启微信 / 支付宝
4. **模型定价**：按模型调积分单价

## 运行

```bash
pnpm dev          # :3006
```

```bash
docker run -d -p 3006:3006 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  -e NUXT_PUBLIC_PARTNER_URL=https://partner.example.com \
  ghcr.io/easytv-ai/easytv-manage:latest
```

`NUXT_PUBLIC_PARTNER_URL` 给伙伴页「打开渠道后台」用。没有后端时登录页有演示账号，只能看界面。角色 `role ≥ 10` 才能进后台，改网关 / 支付 / 站点要超级管理员（`role ≥ 100`）。
