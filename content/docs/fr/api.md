---
title: Référence API
description: L'API EasyTV complète. Regroupée par ressource, avec des paramètres typés et un corps de réponse 200 sur chaque page.
---

Le backend est une API REST en deux familles : **studio et utilisateur**, et **administration et partenaires**. Le studio, la console d'administration et la console partenaires partagent une même connexion. **N'utilisez pas de cookies pour l'authentification.**

- Base URL : `NUXT_PUBLIC_API_BASE_URL`, en local `http://127.0.0.1:8383`. Les exemples curl utilisent `$API`.
- Le statut HTTP est **toujours 200**. Lisez `success` dans le JSON.
- Les horodatages sont en secondes Unix. Un `deleted_at` vide signifie « non supprimé ».
- Pagination : `?page=1&page_size=20` (100 au maximum).
- Suppression logique : `DELETE` envoie à la corbeille ; suppression physique après 30 jours.

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "reason" }
```

Les en-têtes d'authentification sont `Authorization: Bearer <token>` et `EasyTV-User`. Les entités et les machines à états sont décrites dans [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md). **Modifiez ce fichier avant le code.**
