---
title: Exécution depuis les sources
description: Démarrez séparément l'API, le studio, la console d'administration et la console partenaires pendant que vous modifiez le code.
---

## Backend

Nécessite Go 1.27+, MySQL 8.x, Redis en option, et `ffmpeg` / `ffprobe` dans le `PATH`.

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS easytv DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
go run . --port 8383
```

Renseignez `SQL_DSN`, `ROOT_PASSWORD` et `CRYPTO_SECRET` dans `.env`. Données de démonstration facultatives :

```bash
go run ./cmd/seed --env-file .env
```

## Studio

Nécessite Node.js 22.21+ (le minimum de Nuxt 4.6 ; le champ `engines` du dépôt indique encore 22.5+) et pnpm 10+.

```bash
git clone https://github.com/easytv-ai/easytv-web.git
cd easytv-web
pnpm install
cp .env.example .env.development
```

Faites pointer `NUXT_PUBLIC_API_BASE_URL` vers `http://127.0.0.1:8383`, puis :

```bash
pnpm dev          # http://localhost:3005
```

Sans backend, l'accueil, l'exploration et la place des skills s'affichent tout de même ; la création ouvre une fenêtre de connexion. Utilisez **pnpm**, pas npm ni cnpm.

## Console d'administration

```bash
git clone https://github.com/easytv-ai/easytv-manage.git
cd easytv-manage
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3006
```

Connectez-vous avec le compte `admin` créé au premier démarrage de l'API.

## Console partenaires

```bash
git clone https://github.com/easytv-ai/easytv-partner.git
cd easytv-partner
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3010
```

N'importe quel compte EasyTV peut se connecter. Les comptes qui ne sont pas encore partenaires arrivent sur la page de candidature.

## Binaire + systemd

Sans Docker, récupérez un build Linux dans les [Releases](https://github.com/easytv-ai/easytv-api/releases), ou compilez :

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o easytv-api .
```

```ini
# /etc/systemd/system/easytv-api.service
[Unit]
Description=EasyTV API
After=network.target mysql.service

[Service]
User=easytv
WorkingDirectory=/opt/easytv-api
ExecStart=/opt/easytv-api/easytv-api --port 8383 --env-file /opt/easytv-api/.env
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Les hôtes sans systemd peuvent utiliser le script `deploy.sh start|stop|restart|status` du dépôt. Exemple de proxy inverse : [vue d'ensemble de l'API](/docs/api).
