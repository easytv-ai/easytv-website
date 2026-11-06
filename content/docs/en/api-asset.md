---
title: Assets
description: Upload, list, trash. generated = task output, upload = user file, media = media-tool output.
---

Needs [auth](/docs/api-auth). Type comes from MIME: `image` / `video` / `audio` / `text` / `other`. Default max file 200 MB (`UPLOAD_MAX_MB`). With Qiniu, the browser uploads directly then registers via `POST /user/asset/import`.
