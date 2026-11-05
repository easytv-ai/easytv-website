---
title: Connect a gateway
description: Point EasyTV at a New API / One API-compatible gateway, pull models and import credit prices.
---

EasyTV calls models through OpenAI-compatible routes: `/v1/chat`, `/v1/images`, `/v1/videos` (and audio if the gateway exposes it). **You need a gateway before generation works.**

Set the gateway URL and key under admin **System → Gateway**. Changes apply without a restart.

![Admin gateway](/images/docs/admin.svg)

## First-time setup

1. Have a running [New API](https://github.com/QuantumNous/new-api) (or another compatible gateway) token that can call the text / image / video models you care about.
2. Sign in to the admin console as `admin` → **System → Gateway**.
3. Save the gateway base URL and key.
4. Fetch the model list and **import pricing** for the models you will use.
5. Check per-second / per-image / per-call credit prices under **Model pricing**. The studio's cost estimates read from here.

Setting keys: `EasyAPIGatewayBaseUrl`, `EasyAPIGatewayKey`, `EasyAPIGatewayEnabled`. Unit prices live in `model_price`.

If the call host and the pricing host differ (e.g. `api.xxx.com` vs `token.xxx.com`), also set `EasyAPIGatewayPricingBaseUrl`. Real gateway balance needs the console “system access token” `EasyAPIGatewayAccessToken` (sk tokens do not show a real balance). Below `GatewayBalanceAlertUSD` (default 20 USD) admins get an in-app notice.

Suggested credits:

```
gateway USD cost × FX (7.3) × markup (3) × credits-per-yuan (20)
```

Metered models are folded into call / image / second using assumed token usage. You can change those coefficients. After import, still review **Model pricing** — especially video-per-second and the `native_audio` ability for talking-head.

## What the gateway actually sees

EasyTV does not call vendor SDKs. Everything goes through `service/providers/easyapi.go`:

| Type | Gateway path |
| --- | --- |
| Text | `POST /v1/chat/completions` (up to 4 images for vision) |
| Image | `POST /v1/images/generations` |
| Speech | `POST /v1/audio/speech` |
| Video | `POST /v1/videos`, then poll `GET /v1/videos/{job_id}` |

Assets use `input_references[{type,url,role}]`. Image-to-video URLs must be GET-able by the gateway; see [Storage](/docs/storage).

429 / 503 retry twice (honours `Retry-After`). 502 / 504 may already have created an upstream job, so they are not retried. Mapped errors become a Chinese sentence for the creator; the raw body goes to SysLog.

## Where models come from

EasyTV does not ship vendor SDKs. Kling, Jimeng, Seedance, Hailuo, Sora, GPT, Qwen, MiniMax and the rest only need the gateway to map them onto those OpenAI-style routes. Changing models means changing gateway channels, not EasyTV code.

## Typical failures

- Gateway returns 200 but the studio queues forever: check API logs for upstream errors, and whether that model was imported into pricing.
- Only a chat model is configured: image / video nodes fail until the gateway exposes those routes.
- Base URL already includes `/v1`: do not stack another `/v1` on top of what the admin form expects.
