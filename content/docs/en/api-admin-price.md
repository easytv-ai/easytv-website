---
title: Admin pricing
description: Plans, packs, model prices, gateway import, refunds and credit adjustments. Writes are RootAuth.
---

## Plans and packs

`GET/POST/PUT/DELETE /admin/plan`, `/admin/points-pack`. Promo: `GET/PUT /admin/billing/promo`.

## GET `/admin/model-price`

`page`, `page_size` (default 10), `sort_by`, `order`. `model` must match the gateway id — this is the only source for `GET /generation/models`.

## Gateway

| Method | Path | Notes |
| --- | --- | --- |
| GET/PUT | `/admin/gateway/config` | URL, token, FX, markup. Hot reload |
| GET | `/admin/gateway/fetch-models` | Pull models and suggested credits |
| POST | `/admin/gateway/models/import` | Write `model_price` |

Suggested credits = USD cost × FX × markup × credits-per-yuan. See [Gateway](/docs/gateway).

## Orders

`GET /admin/order`. `POST …/close`, `…/mark-paid`, `…/refund` `{ reason }` (full refund, claw back unused credits). `GET /admin/wallet`, `POST /admin/wallet/:user_id/adjust` `{ delta, reason, valid_days? }`. `GET /admin/points/log`.
