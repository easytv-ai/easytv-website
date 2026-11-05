---
title: 对象存储
description: 本地 upload、阿里云 OSS、七牛怎么选，以及图生视频为什么要公网 URL。
---

生成产物、用户上传、合成成片都要落盘。三选一，运行期可切，不必改代码。

## 本地磁盘

默认。目录 `UPLOAD_DIR`（缺省 `./upload`），对外走 `GET /upload/*`。

Docker Compose 把该目录放在命名卷 `upload` 里。图生视频时网关要能 **HTTP GET** 到素材：

- 本机联调：把 setting `UploadBaseUrl` 设成网关能访问的地址，例如 `http://你的公网IP:8383/upload` 或一条内网穿透
- 只在同一台机器上玩、网关也在本机：有时 `http://host.docker.internal:8383/upload` 就够

没有公网 URL 时，图生视频 / 参考图会失败，文生视频一般不受影响。

## 阿里云 OSS

环境变量（启动时读一次）：

| 变量 | 说明 |
| --- | --- |
| `OSS_BUCKET` | 配了就启用 OSS，不再写本地 |
| `OSS_ENDPOINT` | 如 `oss-cn-hangzhou.aliyuncs.com` |
| `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | 生产用最小权限子账号（PutObject / GetObject） |
| `OSS_BASE_URL` | CDN 或 Bucket 公网域名 |
| `OSS_PREFIX` | 对象前缀，默认 `easytv` |
| `OSS_PUBLIC_READ` | 是否公共读 |

启用后 `/upload/*` 不再作为主路径。桶如果没配 CORS，创作台裁切 / 抽帧读不到像素，要把该域名加进 `NUXT_PUBLIC_MEDIA_HOSTS`，走服务端代理。

## 七牛

写在 setting 里（后台 **系统 → 网关与存储**），热更新：

`QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`

启用后上传和产物走七牛 CDN 公网 URL，图生视频一般不必再配 `UploadBaseUrl`。前端直传凭证：`GET /user/qiniu/upload-token`、`GET /user/qiniu/key`。

## 怎么选

| 场景 | 建议 |
| --- | --- |
| 本机开发 | 本地 + 需要图生视频时再配 `UploadBaseUrl` |
| 单机自托管 | 本地磁盘，Nginx 把 `/upload/` 直接出去 |
| 生产、要 CDN | OSS 或七牛，Bucket 公共读或签 URL |
