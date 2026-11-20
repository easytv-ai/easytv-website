---
title: Introduction
description: Ce qu'est EasyTV, comment les quatre dépôts se répartissent le travail, et à qui s'adresse son déploiement.
---

EasyTV est un studio open source et auto-hébergé de séries courtes par IA. Dans le navigateur, vous transformez une idée d'une ligne en film terminé : un canevas de nœuds pour les scénarios, les storyboards, les images, la vidéo et l'audio ; un plateau de réalisation 3D pour le placement des personnages et les caméras ; un pipeline « film en une phrase » qui planifie, génère et monte. Les crédits, la tarification des modèles, les paiements et une console d'administration sont intégrés.

Les modèles passent toujours par votre propre passerelle compatible OpenAI. EasyTV prend en charge le workflow de création et l'exploitation.

## Quatre dépôts

| Dépôt | Rôle | Port par défaut |
| --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Backend Go : authentification, canevas, agent, montage, facturation, stockage | 8383 |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | Studio : canevas, film en une phrase, plateau de réalisation, communauté | 3005 |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | Console d'administration : utilisateurs, modération, tarification, passerelle, croissance | 3006 |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | Console partenaires : commissions, retraits, supports promotionnels | 3010 |

Le site vitrine est [easytv-website](https://github.com/easytv-ai/easytv-website) ; il ne fait pas partie du parcours de création. Les captures d'écran se trouvent sur la page [Premiers pas](/docs).

## À qui s'adresse EasyTV

- Vous voulez un studio auto-hébergé de séries courtes / vidéos courtes par IA, et vous gardez la main sur les modèles et les données
- Vous exploitez déjà (ou allez exploiter) une passerelle de modèles compatible OpenAI
- Vous avez besoin de crédits, d'abonnements, de paiements et de modération, pas seulement de quelques appels de génération

## Côté créateurs

- [Canevas libre](/docs/canvas) : nœuds texte / image / vidéo / audio / storyboard / réalisation
- [Film en une phrase](/docs/create) : note d'intention → génération par couches → montage
- [Plateau de réalisation 3D](/docs/director) : placement des personnages et caméras réinjectés dans le canevas
- [Outils média](/docs/media) : rognage et pellicule d'images avec ffmpeg, plus upscale / suppression des sous-titres conditionnés aux capacités
- [Communauté et skills](/docs/community) : films publics, rémunération des skills
- [Connexion et équipes](/docs/team) : e-mail / SMS / WeChat, espace personnel ou espace d'équipe

## Côté exploitants

- [Console d'administration](/docs/admin) : utilisateurs, modération, tarification, paiements, croissance
- [Passerelle](/docs/gateway) et [facturation](/docs/billing)
- [Console partenaires](/docs/partner) : commissions, retraits, supports promotionnels
- [Stockage](/docs/storage) et [mise en production](/docs/deploy)

## Ce qu'EasyTV n'est pas

EasyTV n'est **pas** une passerelle de modèles. Les appels texte, image, vidéo et audio sont transmis à la passerelle compatible OpenAI que vous configurez. Sans passerelle, le studio s'ouvre tout de même, mais la génération ne fonctionne pas.

## Et ensuite

Suivez le [démarrage rapide](/docs/quickstart), de Docker au premier film. Pour modifier le code : [Exécution depuis les sources](/docs/install-source).
