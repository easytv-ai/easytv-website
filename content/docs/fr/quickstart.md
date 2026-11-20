---
title: Démarrage rapide
description: De la machine vierge au premier film, avec Docker, la connexion à la console d'administration, la passerelle et le film en une phrase.
---

Visez un clip terminé en **15 minutes environ**. Il vous faut Docker 24+ et un jeton de passerelle compatible OpenAI capable d'appeler des modèles texte, image et vidéo.

Autres options d'installation : [Installation](/docs/install). Tour des fonctionnalités : [Studio](/docs/studio).

## 1. Démarrer la pile

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

Modifiez `.env` :

- `ROOT_PASSWORD` — mot de passe du premier administrateur (le nom d'utilisateur par défaut est `admin`)
- `CRYPTO_SECRET` — `openssl rand -hex 32`

```bash
docker compose --profile full up -d
curl http://localhost:8383/healthz
```

| Ouvrir | URL |
| --- | --- |
| API | http://localhost:8383 |
| Studio | http://localhost:3005 |
| Console d'administration | http://localhost:3006 |

La console partenaires est distincte ; voir [Console partenaires](/docs/partner).

## 2. Se connecter à la console d'administration

Ouvrez http://localhost:3006 avec `admin` et votre `ROOT_PASSWORD`.

Modifiez les réglages dans cet ordre (tous sous **Réglages système**, appliqués immédiatement) :

1. **Site** : URL publique du studio `http://localhost:3005` (invitations et rappels de paiement)
2. **Passerelle** : Base URL et clé de la passerelle compatible OpenAI → récupérer les modèles → **importer les tarifs**
3. **Tarification des modèles** : vérifiez les prix unitaires texte / image / vidéo (les modèles sans tarif ne peuvent pas générer)

Détails : [Connexion à la passerelle](/docs/gateway).

## 3. Donner des crédits à l'administrateur

La génération consomme des crédits. Sur la page **Utilisateurs**, trouvez `admin` et accordez-lui un lot de test (ou ouvrez-lui un abonnement).

Vous pouvez aussi payer sur `/pricing`, mais pour les tests en local on recharge généralement à la main.

## 4. Lancer le film en une phrase

Ouvrez http://localhost:3005/create (connectez-vous avec le même compte `admin`).

1. Saisissez une phrase et choisissez 15 / 30 / 60 secondes
2. Générez une note d'intention (une facturation du modèle texte)
3. Relisez les personnages, les décors et les plans, puis **créez le canevas**
4. Générez par couches les images des personnages, les images des plans, les vidéos des plans et la voix off
5. Montage : concaténation ffmpeg, incrustation des sous-titres, mixage de la musique de fond ; les comptes gratuits reçoivent un filigrane

Parcours complet : [Film en une phrase](/docs/create).

## 5. Et ensuite

- Modifier les plans sur le canevas : [Canevas libre](/docs/canvas)
- Placer les caméras : [Plateau de réalisation 3D](/docs/director)
- Vendre des abonnements : [Facturation](/docs/billing)
- Utiliser votre propre domaine : [Mise en production](/docs/deploy)
