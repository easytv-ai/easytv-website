---
title: API d'administration
description: /admin/* pour la console d'administration. role ≥ 10 ; les réglages, les remboursements et les ajustements de crédits exigent role ≥ 100.
---

L'appelant est [easytv-manage](https://github.com/easytv-ai/easytv-manage). Même authentification que pour les [utilisateurs](/docs/api-auth-login), avec en plus un rôle d'administrateur.

RootAuth (`role ≥ 100`) est requis pour les réglages, la suppression de comptes, la réassociation, le quota, les versements, les remboursements et le marquage « payé », les ajustements de crédits, ainsi que la modification des abonnements, des packs, des promotions et des tarifs des modèles. Les administrateurs ordinaires reçoivent `权限不足`.

Les groupes détaillés se trouvent à gauche : utilisateurs, modération, tarification.
