---
title: Docker Compose
description: 用 easytv-api 仓库里的 compose 文件一键拉起 API，可选整套前端。
---

需要 Docker 24+ 与 Compose v2。

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

编辑 `.env`，至少改这两项：

- `ROOT_PASSWORD`：第一个管理员密码（用户名默认 `admin`）
- `CRYPTO_SECRET`：HMAC 密钥，生产环境用 `openssl rand -hex 32` 生成

然后：

```bash
docker compose up -d
curl http://localhost:8383/healthz
```

Compose 会拉取 `ghcr.io/easytv-ai/easytv-api:latest`，启动 MySQL 8.4、Redis 7 和监听 8383 的 API。上传文件与日志放在命名卷里。首次启动自动建表并创建管理员。

## 连创作台和运营后台

```bash
docker compose --profile full up -d
```

- 创作台 http://localhost:3005
- 运营后台 http://localhost:3006

镜像来自 GHCR（`easytv-web`、`easytv-manage`）。渠道后台 `easytv-partner` 目前需要单独部署，见 [渠道后台](/docs/partner)。

局域网或其它机器访问时，在 `.env` 里改浏览器真实能打开的地址：

```bash
PUBLIC_API_URL=http://192.168.1.10:8383
PUBLIC_STUDIO_URL=http://192.168.1.10:3005
```

`NUXT_PUBLIC_API_BASE_URL` 会打进前端包，填容器内部主机名 `http://api:8383` 浏览器打不开。

生产请改掉默认的 `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD`。

## 本机构建 API 镜像

默认拉预构建镜像。要在本地 build，打开 `docker-compose.yml` 里 API 服务的 `build: .` 注释即可。

镜像提供 `linux/amd64` 与 `linux/arm64`，标签跟随版本，另有 `latest` 与 `main`。
