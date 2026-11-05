---
title: Billing
description: Credit lots, member prices, reserve-and-settle, and how WeChat / Alipay reach the studio.
---

Creation spends **credits** only. Legacy `quota` is for withdrawals and similar; it is not used for generation. Contract: API.md chapter 6.

## How credits work

- Each grant is a **lot**: source + amount + expiry. Spend oldest-expiring first
- Balance = remaining on unexpired lots
- Create-task **reserves** (`freeze`); success `settle`s (amount 0 — estimate is final); fail / cancel refunds a 365-day `refund` lot
- **Unpriced models cannot create tasks**
- The server re-prices. The number on the client is a hint; `price` on the order response is what you pay

Unit prices live in `model_price`:

| Field | Meaning |
| --- | --- |
| `type` | `text` / `image` / `video` / `audio` |
| `unit` | `second` (video) / `image` / `call` (text, speech) |
| `points_per_unit` | list price |
| `member_points_per_unit` | member price; 0 means same as list |

Estimate: video `duration × count × unit`; image / text / speech `count × unit`. `count` must be 1 on create; the client splits batches.

Suggested credits when importing: gateway USD cost × FX (default 7.3) × markup (default 3) × credits-per-yuan (default 20). Metered models are folded into call / image / second using assumed token usage. Operators can change those coefficients on the gateway settings.

## Membership and packs

Plans (`starter` / `creator` / `pro` / `flagship`) grant monthly credits and member prices while active. Opening a plan pays month 1 immediately (31-day lot); a cron tops up on the grant day.

Packs expire in 30 / 90 / 365 / 730 days. Members buy packs at `member_price`.

Year / quarter discounts and team-seat discounts live in setting `BillingPromo`. After `ends_at` every rate is 1.

Free accounts also have concurrency and storage caps (`FREE_CONCURRENT` / `FREE_STORAGE_GB`; plans override).

## Checkout

Studio `/pricing` calls `POST /user/order` with:

- `wechat_native` — `code_url` for a QR
- `alipay_f2f` — face-to-face QR
- `alipay_pc` — `payment_url` to the Alipay cashier

If a channel is off, the order stays `pending` and `pay` is null. `order_no` is also the payment trade no. WeChat `/wechat/webhook` and Alipay `/alipay/webhook` fulfill (grant plan or credits), idempotently.

## Admin checklist

1. **System → Site**: `ServerAddress` is the public API root (no trailing slash) for callbacks
2. **System → Payments**: WeChat APIv3 Native, Alipay cert mode (F2F / PC can be separate)
3. Maintain **plans / packs / model prices**
4. For local tests, grant credits on the Users page instead of wiring payments

Invoices, refunds and “mark paid” need super-admin (`role ≥ 100`).
