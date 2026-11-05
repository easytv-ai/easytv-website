---
title: Skills
description: Official skill plaza, private skills, favorites. Text tasks with skill_id inject the execution contract.
---

Official list is anonymous (`GET /skill`). Below is the signed-in surface.

`guide` + `output_format` prepend to text prompts as rules → format → user request. Image / video tasks do not inject them.

## GET `/user/skill`

My private skills. `keyword?`.

## POST `/user/skill`

`title` + `prompt` required. `{{prompt}}` is the inspiration slot. `canvas_id` stores a sanitized graph as the template; `0` clears it.

## GET `/user/skill/:id`

Includes `graph`. Official listed skills are also readable.

## PUT `/user/skill/:id` · DELETE `/user/skill/:id`

Own private skills only. Admin may only take user skills down, not edit, re-list or delete them.

## GET `/user/skill/favorites`

## POST `/user/skill/:id/favorite`

Toggle. `{ favorited, stars }`.
