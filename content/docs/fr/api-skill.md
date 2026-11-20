---
title: Skills
description: Catalogue officiel, skills privés, favoris. Les tâches texte avec skill_id injectent le contrat.
---

La liste officielle est anonyme : voir `GET /skill` dans l'[API publique](/docs/api-public). Ce groupe concerne les skills propres à l'utilisateur connecté.

`guide` + `output_format` forment le contrat d'exécution, inséré en tête du prompt lorsque `POST /user/task` comporte `skill_id` et `type=text`. Les tâches image / vidéo ne l'injectent pas.
