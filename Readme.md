# ToolHub <img width="1024" height="1024" alt="logo ToolHub" src="https://github.com/user-attachments/assets/f051a5b5-cafa-4841-962b-2c2219d50d5a" />


ToolHub est une application web complète pour découvrir, filtrer, sauvegarder et gérer des outils (SaaS, logiciels, ressources). Le projet inclut un frontend moderne (HTML/CSS/JS) et un backend Express exposant des APIs REST sécurisées.
---

<img width="926" height="385" alt="brave_r0AN2lvFJL" src="https://github.com/user-attachments/assets/cc11b061-453a-4f80-95fd-2cb3f983454c" />

---

## Fonctionnalités Principales

### Découverte et Gestion d'Outils
---

<img width="586" height="350" alt="brave_wdlkG8wPzP" src="https://github.com/user-attachments/assets/d4874927-0f1a-4ba3-af31-4ee5702a64e7" />

---

- Page d'accueil dynamique avec cartes d'outils
- Système de filtres avancés (catégories, plateformes, OS, notations)
- Recherche en temps réel
- Ajout/modification/suppression d'outils (propriétaires et admins uniquement)
- Système de favoris (bookmarks)
- Toolbox personnalisée par utilisateur

### Gestion Utilisateurs
- Authentification complète (login/signup avec JWT)
- Page de profil avec modification des informations
- Changement de mot de passe sécurisé
- Suppression de compte avec modale de confirmation moderne
- Système de rôles (Visitor, Member, Admin, Moderator)

### Panel d'Administration
- Gestion complète des outils (CRUD)
- Gestion des utilisateurs (CRUD)
- Attribution des rôles
- Transfert de propriété des outils
- Interface moderne avec onglets
- Gestion des catégories

### Interface
---

<img width="322" height="397" alt="brave_TsBvfuB1pH" src="https://github.com/user-attachments/assets/69971e82-b9fe-4b5c-bada-c0d32575a7e3" />

---

- Design moderne avec glassmorphism
- Responsive (desktop, tablet, mobile)
- Navigation adaptative selon l'état de connexion
- Notifications toast intégrées
- Interface en anglais

## Structure du Projet

```
/
├── index.js                      # Serveur Express (point d'entrée)
├── package.json                  # Dépendances et scripts
├── BackEnd/
│   ├── routes/                   # Routes API
│   │   ├── toolsRoutes.js        # /api/tools
│   │   ├── usersRoutes.js        # /api/users
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── bookmarksRoutes.js    # /api/bookmarks
│   │   ├── categoryroutes.js     # /api/category
│   │   ├── platformsroutes.js    # /api/platforms
│   │   ├── resourcesRoutes.js    # /api/resources
│   │   ├── osroutes.js           # /api/os
│   │   └── rolesRoutes.js        # /api/roles
│   ├── controllers/              # Logique métier
│   │   ├── authController.js     # Authentification JWT
│   │   ├── usersController.js    # Gestion utilisateurs
│   │   ├── toolsController.js    # Gestion outils
│   │   ├── bookmarksController.js
│   │   ├── categorycontroller.js
│   │   ├── rolesController.js
│   │   ├── platformscontroller.js
│   │   ├── oscontroller.js
│   │   └── resourcesController.js
│   ├── middleware/
│   │   └── authMiddleware.js     # requireAuth, requireAdminOrOwnership
│   ├── Config/
│   │   ├── database.js           # Configuration MySQL
│   │   └── .env                  # Variables d'environnement
│   └── README.md
├── FrontEnd/
│   ├── *.html                    # Pages (index, login, signup, profile, admin, toolbox, ressource, rgpd)
│   ├── CSS/                      # Styles
│   │   ├── index.css             # Styles principaux
│   │   ├── admin.css             # Styles panel admin
│   │   ├── profile.css           # Styles profil
│   │   ├── cookies.css           # Styles cookies/RGPD
│   │   └── ...
│   ├── Assets/                   # Images et icônes
│   ├── Data/
│   │   └── carditem.js           # Données mock pour tests
│   └── Scripts/
│       ├── *.js                  # Scripts principaux par page
│       ├── utils/
│       │   ├── auth.js           # AuthManager (tokens, UI auth)
│       │   ├── navigation.js     # Navigation adaptative
│       │   └── cookies.js        # Gestion cookies RGPD
│       ├── controler/            # Contrôleurs UI (filtres, header, bookmarks)
│       ├── view/                 # Templates et logique par page
│       │   ├── indexinner.js     # Page d'accueil
│       │   ├── admininner.js     # Panel admin
│       │   ├── profileinner.js   # Page profil
│       │   ├── toolboxinner.js   # Toolbox utilisateur
│       │   └── ...
│       └── Tools/                # Utilitaires UI (étoiles, burger menu)
├── AUTH_SETUP.md                 # Documentation authentification
├── PROFILE_FEATURES.md           # Documentation profil utilisateur
└── README.md                     # Ce fichier
```

## Installation

1. Prérequis: Node.js 18+
2. Installer les dépendances:
```bash
npm install
```
3. Créer le fichier d'environnement `BackEnd/Config/.env`:
```env
PORT=3001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_NAME=toolhub
JWT_SECRET=replace_me_with_secure_secret
```

## Démarrage du Serveur

```bash
npm start
# ou avec nodemon pour auto-reload
npm run dev
```

- Frontend servi en statique depuis `FrontEnd/`
- Serveur: `http://localhost:3001`
- Healthcheck: `GET /health`

## Endpoints API

### Authentification (`/api/auth`)
- `POST /register` - Inscription utilisateur
- `POST /login` - Connexion utilisateur
- `POST /refresh` - Rafraîchir le token d'accès
- `POST /logout` - Déconnexion utilisateur
- `GET /me` - Profil utilisateur actuel (protégé)

### Utilisateurs (`/api/users`)
- `POST /login` - Connexion (route alternative)
- `POST /signup` - Inscription (route alternative)
- `POST /verify` - Vérification du token
- `GET /` - Liste tous les utilisateurs (admin uniquement)
- `GET /:id` - Détails utilisateur (protégé par requireAuth + requireAdminOrOwnership)
- `POST /create` - Créer utilisateur (admin uniquement)
- `PATCH /:id` - Modifier utilisateur (propriétaire ou admin, protégé par requireAuth + requireAdminOrOwnership)
- `DELETE /:id` - Supprimer utilisateur (propriétaire ou admin, protégé par requireAuth + requireAdminOrOwnership)

### Outils (`/api/tools`)
- `GET /` - Liste tous les outils
- `GET /:id` - Détails d'un outil
- `GET /user/:userId` - Outils par utilisateur
- `POST /` - Créer un outil (utilisateurs authentifiés)
- `PATCH /:id` - Modifier un outil (propriétaire ou admin)
- `DELETE /:id` - Supprimer un outil (propriétaire ou admin)

### Ressources (`/api/resources`)
- `GET /` - Liste des ressources
- `GET /:id` - Détails d'une ressource
- `POST /` - Créer une ressource
- `PATCH /:id` - Modifier une ressource
- `DELETE /:id` - Supprimer une ressource

### Catégories (`/api/category`)
- `GET /` - Liste des catégories
- `POST /` - Créer une catégorie (admin)
- `PATCH /:id` - Modifier une catégorie (admin)
- `DELETE /:id` - Supprimer une catégorie (admin)

### Rôles (`/api/roles`)
- `GET /` - Liste des rôles
- `PATCH /:id` - Modifier un rôle (admin)

### Plateformes (`/api/platforms`)
- `GET /` - Liste des plateformes

### OS (`/api/os`)
- `GET /` - Liste des systèmes d'exploitation

### Bookmarks (`/api/bookmarks`)
- `GET /` - Favoris utilisateur (protégé)
- `GET /:id` - Détails d'un favori (protégé)
- `POST /` - Ajouter un favori (protégé)
- `DELETE /:id` - Supprimer un favori (protégé)

## Sécurité et Authentification

### Backend
- **JWT** (JSON Web Tokens) pour l'authentification
- **Middleware** `requireAuth` - Vérifie le token JWT
- **Middleware** `requireAdminOrOwnership` - Admin ou propriétaire uniquement
  - Les admins (ID_Role = 3) peuvent modifier n'importe quelle ressource
  - Les utilisateurs peuvent seulement modifier leurs propres ressources
- **Bcrypt** pour le hashage des mots de passe
- **Protection CORS** configurée

### Frontend
- `AuthManager` (`FrontEnd/Scripts/utils/auth.js`) gère:
  - Tokens (access/refresh) via localStorage
  - `isAuthenticated()`, `getAuthHeader()`, `getCurrentUser()`
  - Mise à jour automatique de l'UI selon l'état de connexion
  - Vérification et refresh automatique des tokens
- Redirection automatique vers login si non authentifié
- Navigation adaptative (boutons Login/Signup ↔ Hello/Logout)

### Système de Rôles
- **Visitor** (ID: 1) - Utilisateur invité
- **Member** (ID: 2) - Membre standard
- **Admin** (ID: 3) - Administrateur complet
- **Moderator** (ID: 4) - Modérateur

## Développement

### Architecture Frontend
- **Pages HTML** - Structure minimale, contenu injecté dynamiquement
- **Scripts principaux** (`Scripts/*.js`) - Point d'entrée par page
- **Views** (`Scripts/view/*inner.js`) - Logique et templates par page
- **Contrôleurs** (`Scripts/controller/`) - Actions UI (filtres, favoris, header)
- **Utils** (`Scripts/utils/`) - Utilitaires réutilisables (auth, navigation, cookies)
- **Tools** (`Scripts/Tools/`) - Composants UI (étoiles, burger menu)

### Architecture Backend
- **Routes** - Définition des endpoints
- **Controllers** - Logique métier et validation
- **Middleware** - Authentification et autorisations
- **Config** - Configuration base de données et environnement

### Base de Données
- **MySQL** avec mysql2
- Tables principales: `users`, `tools`, `resources`, `category`, `roles`, `bookmarks`, `platforms`, `os`
- Relations many-to-many: `run_on` (tools ↔ os), `need_platform` (tools ↔ platforms)

## Scripts NPM

```bash
npm start          # Démarrer le serveur
npm run dev        # Démarrer avec nodemon (auto-reload)
```

## Technologies

### Backend
- Node.js 18+
- Express 5.1.0
- MySQL2 3.14.3
- JWT (jsonwebtoken 9.0.2)
- Bcrypt 6.0.0
- CORS 2.8.5
- Dotenv 17.2.1

### Frontend
- HTML5
- CSS3 (CSS Variables, Flexbox, Grid, Glassmorphism)
- JavaScript ES6+ (Modules)
- Fetch API
- LocalStorage

## Fonctionnalités Avancées

### Gestion des Outils
- Création avec association automatique au créateur
- Modification/suppression réservée au propriétaire ou admin
- Support multi-OS et multi-plateformes
- Upload d'images et liens externes
- Système de notation par étoiles

### Panel Admin
- Interface de gestion complète (en anglais)
- CRUD pour outils et utilisateurs
- Transfert de propriété des outils (admin uniquement)
- Attribution des rôles
- Modales modernes avec validation
- Notifications toast
- Gestion des catégories
- CSS inline de secours pour le style

### Profil Utilisateur
- Avatar avec initiales
- Modification nom et email
- Changement de mot de passe sécurisé
- Suppression de compte avec modale de confirmation moderne
  - Avertissement détaillé des données à supprimer
  - Taper "DELETE" pour confirmer
  - Validation en temps réel
  - Notifications toast
- Interface moderne avec glassmorphism

### RGPD et Cookies
- Bannière de consentement cookies
- Page RGPD dédiée
- Gestion des préférences utilisateur

## Documentation Complémentaire

- **User-Credentials.md** - Identifiants des utilisateurs de test
- **BackEnd/README.md** - Documentation backend détaillée


