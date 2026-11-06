---
title: Media tools
description: Local ffmpeg actions (crop, silence) and model actions (upscale, unsubtitle).
---

Needs [auth](/docs/api-auth). Create is rate-limited to 30/min.

`engine=local` is free and needs ffmpeg on the server. `engine=model` submits a generation task; short credits or an unpriced model fail the create call and store nothing.
