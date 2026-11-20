---
title: Connexion, rôles et équipes
description: E-mail / SMS / WeChat, rôles d'administration, et qui paie dans l'espace personnel ou l'espace d'équipe.
---

## Connexion

Le studio et la console partenaires partagent un même système de comptes.

| Méthode | API | Remarques |
| --- | --- | --- |
| E-mail + mot de passe | `POST /user/login` | |
| Code SMS | `GET /sms/verification` + `POST /user/sms_login` | Inscription automatique si le numéro est inconnu |
| WeChat Open Platform | OAuth | Définissez l'hôte de rappel dans la console d'administration ; en développement, vous pouvez afficher les codes à usage unique dans le journal de l'API |

La réponse inclut `access_token`. Chaque appel authentifié envoie ensuite :

```
Authorization: Bearer <access_token>
EasyTV-User: <user_id>
```

La console d'administration utilise `/admin/*` et exige `role ≥ 10`. Les réglages système, les remboursements et les ajustements de crédits exigent le super-administrateur `role ≥ 100` (le compte `admin` créé au premier démarrage).

Les administrateurs peuvent émettre un ticket à usage unique pour entrer dans le studio ou dans la console partenaires (connexion déléguée pour le support).

## Espace d'équipe

En-tête du studio : **personnel** / **équipe**. Un utilisateur appartient à une seule équipe au plus. En-tête `EasyTV-Team: <team_id>` (absent ou 0 = espace personnel).

Règles :

1. L'espace personnel débite toujours votre propre portefeuille, même si vous faites partie d'une équipe
2. L'espace d'équipe puise dans la **réserve de crédits du owner** ; un abonnement équipe expiré est refusé (`team_expired`)
3. Les projets existants restent personnels ; leur auteur peut les faire entrer dans l'équipe ou les en sortir
4. Rôles `admin` / `editor` / `viewer`. Les viewers ne peuvent pas générer avec les crédits de l'équipe
5. Si vous êtes retiré de l'équipe, l'API renvoie `team_forbidden` ; le client doit supprimer l'en-tête et revenir à l'espace personnel

L'abonnement existe en édition créateur à un seul siège et en édition équipe (2 à 10 sièges, remise définie dans `BillingPromo`). La simultanéité et le stockage dépendent de l'abonnement.
