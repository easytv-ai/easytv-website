---
title: Modèles
description: Catalogue actif et détail. La liste correspond à model_price.status=1, seule liste blanche pour créer des tâches.
---

Les deux routes sont **anonymes**. Récupérez la liste, puis passez `model` à `POST /user/task`. Une passerelle non configurée ou une table vide renvoie `[]`.

Chaque ligne inclut la tarification en crédits : `unit` (`second` / `image` / `call`), `points_per_unit`, `member_points_per_unit`, `priced`. L'équipe d'exploitation importe les modèles depuis la passerelle sur la page [Tarification](/docs/api-admin-price).
