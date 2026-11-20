---
title: Équipe
description: Espace d'équipe, invitations, sièges. La génération ne puise dans la réserve de l'équipe que si EasyTV-Team est défini.
---

Nécessite l'[authentification](/docs/api-auth).

- En-tête absent / `EasyTV-Team: 0` : espace personnel, portefeuille personnel.
- `EasyTV-Team: <team_id>` : espace d'équipe, pré-débit sur la réserve du owner.

Un utilisateur n'appartient qu'à une seule équipe. L'achat d'un abonnement équipe fait de vous le owner ; le nombre de sièges vient de la commande (2 à 10).
