# Le Poulailler — Application Mobile

Application React Native (Expo) pour **Le Poulailler**, complémentaire au site web PWA.

## Prérequis

- Node.js 18+
- npm ou yarn
- Expo Go (sur téléphone) ou émulateur Android/iOS

## Installation

```bash
cd mobile-app
npm install
```

## Lancement

```bash
# Développement (scan QR avec Expo Go)
npm start

# Android
npm run android

# iOS (macOS uniquement)
npm run ios

# Version web (PWA via Expo)
npm run web
```

## Structure

- `app/` — Écrans Expo Router
- `assets/` — Logo et images galerie
- Le site web principal reste dans le dossier parent (`index.html`)

## Fonctionnalités

- Accueil avec branding Le Poulailler
- Galerie horizontale
- Commande directe via WhatsApp
- Lien vers le site web complet
