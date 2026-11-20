---
title: Assets
description: Envoi, liste, corbeille. generated = résultat d'une tâche, upload = fichier de l'utilisateur, media = résultat d'un outil média.
---

Nécessite l'[authentification](/docs/api-auth). Le type est déduit du MIME : `image` / `video` / `audio` / `text` / `other`. Taille maximale par défaut : 200 Mo par fichier (`UPLOAD_MAX_MB`). Avec Qiniu, le navigateur envoie le fichier directement puis l'enregistre via `POST /user/asset/import`.
