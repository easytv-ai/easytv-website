---
title: Object storage
description: Local upload, Aliyun OSS or Qiniu, and why image-to-video needs a public URL.
---

Uploads, generation outputs and composed films all have to land somewhere. Pick one; you can switch at runtime.

## Local disk

Default. Directory `UPLOAD_DIR` (default `./upload`), served at `GET /upload/*`.

Compose keeps it on the `upload` volume. Image-to-video needs the gateway to **HTTP GET** the source:

- Local: set `UploadBaseUrl` to something the gateway can reach, e.g. `http://YOUR_PUBLIC_IP:8383/upload` or a tunnel
- Everything on one machine: `http://host.docker.internal:8383/upload` sometimes works

Without a public URL, I2V / reference-image jobs fail; T2V usually does not care.

## Aliyun OSS

Env vars (read once at boot):

| Variable | Meaning |
| --- | --- |
| `OSS_BUCKET` | Setting this turns OSS on and stops local writes |
| `OSS_ENDPOINT` | e.g. `oss-cn-hangzhou.aliyuncs.com` |
| `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | Use a least-privilege RAM user in production |
| `OSS_BASE_URL` | CDN or public bucket host |
| `OSS_PREFIX` | Object prefix, default `easytv` |
| `OSS_PUBLIC_READ` | Public-read or not |

`/upload/*` is no longer the main path. If the bucket has no CORS, studio crop / filmstrip cannot read pixels — add the host to `NUXT_PUBLIC_MEDIA_HOSTS` and use the server proxy.

## Qiniu

Settings (admin **System → Gateway & storage**), hot-reloaded:

`QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`

Uploads and outputs then use public CDN URLs, so I2V usually does not need `UploadBaseUrl`. Client direct-upload: `GET /user/qiniu/upload-token`, `GET /user/qiniu/key`.

## Which one

| Situation | Pick |
| --- | --- |
| Laptop dev | Local; add `UploadBaseUrl` when you need I2V |
| Single-box self-host | Local disk, Nginx serves `/upload/` |
| Production + CDN | OSS or Qiniu, public-read or signed URLs |
