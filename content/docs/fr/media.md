---
title: Outils média
description: Les actions ffmpeg de la barre d'outils du canevas, et les actions par modèle conditionnées aux capacités.
---

Plus de vingt entrées de la barre d'outils partagent `media_job`. Les actions ffmpeg locales sont gratuites et produisent de véritables assets ; les actions par modèle sont facturées via des capacités tarifées. Contrat : chapitre 23 d'API.md.

L'hôte de l'API a besoin de `ffmpeg` / `ffprobe` (dans le `PATH` ou via les réglages `FFmpegPath` / `FFprobePath`). Dans la console d'administration, **Réglages système → Outils média** permet de masquer des boutons et de modifier les plafonds des files d'attente.

## Actions locales (gratuites)

Tout le groupe est indisponible sans ffmpeg.

| action | Nom | Source → résultat |
| --- | --- | --- |
| `crop` | Rogner | vidéo / image |
| `grid_split` | Découpe en grille | image → N images (1 à 25) |
| `montage` | Mosaïque de storyboard | N images → une grille |
| `trim` | Découper | vidéo / audio |
| `split` | Scinder | un fichier en deux |
| `remove_silence` | Supprimer les silences | vidéo / audio |
| `extract_audio` / `mute_video` / `split_av` | Extraire l'audio / couper le son / séparer audio et vidéo | vidéo |
| `mix_bgm` | Mixer une musique de fond | vidéo + asset audio |
| `extract_frame` / `extract_frames` | Image fixe / pellicule d'images | vidéo → images |
| `storyboard` | Découpage en plans | pellicule d'images + lecture par un modèle texte |
| `compress` | Compresser | vidéo / image |

Plafonds par défaut : 3 traitements en file ou en cours par utilisateur, 20 au total (réglables dans la console d'administration). Limite de création : 30/min.

La découpe en grille **ne rogne pas dans le navigateur** (un OSS sans CORS ne permet pas de lire les pixels) ; un seul traitement produit donc N résultats.

## Actions par modèle (payantes)

Les étiquettes de capacité se trouvent dans `model_price.abilities` (séparées par des virgules). En l'absence d'étiquettes, la détection se replie sur le nom du modèle (`*upscale*`, `*subtitle*`, `*demucs*` …). Lorsqu'une capacité manque, le bouton est affiché désactivé au lieu d'échouer au clic.

Étiquettes courantes : `upscale`, `remove_subtitle`, `vocal_separation`, `bgm_separation`, `matting`, `subject_remove` / `modify` / `replace`, `motion_capture`, `native_audio` (le mode portrait parlant ne liste que les modèles vidéo capables de prononcer la réplique), `video_reference` (référence universelle / remix).

Créer une action par modèle crée aussi une tâche de génération : des crédits insuffisants, un modèle sans tarif ou le plafond de simultanéité font échouer la requête, et aucun traitement n'est créé.

## Montage dans le navigateur

Le studio embarque aussi FFmpeg.wasm pour découper / scinder / concaténer entièrement côté client. Les gros fichiers et le montage sur timeline passent toujours par l'API.
