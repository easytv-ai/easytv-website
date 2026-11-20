---
title: Connexion à la passerelle
description: Raccordez EasyTV à une passerelle compatible OpenAI, récupérez les modèles et importez les tarifs en crédits.
---

EasyTV appelle les modèles par des routes compatibles OpenAI : `/v1/chat`, `/v1/images`, `/v1/videos` (et l'audio si la passerelle l'expose). **Il vous faut une passerelle pour que la génération fonctionne.**

Renseignez l'URL et la clé de la passerelle dans la console d'administration, sous **Réglages système → Passerelle**. Les modifications s'appliquent sans redémarrage.

![Passerelle dans la console d'administration](/images/docs/admin.svg)

## Première configuration

1. Munissez-vous d'un jeton pour une passerelle compatible OpenAI en service, capable d'appeler les modèles texte / image / vidéo qui vous intéressent.
2. Connectez-vous à la console d'administration avec `admin` → **Réglages système → Passerelle**.
3. Enregistrez la Base URL et la clé de la passerelle.
4. Récupérez la liste des modèles et **importez les tarifs** des modèles que vous utiliserez.
5. Vérifiez les prix en crédits à la seconde / à l'image / à l'appel sous **Tarification des modèles**. Les estimations de coût du studio s'appuient sur ces valeurs.

Clés de réglage : `EasyAPIGatewayBaseUrl`, `EasyAPIGatewayKey`, `EasyAPIGatewayEnabled`. Les prix unitaires se trouvent dans `model_price`.

Si l'hôte des appels et celui des tarifs diffèrent (par exemple `api.xxx.com` et `token.xxx.com`), renseignez aussi `EasyAPIGatewayPricingBaseUrl`. Le solde réel de la passerelle nécessite le « jeton d'accès système » de sa console, `EasyAPIGatewayAccessToken` (les jetons sk n'affichent pas de solde réel). En dessous de `GatewayBalanceAlertUSD` (20 USD par défaut), les administrateurs reçoivent une notification interne.

Crédits suggérés :

```
gateway USD cost × FX (7.3) × markup (3) × credits-per-yuan (20)
```

Les modèles facturés à l'usage sont ramenés à l'appel / à l'image / à la seconde à partir d'une consommation de tokens supposée. Vous pouvez modifier ces coefficients. Après l'import, relisez tout de même la **Tarification des modèles**, en particulier le prix de la vidéo à la seconde et la capacité `native_audio` pour le portrait parlant.

## Ce que la passerelle voit réellement

EasyTV n'appelle pas les SDK des fournisseurs. Tout passe par `service/providers/easyapi.go` :

| Type | Chemin sur la passerelle |
| --- | --- |
| Texte | `POST /v1/chat/completions` (jusqu'à 4 images pour la vision) |
| Image | `POST /v1/images/generations` |
| Voix | `POST /v1/audio/speech` |
| Vidéo | `POST /v1/videos`, puis interrogation de `GET /v1/videos/{job_id}` |

Les assets utilisent `input_references[{type,url,role}]`. Les URL d'image-vers-vidéo doivent être accessibles en GET par la passerelle ; voir [Stockage](/docs/storage).

Les erreurs 429 / 503 sont réessayées deux fois (en respectant `Retry-After`). Les erreurs 502 / 504 peuvent avoir déjà créé une tâche en amont ; elles ne sont donc pas réessayées. Les erreurs reconnues deviennent une phrase en chinois pour le créateur ; le corps brut est consigné dans SysLog.

## D'où viennent les modèles

EasyTV n'embarque aucun SDK de fournisseur. Kling, Jimeng, Seedance, Hailuo, Sora, GPT, Qwen, MiniMax et les autres ont seulement besoin que la passerelle les fasse correspondre à ces routes de style OpenAI. Changer de modèle revient à changer de canal sur la passerelle, pas à modifier le code d'EasyTV.

## Échecs typiques

- La passerelle renvoie 200 mais le studio reste indéfiniment en file d'attente : cherchez des erreurs amont dans les journaux de l'API, et vérifiez que ce modèle a bien été importé dans la tarification.
- Seul un modèle de chat est configuré : les nœuds image / vidéo échouent tant que la passerelle n'expose pas ces routes.
- La Base URL contient déjà `/v1` : n'ajoutez pas un second `/v1` à ce qu'attend le formulaire de la console d'administration.
