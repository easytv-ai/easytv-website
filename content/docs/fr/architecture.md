---
title: Architecture
description: Comment le studio, la console d'administration et la console partenaires dialoguent avec easytv-api, avec la passerelle et le stockage.
---

Le schéma interactif de la page [Premiers pas](/docs) suit le thème du site. Les trois clients s'adressent à une même API ; les modèles sont appelés à travers la passerelle.

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api (Gin)  ── MySQL / Redis
easytv-partner  ──┘           │            ── object storage (local / OSS / Qiniu)
                              │            ── ffmpeg
                              ▼
                    OpenAI-compatible gateway
                              ▼
                    Kling · Jimeng · Seedance · Sora · GPT · …
```

## Authentification

- Studio et console partenaires : `Authorization: Bearer <token>` et `EasyTV-User: <user id>`
- La console d'administration appelle `/admin/*` et exige `role ≥ 10`
- L'espace d'équipe utilise `EasyTV-Team: <team_id>` ; par défaut, c'est l'espace personnel
- CORS renvoie l'origine de la requête ; les trois front-ends peuvent donc résider sur des hôtes différents

## Configuration d'exécution

Les variables d'environnement sont lues une seule fois au démarrage du processus. Le nom du site, les paiements, l'URL de la passerelle, les règles d'invitation et les réglages similaires se trouvent dans la table `setting` du backend. Les modifications faites dans la console d'administration s'appliquent immédiatement ; vous ne redémarrez pas l'API.

Le stockage est, au choix, le dossier local `upload/`, Aliyun OSS ou Qiniu. L'image-vers-vidéo exige que la passerelle puisse récupérer l'image source : OSS / Qiniu exposent déjà des URL publiques ; le stockage local nécessite `UPLOAD_BASE_URL` (ou le réglage `UploadBaseUrl`) pour que la passerelle puisse atteindre le fichier.

Les API multi-nœuds utilisent `WORKER_TAG` : chaque processus ne traite que les tâches marquées du même tag.

## Contrat

Modifiez [`API.md` dans easytv-api](https://github.com/easytv-ai/easytv-api/blob/main/API.md) avant de modifier le code. Voir la [vue d'ensemble de l'API](/docs/api) pour la version courte.
