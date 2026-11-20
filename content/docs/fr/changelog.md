---
title: Journal des modifications
description: Les nouveautés récentes du site de documentation et des quatre dépôts du produit. Les notes complètes figurent dans chaque CHANGELOG.md.
---

Cette page ne présente que la partie visible depuis la documentation. Chaque dépôt du produit tient son propre `CHANGELOG.md`.

## Site de documentation easytv-website

- Documentation bilingue sur `/docs` et `/en/docs` : Démarrer, Installation, Guides, Référence API, Aide
- Le thème suit celui de la page d'accueil ; la documentation n'impose plus le mode sombre
- Les libellés du schéma d'architecture ne chevauchent plus les blocs API / passerelle
- pnpm, AGPL-3.0, guide de contribution et notes de sécurité

## Studio easytv-web

- Image Docker et variables `NUXT_PUBLIC_*` lues à l'exécution
- Double licence : AGPL-3.0 et un modèle de licence commerciale
- La liste d'hôtes autorisés du proxy média vient désormais de la configuration d'exécution

## API easytv-api

- Le contrat reste le fichier `API.md` de ce dépôt (jusqu'au chapitre 38)
- La génération ne dialogue qu'avec une passerelle compatible OpenAI
- Les crédits sont pré-débités d'après `model_price` et remboursés en cas d'échec ou d'annulation

Le travail non publié figure dans la section `[Unreleased]` du changelog de chaque dépôt.
