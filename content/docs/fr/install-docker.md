---
title: Docker Compose
description: Démarrez l'API avec le fichier compose d'easytv-api et, si vous le souhaitez, toute la pile front-end.
---

Nécessite Docker 24+ et Compose v2.

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

Modifiez `.env` et renseignez au minimum :

- `ROOT_PASSWORD` — mot de passe du premier administrateur (le nom d'utilisateur par défaut est `admin`)
- `CRYPTO_SECRET` — secret HMAC ; en production, utilisez `openssl rand -hex 32`

Puis :

```bash
docker compose up -d
curl http://localhost:8383/healthz
```

Compose télécharge `ghcr.io/easytv-ai/easytv-api:latest`, puis démarre MySQL 8.4, Redis 7 et l'API sur le port 8383. Les fichiers envoyés et les journaux sont conservés dans des volumes nommés. Le premier démarrage migre le schéma et crée l'administrateur.

## Avec le studio et la console d'administration

```bash
docker compose --profile full up -d
```

- Studio http://localhost:3005
- Console d'administration http://localhost:3006

Les images viennent de GHCR (`easytv-web`, `easytv-manage`). La console partenaires se déploie séparément ; voir [Console partenaires](/docs/partner).

Si d'autres machines du réseau local doivent y accéder, renseignez les URL que le navigateur ouvrira réellement :

```bash
PUBLIC_API_URL=http://192.168.1.10:8383
PUBLIC_STUDIO_URL=http://192.168.1.10:3005
```

`NUXT_PUBLIC_API_BASE_URL` est intégrée au bundle front-end. Un nom d'hôte compose tel que `http://api:8383` est inaccessible depuis le navigateur.

En production, changez les valeurs par défaut de `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD`.

## Construire l'image de l'API en local

Par défaut, l'image est téléchargée. Pour la construire en local, décommentez `build: .` dans le service API de `docker-compose.yml`.

Les images sont publiées pour `linux/amd64` et `linux/arm64`, étiquetées par version, ainsi qu'avec `latest` et `main`.
