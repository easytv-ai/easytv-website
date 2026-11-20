---
title: 通路控制台
description: easytv-partner 用的 /user/partner/console/* 。和創作台同一套登入，資料只限本人名下。
---

通路後台 **不另建帳號**。夥伴用自己的 EasyTV 帳號登入。暱稱去識別化，不含客戶手機號碼 / 信箱 / 訂單明細。

未申請：`success=false, code="not_applied"`。未通過時 `stats` / `customers` 回傳 `code="not_approved"`。返佣餘額是使用者 `quota` 折算的人民幣，**不是創作積分**。
