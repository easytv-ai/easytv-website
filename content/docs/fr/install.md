---
title: Installation
description: Ce qu'il faut pour déployer EasyTV, et quand choisir Docker plutôt que les sources.
---

La pile minimale est **API + MySQL + une passerelle compatible OpenAI**. Le studio et la console d'administration peuvent venir plus tard ; `/healthz` suffit à prouver que le backend fonctionne.

## Prérequis

| Élément | Remarques |
| --- | --- |
| MySQL 8.x | Obligatoire. Le premier démarrage crée le schéma par AutoMigrate |
| Redis | Recommandé. Sans lui, les limites de débit et les codes à usage unique se replient sur la mémoire |
| ffmpeg / ffprobe | Montage, extraction d'images, séparation de l'audio |
| Passerelle compatible OpenAI | Point d'entrée des modèles texte / image / vidéo / audio |
| Node.js 22.21+ et pnpm 10+ | Uniquement si vous exécutez les front-ends depuis les sources |

## Quelle méthode choisir

| Méthode | Quand |
| --- | --- |
| [Docker Compose](/docs/install-docker) | Par défaut. Une commande pour l'API ; `full` démarre aussi le studio et la console d'administration |
| [Exécution depuis les sources](/docs/install-source) | Lorsque vous modifiez le code du backend ou des front-ends |
| Binaire + systemd | Serveurs de production qui ne doivent pas exécuter Docker ; récupérez un build Linux dans les GitHub Releases |

## Ports

| Service | Port |
| --- | --- |
| easytv-api | 8383 |
| easytv-web | 3005 |
| easytv-manage | 3006 |
| easytv-partner | 3010 |

Si le navigateur n'est pas sur localhost, renseignez dans `.env` `PUBLIC_API_URL` et `PUBLIC_STUDIO_URL` avec les URL que le navigateur ouvre réellement.
