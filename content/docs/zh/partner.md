---
title: 渠道后台
description: easytv-partner 给 MCN、院校、KOL 用的自助返佣与推广后台。
---

渠道后台对接 `/user/partner/*`，仓库 [easytv-partner](https://github.com/easytv-ai/easytv-partner)。伙伴用普通 EasyTV 账号登录，申请入驻，通过后拿到专属链接和专属码。

## 伙伴能做什么

| 领域 | 说明 |
| --- | --- |
| 看板 | 客户数、付费、成交与返佣；7 / 30 / 90 天趋势 |
| 归属客户 | 脱敏昵称、来源、首次付费、累计实付 |
| 返佣与提现 | 流水、提现记录、申请提现（支付宝 / 微信 / 银行卡） |
| 口令红包 | 领取、注册与付费转化 |
| 推广物料 | 链接、二维码、文案、规则 |
| 入驻 | 申请、驳回后重提、改联系方式 |

返佣比例、归因窗口和审核在运营后台 **系统 → 增长** 以及「渠道伙伴」页配置。管理员也可以发一次性凭证直接进入某个伙伴的控制台。

## 运行

```bash
pnpm dev          # :3010
```

`NUXT_PUBLIC_API_BASE_URL` 指向 API，`NUXT_PUBLIC_STUDIO_URL` 指向创作台（推广链接兜底）。

Docker：

```bash
docker run -d -p 3010:3010 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-partner:latest
```

管理员在运营后台「渠道伙伴」页可以发一次性凭证，打开 `/console?ticket=` 直接进入某个伙伴的控制台。
