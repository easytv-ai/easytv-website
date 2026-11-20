---
title: Tâches de génération
description: Créer, interroger, annuler, relancer. Les crédits sont d'abord pré-débités ; le modèle doit figurer dans la liste model_price active.
---

Nécessite l'[authentification](/docs/api-auth). La génération depuis l'inspecteur du canevas et la tâche texte de la conversation utilisent ce groupe. La liste des modèles est anonyme : voir [Modèles](/docs/api-models).

États : `pending` → `running` → `succeeded` / `failed` / `cancelled`.

- Les crédits sont **pré-débités** (freeze) à la création, soldés (`settle`) en cas de succès et libérés (`unfreeze`) en cas d'échec ou d'annulation (lots de 365 jours).
- `params.count` doit valoir 1.
- Un `model` inconnu renvoie `模型暂未接入` et rien n'est enregistré.
- Un solde insuffisant renvoie `积分不足，还需 N 积分`.
- La génération passe uniquement par une passerelle compatible OpenAI.
