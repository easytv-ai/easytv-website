---
title: Licence
description: Quand utiliser l'AGPL-3.0 plutôt que la licence commerciale, et quels dépôts proposent des conditions commerciales.
---

Les dépôts du produit sont sous double licence **AGPL-3.0 + commerciale** :

| Dépôt | Licence |
| --- | --- |
| easytv-api / web / manage / partner | AGPL-3.0, plus un modèle de licence commerciale |
| easytv-website | AGPL-3.0 uniquement (site vitrine, non commercialisé) |

## Quand l'AGPL suffit

Étudiez, modifiez et auto-hébergez en respectant l'AGPL (publiez le code source correspondant si vous proposez une version modifiée sous forme de service en réseau). **L'AGPL autorise l'usage commercial** ; c'est un copyleft qui s'applique à l'usage en réseau.

## Quand une licence commerciale est nécessaire

Un produit à code fermé, ou une version modifiée hébergée ou en marque blanche sans ces obligations de publication du code source. Le fichier `COMMERCIAL-LICENSE.md` de chaque dépôt du produit est un modèle ; il s'applique une fois le bon de commande (Order) signé.

Écrivez à [leida@easyapi.com](mailto:leida@easyapi.com) en indiquant `[LICENSE] easytv-api` (ou le dépôt concerné) dans l'objet.

## Composants tiers

- Le plateau de réalisation est un portage d'[open-director](https://github.com/x1n9/open-director) (MIT)
- La structure utilisateurs / paiements / stockage objet de l'API suit [One API](https://github.com/songquanpeng/one-api) et d'autres projets open source amont. **Une licence commerciale ne change pas la licence de ces parties**
- Les dépendances npm / Go conservent leurs propres licences
