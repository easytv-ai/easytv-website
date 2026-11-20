---
title: Configuration
description: Variables d'environnement obligatoires de l'API, valeurs NUXT_PUBLIC_* des front-ends, et contenu de la table setting.
---

La configuration comporte deux niveaux : les variables d'environnement lues au démarrage du processus, et la table `setting` que la console d'administration recharge à chaud. Les listes commentées se trouvent dans le fichier `.env.example` de chaque dépôt.

## API : variables obligatoires

| Variable | Signification |
| --- | --- |
| `SQL_DSN` | DSN MySQL, par exemple `user:pass@tcp(127.0.0.1:3306)/easytv?charset=utf8mb4&parseTime=true&loc=Local` |
| `ROOT_PASSWORD` | Mot de passe du premier administrateur. Le processus refuse de démarrer s'il n'existe aucun administrateur et que cette variable est vide |
| `CRYPTO_SECRET` | Secret HMAC pour les codes à usage unique et les jetons ; ≥ 32 caractères aléatoires en production |

## API : variables courantes

| Variable | Valeur par défaut | Signification |
| --- | --- | --- |
| `PORT` | `8383` | Port HTTP (`--port` est prioritaire) |
| `DEBUG` | `false` | Journaux détaillés et affichage des requêtes SQL |
| `REDIS_CONN_STRING` | — | Sans elle, les limites de débit et les codes à usage unique utilisent la mémoire |
| `UPLOAD_DIR` | `./upload` | Dossier de stockage local |
| `FFMPEG_PATH` / `FFPROBE_PATH` | depuis le `PATH` | Peuvent aussi être redéfinis dans les réglages |
| `WORKER_TAG` | — | Multi-nœuds : uniquement les tâches portant ce tag |

La passerelle, les paiements, OSS / Qiniu, SMTP et les SMS peuvent aussi être des variables d'environnement ; en production, ils se règlent généralement sous **Réglages système**, pour ne pas redémarrer l'API.

## Intégrations facultatives

| Domaine | Variables / réglages |
| --- | --- |
| Code à usage unique par e-mail | `EMAIL_VERIFICATION_ENABLED`, `SMTP_*`, `VERIFICATION_VALID_MINUTES`. En développement, vous pouvez désactiver l'e-mail ; le code est affiché dans le journal de l'API |
| SMS (SubMail) | `SMS_ENABLED`, `SUBMAIL_*`, `SMS_SIGNATURE` |
| Passerelle de modèles | réglages `EasyAPIGatewayBaseUrl` / `EasyAPIGatewayKey` / `EasyAPIGatewayEnabled`. Les tarifs se trouvent dans `model_price` |
| Aliyun OSS | `OSS_BUCKET`, `OSS_ENDPOINT`, `OSS_ACCESS_KEY_ID`, `OSS_ACCESS_KEY_SECRET`, `OSS_BASE_URL`, `OSS_PREFIX`. Définir `OSS_BUCKET` arrête l'écriture dans le dossier local `upload/` |
| Qiniu | réglages `QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`. Grâce aux URL publiques, l'image-vers-vidéo n'a pas besoin de `UPLOAD_BASE_URL` |
| Paiements | `WECHATPAY_*`, `ALIPAY_APPID` ou les réglages correspondants ; l'hôte de rappel est le réglage `ServerAddress` |
| Quota gratuit | `FREE_CONCURRENT`, `FREE_STORAGE_GB` |

## Variables supplémentaires pour Docker Compose

Elles se trouvent dans le `.env` d'`easytv-api` et ne servent qu'à compose :

| Variable | Valeur par défaut | Signification |
| --- | --- | --- |
| `MYSQL_PASSWORD` | `change-me-easytv` | Mot de passe de l'utilisateur applicatif du MySQL fourni |
| `MYSQL_ROOT_PASSWORD` | `change-me-root` | Mot de passe root du MySQL fourni |
| `PUBLIC_API_URL` | `http://localhost:8383` | URL que le **navigateur** utilise pour l'API, pas le nom d'hôte compose |
| `PUBLIC_STUDIO_URL` | `http://localhost:3005` | URL publique du studio |
| `API_PORT` / `WEB_PORT` / `MANAGE_PORT` | 8383 / 3005 / 3006 | Ports exposés sur l'hôte |

## Studio `easytv-web`

Toutes ces valeurs relèvent de la configuration d'exécution publique (intégrée au client : **aucun secret**).

| Variable | Requis | Signification |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | oui | URL de l'API |
| `NUXT_PUBLIC_SITE_URL` | oui en production | canonical, sitemap, OG |
| `NUXT_PUBLIC_SITE_NAME` | non | `EasyTV` par défaut |
| `NUXT_PUBLIC_MEDIA_HOSTS` | non | hôtes OSS / CDN supplémentaires que le proxy média peut interroger |
| `NUXT_PUBLIC_CONTACT_EMAIL` | non | contact affiché sur les pages légales |

Le développement lit `.env.development` ; les builds de production lisent `.env.production`.

## Console d'administration `easytv-manage`

| Variable | Signification |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | URL de l'API |
| `NUXT_PUBLIC_STUDIO_URL` | URL du studio : lien « site » de l'en-tête, modération → lecteur, ressources statiques |
| `NUXT_PUBLIC_PARTNER_URL` | URL de la console partenaires : « ouvrir la console partenaires » sur la page Partenaires |
| `NUXT_PUBLIC_SITE_NAME` | Nom affiché dans la barre de titre |

## Console partenaires `easytv-partner`

| Variable | Signification |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | URL de l'API |
| `NUXT_PUBLIC_STUDIO_URL` | URL du studio : lien « site » de l'en-tête et solution de repli pour les liens promotionnels |
| `NUXT_PUBLIC_SITE_NAME` | Nom affiché dans la barre de titre |
