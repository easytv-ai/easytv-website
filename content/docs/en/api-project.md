---
title: Projects
description: Film containers. Canvases hang off a project; creating a canvas without project_id also creates a same-name project.
---

Needs [auth](/docs/api-auth). The studio `/projects` page calls these.

Fields: `id`, `user_id`, `name`, `description`, `cover_url`, `status`, `canvas_id` (read-only, latest canvas), timestamps. An empty list `cover_url` is filled with a recent frame in the response only. Open the canvas with the returned `canvas_id`.
