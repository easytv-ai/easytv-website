---
title: Vue d'ensemble du projet
description: Le rôle des quatre dépôts du produit, les ports par défaut, et pourquoi le site vitrine reste en dehors du parcours de création.
---

EasyTV se compose de quatre dépôts déployables qui partagent un même [contrat d'API](/docs/api). Modifiez `easytv-api/API.md` avant de modifier un client.

![Studio](/images/docs/studio.png)

## Dépôts

| Dépôt | Rôle | Port | Docs |
| --- | --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | API Go : authentification, canevas, tâches, facturation, stockage, passerelle | 8383 | [Référence API](/docs/api) |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | Studio : canevas, film en une phrase, plateau de réalisation, communauté | 3005 | [Studio](/docs/studio) |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | Console d'administration : utilisateurs, modération, tarifs, passerelle, croissance | 3006 | [Console d'administration](/docs/admin) |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | Console partenaires : commissions, retraits, supports promotionnels | 3010 | [Console partenaires](/docs/partner) |

Le site vitrine [easytv-website](https://github.com/easytv-ai/easytv-website) ne contient que la documentation et la page d'accueil.

## Qui appelle qui

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api  ── MySQL / Redis / object storage
easytv-partner  ──┘         │
                            ▼
                    OpenAI-compatible gateway
```

Les trois clients envoient `Authorization: Bearer` + `EasyTV-User`. La console d'administration exige en plus `role ≥ 10`. Les appels aux modèles ne vont jamais directement chez les fournisseurs.

## Exécution en local

Avec les quatre dépôts sur cette machine, ouvrez les ports ci-dessus. Docker Compose avec `--profile full` démarre l'API, le studio et la console d'administration ; la console partenaires se lance à part avec `pnpm dev`. Voir le [démarrage rapide](/docs/quickstart) et l'[exécution depuis les sources](/docs/install-source).
