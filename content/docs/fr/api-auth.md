---
title: Authentification et connexion
description: Bearer + EasyTV-User, l'en-tête d'équipe, la connexion par e-mail / SMS et l'enveloppe d'erreur commune.
---

Le studio, la console d'administration et la console partenaires partagent une même connexion. **N'authentifiez pas avec des cookies.** `$API` vaut par défaut `http://127.0.0.1:8383`.

Les en-têtes, le corps et la réponse 200 de chaque route figurent dans le sous-menu de gauche.

## En-têtes

| En-tête | Quand | Remarques |
| --- | --- | --- |
| `Authorization` | `/user/*`, `/admin/*` | `Bearer <access_token>` |
| `EasyTV-User` | idem | Identifiant de l'utilisateur courant ; doit correspondre au jeton |
| `EasyTV-Team` | facultatif | Identifiant de l'espace d'équipe. Absent / `0` : espace personnel |
| `Content-Type` | corps JSON | `application/json` |
| `Accept-Language` | détail d'un modèle | Transmis à la passerelle |

`/admin/*` exige en plus `role ≥ 10`. Les réglages, les remboursements et les ajustements de crédits exigent `role ≥ 100` (RootAuth). Ajoutez `EasyTV-Team` pour l'espace d'équipe. Dans l'espace d'équipe, la génération puise dans la réserve du owner ; dans l'espace personnel, elle débite toujours le portefeuille de l'appelant.

## Enveloppe

Le statut HTTP est **toujours 200**. Lisez `success` dans le JSON. L'absence d'accès et l'absence de ressource renvoient toutes deux `资源不存在` : il est donc impossible de sonder l'existence d'une ressource. Certaines routes ajoutent `code` (`not_applied` / `not_approved` pour la console partenaires).

## Erreurs courantes

| message | Signification |
| --- | --- |
| `无效的参数` | JSON invalide ou champ obligatoire vide |
| `用户名或密码错误` | Échec de la connexion |
| `资源不存在` | Ressource inexistante ou sans accès |
| `权限不足` | Un administrateur a appelé une route RootAuth |
| `积分不足，还需 N 积分` | Crédits insuffisants pour créer une tâche |
| `模型未定价` / `模型暂未接入` | `model` ne figure pas dans la liste `model_price` active |
