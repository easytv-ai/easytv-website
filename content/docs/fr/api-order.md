---
title: Commandes et paiements
description: Devis, commande, interrogation, fermeture. Montants en CNY ; le serveur recalcule le prix, les devis côté client sont indicatifs.
---

Les devis peuvent être anonymes ; passer une commande nécessite l'[authentification](/docs/api-auth). Les canaux sont WeChat Native et Alipay.

`kind` : `membership` / `points`. `status` : `pending` → `paid` / `closed` / `refunded`. En production, `ServerAddress` doit être défini, sinon le canal ne peut pas envoyer son rappel.
