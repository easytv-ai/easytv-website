---
title: Console d'administration
description: Ce que couvre easytv-manage, et les réglages à modifier en priorité après la mise en ligne.
---

La console d'administration dialogue avec `/admin/*` sur l'API ; son dépôt est [easytv-manage](https://github.com/easytv-ai/easytv-manage). Connectez-vous avec le compte `admin` créé au premier démarrage.

![Console d'administration : tableau de bord, utilisateurs, modération, tarifs et passerelle](/images/docs/admin.svg)

## Ce que vous pouvez gérer

| Domaine | Pages |
| --- | --- |
| Personnes | Utilisateurs, quotas d'équipe, partenaires |
| Contenu | Œuvres, films à la une, catégories, bannières, skills, prompts, styles, personnages, projets, assets, canevas |
| Communauté | Modération des commentaires / signalements / du fil, annonces, notifications |
| Argent | Commandes, recharges, retraits, mouvements, abonnements, packs de crédits, tarifs des modèles, factures |
| Croissance | Campagnes, parrainage et pointage quotidien, tableaux de bord |
| Système | Site, paiements, passerelle, croissance et factures (super-administrateur uniquement) |

Ces écritures vont dans la table `setting` ; l'API n'a pas besoin d'être redémarrée.

Les réglages système (super-administrateur uniquement) sont organisés en onglets : site, SMS, factures, paiements, passerelle et stockage, conversation IA, outils média. Les règles de croissance (parrainage, pointage quotidien, modèles par défaut du montage, taux de versement) se trouvent sur la page Croissance.

## Liste de contrôle du premier lancement

1. **Réglages système → Passerelle** : URL et clé de la passerelle compatible OpenAI, récupération des modèles, import des tarifs
2. **Réglages système → Site** : URL publique du studio (invitations et rappels)
3. **Réglages système → Paiements** : WeChat Pay / Alipay si vous vendez des abonnements ou des crédits
4. **Tarification des modèles** : prix en crédits par modèle

## Exécution

```bash
pnpm dev          # :3006
```

```bash
docker run -d -p 3006:3006 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  -e NUXT_PUBLIC_PARTNER_URL=https://partner.example.com \
  ghcr.io/easytv-ai/easytv-manage:latest
```

`NUXT_PUBLIC_PARTNER_URL` est le lien « ouvrir la console partenaires ». Sans backend, la page de connexion propose un compte de démonstration qui permet seulement de parcourir l'interface. `role ≥ 10` est requis ; les réglages de la passerelle, des paiements et du site exigent le super-administrateur (`role ≥ 100`).
