---
title: Plateau de réalisation 3D
description: Placez les personnages, réglez les caméras et leurs mouvements dans le navigateur ; la description des plans est réinjectée dans le canevas.
---

Chemin : `/canvas/director`. Le plateau est un portage Vue / TresJS d'[open-director](https://github.com/x1n9/open-director) (MIT) et partage le même `graph` que le canevas libre.

![Plateau de réalisation 3D](/images/docs/director.png)

## À quoi il sert

Le langage des plans est l'endroit où la génération de séries courtes déraille le plus souvent. Le plateau vous permet de voir le placement des personnages et les caméras en 3D, puis de transmettre cette description à un modèle vidéo, au lieu d'espérer qu'un paragraphe de prompt suffise.

Parcours type :

1. Déposez un nœud `director`, ou ouvrez le plateau depuis la barre du canevas
2. Faites entrer les personnages (éventuellement à partir des planches trois vues de la bibliothèque de personnages) et un décor
3. Placez les caméras, réglez travelling avant / latéral / panoramique, puis prévisualisez le mouvement
4. Exportez la description du plan dans le `data.scene` de ce nœud, puis reliez un nœud vidéo en aval

## Stockage

`data.scene` contient une scène complète (personnages, caméras, mouvements, décor). L'API **ne l'interprète pas**.

Avant l'enregistrement, le client retire :

- les captures de caméra (PNG en base64, souvent > 1 Mo chacune)
- les ressources blob locales au navigateur

L'ensemble du canevas dispose de **2 Mo**. Un seul nœud de réalisation qui embarque des captures rend le canevas impossible à enregistrer. Voir `easytv-web/app/utils/director/persist.ts`.

Les modèles de mannequin UE situés sous `public/director-assets/` ont leur propre licence ; la licence commerciale ne la modifie pas.
