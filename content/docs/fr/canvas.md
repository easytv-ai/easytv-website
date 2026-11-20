---
title: Canevas libre
description: Types de nœuds, génération par liaisons, historique des versions, partage en lecture seule et plafond de 2 Mo.
---

Le canevas est le cœur du studio, sur `/canvas`. `?id=` en ouvre un ; `?project_id=` en crée un à partir d'un projet. L'API stocke `graph` comme un JSON opaque et **n'interprète pas la sémantique des nœuds**. Plafond : **2 Mo par canevas**.

![Nœuds et liaisons du canevas](/images/docs/canvas.png)

## Types de nœuds

| kind | Rôle |
| --- | --- |
| `text` | Scénario, prompts, légendes déduites d'une image. Jusqu'à 4 images de référence pour les modèles de vision |
| `image` | T2I / I2I, avec verrouillage facultatif du personnage et du style |
| `video` | T2V, première / dernière image, référence vidéo, portrait parlant (`videoMode=talking`) |
| `audio` | Synthèse vocale, musique de fond, dialogues |
| `storyboard` | Groupe de plans : images assemblées en grille |
| `director` | Scène du [plateau de réalisation 3D](/docs/director), réinjectée dans le même canevas |
| `panorama` | Image panoramique |

Un canevas vide propose des cartes de départ : scénario d'histoire, planche trois vues d'un personnage, vidéo à référence universelle, portrait parlant, musique de fond — ou déposez un modèle de [skill](/docs/community).

## Déroulement d'une génération

1. Ajoutez un nœud, renseignez le prompt, choisissez un modèle
2. Reliez l'amont à l'aval : les images servent de première image ou de référence, le texte de prompt pour les images
3. Lancez la génération. Le client appelle `POST /user/task`, puis interroge `GET /user/task/:id`
4. En cas de succès, l'asset est stocké et le `content` du nœud devient une URL lisible

Les modèles sans tarif échouent avec « 模型未定价 » et ne créent jamais de tâche. Les crédits suivent la [facturation](/docs/billing) : pré-débit d'abord, remboursement en cas d'échec ou d'annulation.

Les paramètres vidéo sont transmis tels quels : `ratio` / `resolution` / `duration` / `generate_audio` / `seed` / `negative_prompt`. Rôles des entrées : `first_frame`, `last_frame`, `reference`, `reference_video`, `reference_audio`.

## Versions et partage

- L'enregistrement automatique fusionne en une seule ligne toutes les 10 minutes environ ; Ctrl+S / Enregistrer envoie `snapshot: true`
- 50 versions au maximum par canevas. La restauration sauvegarde d'abord le graph courant
- `PUT` doit envoyer la `version` courante, sinon vous obtenez « 画布已在其他地方修改，请刷新 »
- Partage : `GET/PUT /user/canvas/:id/share`, page publique `/share/<token>` (l'ancien `/s/<token>` redirige en 301). Les visiteurs anonymes voient un graph allégé ; les utilisateurs connectés peuvent le copier dans leurs projets

## Outils média

Le rognage, la pellicule d'images, la suppression des silences, la séparation audio / vidéo et les actions similaires passent par les [outils média](/docs/media). Les actions ffmpeg locales sont gratuites ; l'upscale, la suppression des sous-titres incrustés, le détourage, etc. sont facturés via les capacités des modèles.

Le navigateur peut aussi découper / scinder / concaténer avec FFmpeg.wasm. Si le bucket n'a pas de CORS, utilisez le proxy média du studio et ajoutez l'hôte à `NUXT_PUBLIC_MEDIA_HOSTS`.
