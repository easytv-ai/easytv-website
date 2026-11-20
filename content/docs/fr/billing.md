---
title: Facturation
description: Lots de crédits, tarifs abonnés, pré-débit puis solde, et comment WeChat / Alipay se raccordent au studio.
---

La création ne consomme que des **crédits**. L'ancien `quota` sert aux retraits et aux usages similaires ; il n'est pas utilisé pour la génération. Contrat : chapitre 6 d'API.md.

![Crédits dans le tableau de bord de la console d'administration](/images/docs/admin.svg)

## Fonctionnement des crédits

- Chaque attribution est un **lot** : origine + montant + expiration. Les lots qui expirent le plus tôt sont consommés en premier
- Solde = reste des lots non expirés
- La création d'une tâche **pré-débite** les crédits (`freeze`) ; le succès les solde (`settle`, montant 0 : l'estimation est définitive) ; l'échec ou l'annulation rembourse sous la forme d'un lot `refund` de 365 jours
- **Les modèles sans tarif ne peuvent pas créer de tâches**
- Le serveur recalcule le prix. Le nombre affiché côté client est indicatif ; le champ `price` de la réponse à la commande est le montant que vous payez

Les prix unitaires se trouvent dans `model_price` :

| Champ | Signification |
| --- | --- |
| `type` | `text` / `image` / `video` / `audio` |
| `unit` | `second` (vidéo) / `image` / `call` (texte, voix) |
| `points_per_unit` | prix public |
| `member_points_per_unit` | tarif abonné ; 0 signifie identique au prix public |

Estimation : vidéo `duration × count × unit` ; image / texte / voix `count × unit`. `count` doit valoir 1 à la création ; le client découpe les lots de générations.

Crédits suggérés à l'import : coût en USD de la passerelle × taux de change (7.3 par défaut) × marge (3 par défaut) × crédits par yuan (20 par défaut). Les modèles facturés à l'usage sont ramenés à l'appel / à l'image / à la seconde à partir d'une consommation de tokens supposée. Les exploitants peuvent modifier ces coefficients dans les réglages de la passerelle.

## Abonnements et packs

Les abonnements (`starter` / `creator` / `pro` / `flagship`) accordent des crédits mensuels et les tarifs abonnés tant qu'ils sont actifs. L'ouverture d'un abonnement règle immédiatement le premier mois (lot de 31 jours) ; une tâche cron recrédite le compte à chaque date d'attribution.

Les packs expirent au bout de 30 / 90 / 365 / 730 jours. Les abonnés achètent les packs au `member_price`.

Les remises annuelles / trimestrielles et les remises sur les sièges d'équipe se trouvent dans le réglage `BillingPromo`. Après `ends_at`, tous les taux valent 1.

Les comptes gratuits ont aussi des plafonds de simultanéité et de stockage (`FREE_CONCURRENT` / `FREE_STORAGE_GB` ; les abonnements les remplacent).

## Paiement

La page `/pricing` du studio appelle `POST /user/order` avec :

- `wechat_native` — `code_url` pour un QR code
- `alipay_f2f` — QR code de paiement en face à face
- `alipay_pc` — `payment_url` vers la caisse Alipay

Si un canal est désactivé, la commande reste `pending` et `pay` vaut null. `order_no` est aussi le numéro de transaction du paiement. Les rappels WeChat `/wechat/webhook` et Alipay `/alipay/webhook` exécutent la commande (attribution de l'abonnement ou des crédits), de façon idempotente.

## Liste de contrôle de l'administrateur

1. **Réglages système → Site** : `ServerAddress` est la racine publique de l'API (sans barre oblique finale), pour les rappels
2. **Réglages système → Paiements** : WeChat APIv3 Native, Alipay en mode certificat (F2F / PC peuvent être distincts)
3. Tenez à jour les **abonnements / packs / tarifs des modèles**
4. Pour les tests en local, accordez des crédits sur la page Utilisateurs au lieu de brancher les paiements

Les factures, les remboursements et le marquage « payé » exigent le super-administrateur (`role ≥ 100`).
