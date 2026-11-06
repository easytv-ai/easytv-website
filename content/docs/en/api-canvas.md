---
title: Canvas
description: Opaque graph, optimistic version, history, read-only share and chat.
---

Needs [auth](/docs/api-auth). Studio path `/canvas?id=`. The backend does **not** parse node semantics. Max **2 MB per canvas**. Do not persist camera-screenshot base64 inside a director node's `data.scene`.

Saves must send the current `version` or you get “画布已在其他地方修改，请刷新”. Max 50 versions. Share path is `/share/<token>`.
