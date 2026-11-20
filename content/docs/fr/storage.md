---
title: Stockage objet
description: Envoi local, Aliyun OSS ou Qiniu, et pourquoi l'image-vers-vidéo a besoin d'une URL publique.
---

Les fichiers envoyés, les résultats de génération et les films montés doivent tous être stockés quelque part. Choisissez une option ; vous pouvez en changer à l'exécution.

## Disque local

Option par défaut. Dossier `UPLOAD_DIR` (par défaut `./upload`), servi sur `GET /upload/*`.

Compose le conserve dans le volume `upload`. L'image-vers-vidéo exige que la passerelle puisse récupérer la source par **HTTP GET** :

- En local : donnez à `UploadBaseUrl` une valeur que la passerelle peut atteindre, par exemple `http://YOUR_PUBLIC_IP:8383/upload` ou un tunnel
- Tout sur une seule machine : `http://host.docker.internal:8383/upload` fonctionne parfois

Sans URL publique, les tâches I2V / avec image de référence échouent ; le T2V n'est généralement pas concerné.

## Aliyun OSS

Variables d'environnement (lues une seule fois au démarrage) :

| Variable | Signification |
| --- | --- |
| `OSS_BUCKET` | La définir active OSS et arrête les écritures locales |
| `OSS_ENDPOINT` | par exemple `oss-cn-hangzhou.aliyuncs.com` |
| `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | En production, utilisez un utilisateur RAM au moindre privilège |
| `OSS_BASE_URL` | CDN ou hôte public du bucket |
| `OSS_PREFIX` | Préfixe des objets, `easytv` par défaut |
| `OSS_PUBLIC_READ` | Lecture publique ou non |

`/upload/*` n'est alors plus le chemin principal. Si le bucket n'a pas de CORS, le rognage et la pellicule d'images du studio ne peuvent pas lire les pixels : ajoutez l'hôte à `NUXT_PUBLIC_MEDIA_HOSTS` et utilisez le proxy côté serveur.

## Qiniu

Réglages (console d'administration, **Réglages système → Passerelle et stockage**), rechargés à chaud :

`QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`

Les fichiers envoyés et les résultats utilisent alors des URL publiques de CDN ; l'I2V n'a donc généralement pas besoin de `UploadBaseUrl`. Envoi direct depuis le client : `GET /user/qiniu/upload-token`, `GET /user/qiniu/key`.

## Lequel choisir

| Situation | Choix |
| --- | --- |
| Développement sur un portable | Local ; ajoutez `UploadBaseUrl` lorsque vous avez besoin de l'I2V |
| Auto-hébergement sur une seule machine | Disque local, Nginx sert `/upload/` |
| Production + CDN | OSS ou Qiniu, en lecture publique ou avec des URL signées |
