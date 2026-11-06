---
title: Skills
description: Official catalog, private skills, favorites. Text tasks with skill_id inject the contract.
---

The official list is anonymous — see [Public](/docs/api-public) `GET /skill`. This group is the logged-in user's own skills.

`guide` + `output_format` are the execution contract, prepended when `POST /user/task` has `skill_id` and `type=text`. Image / video tasks do not inject it.
