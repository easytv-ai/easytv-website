---
title: Works
description: Publish from an asset, like, comment. The public feed is a separate anonymous group.
---

Logged-in CRUD needs [auth](/docs/api-auth). The public feed is under [Public](/docs/api-public).

`status`: 0 draft / 1 published / 2 unpublished / -1 rejected. `review_status`: 0 pending / 1 approved / 2 rejected. Publish is not blocked; review is after the fact. `canvas_id` is required to expose the process.
