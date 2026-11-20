---
title: FAQ
description: Les pièges habituels autour du déploiement, de la passerelle, de la connexion et des licences.
---

## Le studio s'ouvre mais rien ne se génère

L'API est absente, ou la passerelle / les tarifs des modèles ne sont pas configurés. Faites pointer `NUXT_PUBLIC_API_BASE_URL` vers une API en service, puis [connectez une passerelle](/docs/gateway).

## Les front-ends dans Docker ne joignent pas l'API

Le navigateur s'adresse à votre machine, pas à `api:8383` sur le réseau compose. Donnez à `PUBLIC_API_URL` une URL que le navigateur peut ouvrir, par exemple `http://192.168.x.x:8383`.

## Le démarrage échoue faute d'administrateur

`ROOT_PASSWORD` est vide. Si la base de données ne contient aucun administrateur, l'API refuse de démarrer.

## Pas de code de vérification

En développement, définissez `EMAIL_VERIFICATION_ENABLED=false` ; le code est affiché dans le journal de l'API. En production, branchez SMTP ou les SMS.

## La découpe média échoue / CORS

Si le bucket n'a pas de CORS, laissez le studio utiliser le proxy média côté serveur et ajoutez l'hôte du bucket à `NUXT_PUBLIC_MEDIA_HOSTS`.

## Le port 3000 est occupé

Le site vitrine `easytv-website` utilise aussi le port 3000 par défaut. Arrêtez ce `nuxt dev`, ou donnez un autre port au site. Le studio utilise le port 3005 par défaut.

## Dois-je utiliser pnpm ?

Les trois dépôts front-end imposent pnpm. npm / yarn / cnpm entreront en conflit avec le lockfile et le champ `packageManager`, et l'installation ne correspondra pas à celle de la CI.

## L'enregistrement du canevas échoue / « plus de 2 Mo »

L'ensemble du `graph` est plafonné à 2 Mo. N'enregistrez pas les captures de caméra du plateau de réalisation (PNG en base64) ; le front-end les retire déjà à l'enregistrement.

## Les tâches restent en pending

Il faut qu'un processus traite les tâches. Sur plusieurs nœuds, vérifiez `WORKER_TAG`. Cherchez dans les journaux les erreurs 429 de la passerelle, les refus de modération ou `unsupported duration`.

## L'image-vers-vidéo échoue, le texte-vers-vidéo fonctionne

La passerelle ne parvient pas à récupérer l'URL source par GET. Le disque local a besoin d'un `UploadBaseUrl` public ; OSS / Qiniu ont besoin d'un hôte public. Voir [Stockage](/docs/storage).

## Les tarifs abonnés ne s'appliquent pas

L'espace personnel tient compte de *votre* abonnement actif. L'espace d'équipe tient compte de l'abonnement équipe du **owner**. Les viewers ne peuvent pas générer.

## Rappel de paiement en 404 / signature invalide

`ServerAddress` doit être la racine publique en https de l'API. Les URL de notification de WeChat et d'Alipay doivent pointer vers `/wechat/webhook` et `/alipay/webhook`.

## Puis-je l'utiliser commercialement en code fermé ?

Oui sous AGPL-3.0, à condition de publier le code source correspondant lorsque vous proposez une version modifiée sous forme de service en réseau. Vous n'avez pas besoin d'acheter de licence pour cela. Le code fermé ou la marque blanche sans ces obligations nécessitent la [licence commerciale](/docs/license). Les modules d'`easytv-api` dérivés de projets amont sous AGPL restent sous AGPL.
