---
title: Console partenaires
description: Commissions et outils promotionnels en libre-service dans easytv-partner, pour les MCN, les écoles et les KOL.
---

La console partenaires dialogue avec `/user/partner/*` ; son dépôt est [easytv-partner](https://github.com/easytv-ai/easytv-partner). Les partenaires se connectent avec un compte EasyTV ordinaire, déposent leur candidature et, une fois approuvés, obtiennent un lien et un code de parrainage.

## Ce qu'un partenaire peut faire

| Domaine | Remarques |
| --- | --- |
| Tableau de bord | Clients, clients payants, ventes et commissions ; tendance sur 7 / 30 / 90 jours |
| Clients | Pseudos masqués, origine, premier paiement, dépense cumulée |
| Commissions et retraits | Mouvements, historique, demande de retrait (Alipay / WeChat / virement bancaire) |
| Codes bonus | Utilisations, inscriptions, conversions payantes |
| Supports promotionnels | Lien, QR code, textes, règles |
| Candidature | Déposer, soumettre à nouveau après un refus, modifier les contacts |

Les taux de commission, les fenêtres d'attribution et la validation se règlent dans la console d'administration, sous **Réglages système → Croissance** et sur la page Partenaires. Les administrateurs peuvent aussi émettre un ticket à usage unique pour entrer dans la console d'un partenaire.

## Exécution

```bash
pnpm dev          # :3010
```

`NUXT_PUBLIC_API_BASE_URL` pointe vers l'API ; `NUXT_PUBLIC_STUDIO_URL` pointe vers le studio (solution de repli pour les liens promotionnels).

Docker :

```bash
docker run -d -p 3010:3010 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-partner:latest
```

Les administrateurs peuvent émettre un ticket à usage unique sur la page Partenaires de la console d'administration et ouvrir `/console?ticket=` pour arriver directement dans la console de ce partenaire.
