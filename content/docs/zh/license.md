---
title: 开源协议
description: AGPL-3.0 与商业许可怎么选，哪些仓库有商业条款。
---

产品仓库采用 **AGPL-3.0 + 商业** 双许可：

| 仓库 | 协议 |
| --- | --- |
| easytv-api / web / manage / partner | AGPL-3.0，另附商业许可模板 |
| easytv-website | 仅 AGPL-3.0（介绍站，不卖授权） |

## 什么时候只用 AGPL

学习、修改、自建部署，并且遵守 AGPL（把修改版作为网络服务提供给他人时，须公开对应源代码）。**AGPL 允许商用**，只是带网络 copyleft。

## 什么时候要商业许可

闭源产品，或以 SaaS / 白标托管修改版，且不想承担上述开源义务。仓库里的 `COMMERCIAL-LICENSE.md` 是模板，双方签订单后才生效。

写信到 [leida@easyapi.com](mailto:leida@easyapi.com)，主题加 `[LICENSE] easytv-api`（或对应仓库名）。

## 第三方

- 导演台移植自 [open-director](https://github.com/x1n9/open-director)（MIT）
- API 的用户 / 支付 / 对象存储结构参考 [New API](https://github.com/QuantumNous/new-api) / [One API](https://github.com/songquanpeng/one-api)（AGPL-3.0）。**商业许可不能改变这些部分**
- npm / Go 依赖各跟原许可证
