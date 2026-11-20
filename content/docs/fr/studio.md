---
title: Studio
description: Ce que fait easytv-web, ses routes principales, et comment le raccorder à votre API.
---

Le studio est le front-end des créateurs ; son dépôt est [easytv-web](https://github.com/easytv-ai/easytv-web). Guides par fonctionnalité : [canevas](/docs/canvas), [film en une phrase](/docs/create), [plateau de réalisation](/docs/director), [communauté](/docs/community), [connexion et équipes](/docs/team).

![Accueil du studio et films à la une](/images/docs/studio.png)

## Ce qu'il fait

- **Canevas libre** : nœuds texte, image, vidéo, audio et groupe de storyboard, avec historique des versions et partage en lecture seule
- **Film en une phrase** : note d'intention, personnages, décors, plans et voix off, puis retouche plan par plan
- **Plateau de réalisation 3D** : placez les personnages et réglez les caméras dans le navigateur ; la description des plans est réinjectée dans le canevas
- **Montage dans le navigateur** : découpe, scission et concaténation avec FFmpeg.wasm
- **Communauté** : explorer, abonnements, classements, commentaires, lecteur public
- **Skills et prompts** : modèles de workflow réutilisables
- **Sept langues** : chinois simplifié et traditionnel, anglais, français, japonais, russe, vietnamien

## Routes

| Chemin | Signification |
| --- | --- |
| `/agent` | Accueil (`/` y redirige en 301) |
| `/explore` `/studio` `/following` `/rank` | Fil d'actualité, à la une, abonnements, classements |
| `/create` | Film en une phrase : prompt → note d'intention → génération par couches → montage |
| `/canvas` | Canevas libre. `?id=` en ouvre un, `?project_id=` en crée un à partir d'un projet |
| `/canvas/director` | Plateau de réalisation 3D ; la scène est réinjectée dans le même canevas |
| `/share/:token` | Partage de canevas en lecture seule |
| `/projects` `/assets` `/subjects` `/prompts` | Projets et bibliothèques |
| `/skills` | Place des skills |
| `/watch/:id` | Lecteur public |
| `/pricing` | Tarifs |
| `/settings` | Compte, équipe, commandes, factures, invitations |
| `/legal/*` | Conditions, confidentialité, règles d'usage de l'IA (textes d'exemple, à relire avant la mise en ligne) |

## Déploiement

Preset Cloudflare Workers :

```bash
cp .env.example .env.production
pnpm deploy
```

Hôte Node : `NITRO_PRESET=node-server pnpm build`, puis `node .output/server/index.mjs`.

Docker :

```bash
docker run -d -p 3005:3005 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_SITE_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-web:latest
```
