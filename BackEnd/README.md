# Backend ToolHub

Ce dossier contient le code source du backend de ToolHub.

## Structure

- `src/` : Code principal (serveur, configuration)
- `routes/` : Définition des routes API
- `models/` : Schémas de données (utilisateur, outil, favoris...)
- `controllers/` : Logique métier

## Lancement rapide

1. Copier `.env.example` en `.env` et adapter les variables
2. Installer les dépendances : `npm install`
3. Lancer le serveur : `npm start` ou `npx nodemon`

## Endpoints principaux (exemples)

- `GET /api/tools` : Liste des outils
- `POST /api/users` : Création d'utilisateur
- `POST /api/login` : Authentification
- `POST /api/bookmarks` : Ajouter un favori

---

Complétez ce README au fur et à mesure du développement backend.
