# ToolHub

ToolHub est une application web pour découvrir, filtrer, sauvegarder et gérer des outils (SaaS, logiciels, ressources). Le projet inclut un frontend statique (HTML/CSS/JS) et un backend Express exposant des APIs REST.

## Fonctionnalités principales

- Découverte d’outils via une page d’accueil dynamique (cartes, filtres, recherche)
- Système de favoris (bookmarks)
- Filtres (catégories, plateformes, OS, notation)
- Authentification (login/signup, tokens)
- Toolbox personnalisée par utilisateur
- Interface responsive et moderne

## Structure du projet

```
/
├── index.js                      # Serveur Express (point d'entrée)
├── BackEnd/
│   ├── routes/                   # Routes API
│   │   ├── toolsRoutes.js        # /api/tools
│   │   ├── usersRoutes.js        # /api/users
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── bookmarksRoutes.js    # /api/bookmarks
│   │   ├── categoryroutes.js     # /api/category
│   │   ├── platformsroutes.js    # /api/platforms
│   │   ├── resourcesRoutes.js    # /api/resources
│   │   └── osroutes.js           # /api/os
│   ├── controllers/              # Logique métier
│   ├── middleware/               # authMiddleware.js
│   ├── Config/                   # database.js, .env
│   └── README.md
├── FrontEnd/
│   ├── index.html, login.html, signup.html, ressource.html, toolbox.html
│   ├── CSS/                      # Styles (index.css, ...)
│   ├── Data/                     # Données mock (carditem.js)
│   └── Scripts/
│       ├── index.js              # Composition page d'accueil
│       ├── utils/auth.js         # AuthManager (tokens, UI auth)
│       ├── controler/            # contrôleurs UI (filtres, header, bookmarks)
│       ├── view/                 # templates + logique par page
│       └── Tools/                # utilitaires UI (étoiles, burger menu)
├── AUTH_SETUP.md
├── PROFILE_FEATURES.md
└── Readme.md
```

## Installation

1. Prérequis: Node.js 18+
2. Installer les dépendances:
```bash
npm install
```
3. Créer le fichier d'env `BackEnd/Config/.env`:
```env
PORT=3001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_NAME=toolhub
JWT_SECRET=replace_me
```

## Démarrage

```bash
node index.js
# ou avec nodemon si configuré
```

- Frontend servi en statique depuis `FrontEnd/`
- Serveur: `http://localhost:3001`
- Healthcheck: `GET /health`

## Endpoints principaux

- Auth (`/api/auth`)
  - `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`
- Utilisateurs (`/api/users`)
  - `POST /login`, `POST /signup`, `POST /verify`
  - `GET /` (liste), `GET /:id`, `POST /create`, `PATCH /:id`, `DELETE /:id`
- Outils (`/api/tools`)
  - `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`
- Ressources (`/api/resources`)
  - `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`
- Catégories (`/api/category`) : `GET /`
- Plateformes (`/api/platforms`) : `GET /`
- OS (`/api/os`) : `GET /`
- Bookmarks (`/api/bookmarks`)
  - `GET /`, `GET /:id`, `POST /`, `DELETE /:id`

## Authentification côté Frontend

- `FrontEnd/Scripts/utils/auth.js` expose `AuthManager` qui gère:
  - Tokens (access/refresh) via localStorage
  - `isAuthenticated()`, `getAuthHeader()`
  - Mise à jour de l’UI (Login/Logout, redirection profil)
- Le bouton "Add Tool" n’apparaît que lorsqu’un utilisateur est connecté.

## Développement

- Les pages sont composées via `view/*inner.js` et injectées depuis `Scripts/*.js`
- Les actions UI (filtres, favoris) sont dans `controler/`
- Le backend monte ses routes dans `index.js`

## Licence

Projet éducatif/démo. Adaptez selon vos besoins.
