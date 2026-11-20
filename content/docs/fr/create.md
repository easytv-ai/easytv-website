---
title: Film en une phrase
description: Une phrase en entrée ; en sortie, un film planifié, généré par couches et sous-titré.
---

Chemin : `/create`. L'assistant suit les étapes saisie → note d'intention → génération par couches → montage → terminé. Contrat : API.md §8.2.

![Film en une phrase](/images/docs/create.png)

Les visiteurs anonymes voient l'étape 1 ; générer une note d'intention nécessite une connexion. L'état de l'assistant est conservé dans sessionStorage, indexé par l'identifiant du scénario ; un rafraîchissement ou `?screenplay=` reprend là où vous en étiez.

## Déroulement

### 1. Saisie

Un prompt (environ 8000 caractères), une durée de 15 / 30 / 60 secondes, un style facultatif. `POST /user/screenplay` appelle un modèle texte de façon synchrone et facture une fois au prix unitaire du texte.

Modèle texte par défaut : choix de la session en cours → dernier modèle mémorisé → `ComposePlanModel` sur la page **Croissance** de la console d'administration → premier modèle texte tarifé.

### 2. Note d'intention

Structure approximative :

```json
{
  "title": "",
  "style": "cinematic, cool grade",
  "aspect": "16:9",
  "characters": [{ "key": "c1", "name": "", "look": "wardrobe" }],
  "scenes": [{ "key": "s1", "name": "", "look": "set" }],
  "shots": [{ "no": 1, "scene": "s1", "characters": ["c1"], "prompt": "frame", "motion": "camera", "line": "dialogue", "seconds": 5 }]
}
```

Limites : ≤ 12 plans, ≤ 4 personnages, ≤ 4 décors. Enregistrez avec `PUT /user/screenplay/:id`.

`POST /user/screenplay/:id/estimate` chiffre les crédits par couche pour les modèles image / vidéo / audio que vous avez choisis.

### 3. Créer le canevas et générer

`POST /user/screenplay/:id/build` crée un canevas (et un projet si nécessaire) :

- nœud texte : résumé de la note d'intention
- une image par personnage (`sp.layer=character`)
- pour chaque plan : image → vidéo → voix s'il y a une réplique

Lancez ensuite la génération couche par couche, ou laissez l'assistant tout enchaîner. Les valeurs par défaut viennent des réglages `ComposeImageModel` / `ComposeVideoModel` / `ComposeAudioModel` (console d'administration, **Croissance → montage**). Si un canal de la passerelle est en panne, modifiez ces trois clés, sans toucher au code.

### 4. Montage

`POST /user/canvas/:id/compose` prend les nœuds vidéo réussis (triés par x ou par `clip_order`), les passe dans ffmpeg en 1280×720 / 30 fps, incruste le SRT et mixe la musique de fond à −14 dB. Les utilisateurs gratuits reçoivent un filigrane `EasyTV.ai` (`ComposeWatermarkEnabled` activé et utilisateur non abonné).

Le montage **ne consomme pas de crédits**. Un utilisateur peut avoir au plus 3 montages en file ou en cours ; la file globale est plafonnée à 20. Les montages de plus de 10 minutes échouent. Interrogez `GET /user/compose/:id`.

Le film est enregistré comme asset (`source=compose`) et peut être publié sur `/watch/:id`.

## Échecs typiques

- Erreur d'analyse de la note d'intention : l'API relance le modèle texte une fois
- Erreur 502 en image-vers-vidéo : certains canaux de passerelle fonctionnent en T2V mais pas en I2V. Faites pointer `ComposeVideoModel` vers un modèle que vous avez vérifié
- Erreurs 429 / 503 de la passerelle : le backend réessaie deux fois (en respectant `Retry-After`). Une fois les tentatives épuisées, il renvoie « 模型当前排队较多 »
