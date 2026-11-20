---
title: 開源授權
description: AGPL-3.0 與商業授權怎麼選，哪些儲存庫有商業條款。
---

產品儲存庫採用 **AGPL-3.0 + 商業** 雙授權：

| 儲存庫 | 授權 |
| --- | --- |
| easytv-api / web / manage / partner | AGPL-3.0，另附商業授權範本 |
| easytv-website | 僅 AGPL-3.0（介紹站，不賣授權） |

## 什麼時候只用 AGPL

學習、修改、自建部署，並且遵守 AGPL（把修改版作為網路服務提供給他人時，須公開對應原始碼）。**AGPL 允許商用**，只是帶網路 copyleft。

## 什麼時候要商業授權

閉源產品，或以 SaaS / 白牌代管修改版，且不想承擔上述開源義務。儲存庫裡的 `COMMERCIAL-LICENSE.md` 是範本，雙方簽訂訂單後才生效。

寫信到 [leida@easyapi.com](mailto:leida@easyapi.com)，主旨加 `[LICENSE] easytv-api`（或對應儲存庫名稱）。

## 第三方

- 導演台移植自 [open-director](https://github.com/x1n9/open-director)（MIT）
- API 的使用者 / 金流 / 物件儲存結構參考 [One API](https://github.com/songquanpeng/one-api) 等上游開源專案。**商業授權不能改變這些部分**
- npm / Go 相依套件各依原授權條款
