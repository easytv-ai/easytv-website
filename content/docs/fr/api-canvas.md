---
title: Canevas
description: graph opaque, verrou optimiste version, historique, partage en lecture seule et conversation.
---

Nécessite l'[authentification](/docs/api-auth). Chemin dans le studio : `/canvas?id=`. Le backend n'interprète **pas** la sémantique des nœuds. **2 Mo maximum par canevas**. N'enregistrez pas les captures de caméra en base64 dans le `data.scene` d'un nœud de réalisation.

Chaque enregistrement doit envoyer la `version` courante, sinon vous obtenez « 画布已在其他地方修改，请刷新 ». 50 versions au maximum. Le chemin de partage est `/share/<token>`.
