---
title: Partner console
description: /user/partner/console/* for easytv-partner. Same login as the studio; data is scoped to the partner.
---

No separate accounts. UserAuth. Nicknames are masked; no customer phone / email / order lines.

## POST `/user/partner/apply`

`{ name, kind, contact, intro }`. Repeat calls return current status.

## GET `/user/partner/me`

`null` if never applied. Approved: profile, links, customers, GMV, rebate, withdrawable, recent rows.

## GET `/partner/:code`

Public landing `{ name, intro, valid }`.

## GET `/user/partner/console/overview`

`/me` fields plus `rebate_months`, this-month stats, `server_time`. Never applied: `code="not_applied"`. Pending / rejected / disabled still return `partner` with zero `month`.

## GET `/user/partner/console/stats`

`range=7d|30d|90d`. Daily rows, missing days filled with 0. `amount` is customer pay-in, `rebate` is commission, CNY.

## GET `/user/partner/console/customers`

`paid`, `sort=recent|amount`, pagination.

## GET `/user/partner/console/bonus-codes`

Read-only. Create codes in admin.

## PUT `/user/partner/console/profile`

Pending: all fields. Rejected: edit returns to pending. Approved: `contact` / `intro` only. Disabled: no edits.

Unapproved `stats` / `customers` / `bonus-codes`: `code="not_approved"`.

Withdrawals reuse `GET /user/bills/self`, `GET /user/withdraw/self`, `POST /user/withdraw`. Balance is `quota` in yuan, **not** studio credits.

Admin: `GET /admin/partner`, `PUT /admin/partner/:id/review` `{ action: approve|reject|disable, rebate_rate?, remark? }`. After approval, `POST /admin/user/:id/console_access` opens the partner console.
