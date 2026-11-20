---
title: Communauté et skills
description: Fil public, abonnements et classements, modération des commentaires, et la façon dont les modèles de skills sont publiés et rémunérés.
---

Le studio est aussi une communauté publique de films. Les exploitants modèrent les œuvres, les commentaires et les skills dans la console d'administration.

![Fil Explorer](/images/docs/explore.png)

## Œuvres

Les créateurs publient à partir d'un asset : `POST /user/work`. Fil public `GET /work`, lecteur `/watch/:id` (nombre de vues +1). Les auteurs peuvent rendre public le processus de création sur `/process/:id`.

Routes du studio :

| Chemin | Signification |
| --- | --- |
| `/explore` | Fil d'actualité, œuvres à la une en premier |
| `/studio` | Recommandations |
| `/following` | Abonnements |
| `/rank` | Classements |
| `/author/:id` | Auteur |
| `/watch/:id` | Lecteur |

Les mentions « J'aime », les commentaires et les signalements nécessitent une connexion. Dans la console d'administration, **Œuvres / Modération de la communauté / Signalements** permettent de retirer des contenus. Les films à la une et les bannières d'accueil se programment séparément.

## Skills

Un skill est un workflow réutilisable (prompt + graph de canevas facultatif).

- Place des skills `/skills` : skills officiels et skills d'utilisateurs approuvés
- Les créateurs soumettent avec `POST /user/skill/:id/submit` ; la page **Skills** de la console d'administration les valide
- Lorsque d'autres personnes exécutent votre skill, vous accumulez une part des revenus ; versement en crédits ou en CNY (taux `GrowthPointsPerYuan`, 20 crédits/yuan par défaut)

La console d'administration gère aussi la bibliothèque de prompts, la bibliothèque de styles et la bibliothèque de personnages (planches trois vues), utilisées comme références dans le canevas.

## Croissance

Invitation `/invite/:code`, partenaire `/partner/:code` ou `/p/:code`, codes bonus : l'attribution est enregistrée à l'inscription. Les règles se trouvent sous **Réglages système → Croissance** : crédits offerts à l'inscription, pointage quotidien, récompense de parrainage, fenêtre d'attribution. Voir [Console partenaires](/docs/partner).

Campagnes : `/campaign`, configurées sous **Campagnes** dans la console d'administration.
