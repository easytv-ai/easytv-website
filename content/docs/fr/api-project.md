---
title: Projets
description: Conteneurs de films. Les canevas sont rattachés à un projet ; créer un canevas sans project_id crée aussi un projet du même nom.
---

Nécessite l'[authentification](/docs/api-auth). La page `/projects` du studio appelle ces routes.

Champs : `id`, `user_id`, `name`, `description`, `cover_url`, `status`, `canvas_id` (lecture seule, canevas le plus récent), horodatages. Dans la liste, un `cover_url` vide est complété par une image récente, dans la réponse uniquement. Ouvrez le canevas avec le `canvas_id` renvoyé.
