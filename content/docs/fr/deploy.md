---
title: Mise en production
description: Répartition des noms d'hôte, proxy inverse Nginx, Cloudflare, workers multi-nœuds et liste de contrôle avant la mise en ligne.
---

[Docker Compose](/docs/install-docker) suffit sur un portable. En production, placez les quatre processus sur des hôtes (ou des sous-domaines) différents qui partagent une même API.

## Noms d'hôte

| Service | Exemple | Utilisé comme |
| --- | --- | --- |
| easytv-api | `https://api.example.com` | `NUXT_PUBLIC_API_BASE_URL` de chaque front-end |
| easytv-web | `https://studio.example.com` | `NUXT_PUBLIC_SITE_URL` / « URL du studio » dans la console d'administration |
| easytv-manage | `https://admin.example.com` | ne la laissez pas exposée sur Internet |
| easytv-partner | `https://partner.example.com` | `NUXT_PUBLIC_PARTNER_URL` de la console d'administration |

CORS renvoie n'importe quelle `Origin` et autorise les identifiants ; les trois front-ends peuvent donc avoir des hôtes différents. L'authentification passe par des en-têtes, pas par des cookies.

## Nginx

La génération et les envois de fichiers sont lents et volumineux :

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    client_max_body_size 512m;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://127.0.0.1:8383;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Les trois applications Nuxt :

- **Cloudflare Workers** (option par défaut des dépôts) : `cp .env.example .env.production && pnpm deploy`
- **Hôte Node** : `NITRO_PRESET=node-server pnpm build`, puis `node .output/server/index.mjs`
- **Docker** : images GHCR, en redéfinissant chaque `NUXT_PUBLIC_*` à l'exécution

## API multi-nœuds

Chaque processus de l'API ne traite que les tâches marquées de son tag : variable d'environnement `WORKER_TAG`. Les tâches de génération, de montage et de traitement média peuvent être réparties de cette façon. Les processus sans tag prennent les tâches sans tag.

MySQL doit être partagé. Redis est vivement recommandé (limites de débit et codes à usage unique ; sans lui, chaque processus utilise des tables en mémoire). Utilisez OSS / Qiniu, pas les disques de chaque nœud.

## Liste de contrôle avant la mise en ligne

1. Changez `ROOT_PASSWORD`, `CRYPTO_SECRET` (≥ 32 caractères) et les mots de passe MySQL
2. `DEBUG=false`
3. [Connectez une passerelle](/docs/gateway) et importez les tarifs
4. Basculez le [stockage](/docs/storage) vers OSS / Qiniu, ou donnez au disque local un `UploadBaseUrl` public
5. [Paiements](/docs/billing) : `ServerAddress` = `https://api.example.com`
6. SMTP ou SMS ; cessez d'afficher les codes à usage unique dans le journal
7. Studio : `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_MEDIA_HOSTS`
8. Relisez les textes de `/legal/*` en fonction de votre entité et de votre juridiction
9. N'exposez pas la console d'administration au monde entier
