<div align="center">
  <img width="54" height="54" alt="ToolHub Logo" src="https://github.com/user-attachments/assets/a66786b6-3341-427b-9d4d-b29920b29ddd" />

  # ToolHub

  *Découvrez, filtrez, sauvegardez et gérez vos outils SaaS, logiciels et ressources.*

  ![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-2-4479A1?logo=mysql&logoColor=white)
  ![JWT](https://img.shields.io/badge/Auth-JWT-orange)
  ![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

<div align="center">
  <img width="926" height="385" alt="ToolHub Preview" src="https://github.com/user-attachments/assets/cc11b061-453a-4f80-95fd-2cb3f983454c" />
</div>

---

## Table des Matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Structure du Projet](#structure-du-projet)
- [Installation](#installation)
- [Démarrage](#démarrage)
- [Endpoints API](#endpoints-api)
- [Sécurité & Authentification](#sécurité--authentification)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Documentation Complémentaire](#documentation-complémentaire)

---

## Présentation

**ToolHub** est une application web complète pour découvrir, filtrer, sauvegarder et gérer des outils (SaaS, logiciels, ressources). Le projet inclut un frontend moderne (HTML/CSS/JS) et un backend Express exposant des APIs REST sécurisées.

---

## Fonctionnalités

### 🔍 Découverte et Gestion d'Outils

<img align="right" width="293" height="175" alt="Filtres" src="https://github.com/user-attachments/assets/d4874927-0f1a-4ba3-af31-4ee5702a64e7" />

- Page d'accueil dynamique avec cartes d'outils
- Système de filtres avancés (catégories, plateformes, OS, notations)
- Recherche en temps réel
- Ajout / modification / suppression d'outils *(propriétaires et admins uniquement)*
- Système de favoris (bookmarks)
- Toolbox personnalisée par utilisateur

<br clear="right"/>

### 👤 Gestion Utilisateurs

- Authentification complète (login/signup avec JWT)
- Page de profil avec modification des informations
- Changement de mot de passe sécurisé
- Suppression de compte avec modale de confirmation moderne
- Système de rôles : Visitor, Member, Admin, Moderator

### 🛠️ Panel d'Administration

- Gestion complète des outils (CRUD)
- Gestion des utilisateurs (CRUD)
- Attribution des rôles
- Transfert de propriété des outils
- Interface moderne avec onglets
- Gestion des catégories

### 🎨 Interface

<img align="right" width="161" height="199" alt="Mobile UI" src="https://github.com/user-attachments/assets/69971e82-b9fe-4b5c-bada-c0d32575a7e3" />

- Design moderne avec glassmorphism
- Responsive (desktop, tablette, mobile)
- Navigation adaptative selon l'état de connexion
- Notifications toast intégrées
- Interface en anglais

<br clear="right"/>

---

## Structure du Projet

```
/
├── index.js                        # Serveur Express (point d'entrée)
├── package.json                    # Dépendances et scripts
│
├── BackEnd/
│   ├── routes/                     # Routes API
│   │   ├── toolsRoutes.js          # /api/tools
│   │   ├── usersRoutes.js          # /api/users
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── bookmarksRoutes.js      # /api/bookmarks
│   │   ├── categoryroutes.js       # /api/category
│   │   ├── platformsroutes.js      # /api/platforms
│   │   ├── resourcesRoutes.js      # /api/resources
│   │   ├── osroutes.js             # /api/os
│   │   └── rolesRoutes.js          # /api/roles
│   ├── controllers/                # Logique métier
│   │   ├── authController.js       # Authentification JWT
│   │   ├── usersController.js      # Gestion utilisateurs
│   │   ├── toolsController.js      # Gestion outils
│   │   ├── bookmarksController.js
│   │   ├── categorycontroller.js
│   │   ├── rolesController.js
│   │   ├── platformscontroller.js
│   │   ├── oscontroller.js
│   │   └── resourcesController.js
│   ├── middleware/
│   │   └── authMiddleware.js       # requireAuth, requireAdminOrOwnership
│   └── Config/
│       ├── database.js             # Configuration MySQL
│       └── .env                    # Variables d'environnement
│
└── FrontEnd/
    ├── *.html                      # Pages (index, login, signup, profile, admin, toolbox, ressource, rgpd)
    ├── CSS/
    │   ├── index.css               # Styles principaux
    │   ├── admin.css               # Styles panel admin
    │   ├── profile.css             # Styles profil
    │   ├── cookies.css             # Styles cookies/RGPD
    │   └── ...
    ├── Assets/                     # Images et icônes
    ├── Data/
    │   └── carditem.js             # Données mock pour tests
    └── Scripts/
        ├── *.js                    # Scripts principaux par page
        ├── utils/
        │   ├── auth.js             # AuthManager (tokens, UI auth)
        │   ├── navigation.js       # Navigation adaptative
        │   └── cookies.js          # Gestion cookies RGPD
        ├── controler/              # Contrôleurs UI (filtres, header, bookmarks)
        ├── view/                   # Templates et logique par page
        │   ├── indexinner.js       # Page d'accueil
        │   ├── admininner.js       # Panel admin
        │   ├── profileinner.js     # Page profil
        │   ├── toolboxinner.js     # Toolbox utilisateur
        │   └── ...
        └── Tools/                  # Utilitaires UI (étoiles, burger menu)
```

---

## Installation

**Prérequis :** Node.js 18+

**1. Installer les dépendances**

```bash
npm install
```

**2. Configurer les variables d'environnement**

Créer le fichier `BackEnd/Config/.env` :

```env
PORT=3001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_NAME=toolhub
JWT_SECRET=replace_me_with_secure_secret
```

---

## Démarrage

```bash
# Production
npm start

# Développement (auto-reload avec nodemon)
npm run dev
```

| Ressource   | URL                          |
|-------------|------------------------------|
| Application | http://localhost:3001         |
| Healthcheck | `GET` http://localhost:3001/health |

> Le frontend est servi en statique depuis le dossier `FrontEnd/`.

---

## Endpoints API

### 🔐 Authentification — `/api/auth`

| Méthode | Endpoint    | Description                          | Auth |
|---------|-------------|--------------------------------------|------|
| `POST`  | `/register` | Inscription utilisateur              |      |
| `POST`  | `/login`    | Connexion utilisateur                |      |
| `POST`  | `/refresh`  | Rafraîchir le token d'accès          |      |
| `POST`  | `/logout`   | Déconnexion utilisateur              |      |
| `GET`   | `/me`       | Profil utilisateur actuel            | ✅   |

### 👥 Utilisateurs — `/api/users`

| Méthode  | Endpoint    | Description                                          | Auth              |
|----------|-------------|------------------------------------------------------|-------------------|
| `POST`   | `/login`    | Connexion (route alternative)                        |                   |
| `POST`   | `/signup`   | Inscription (route alternative)                      |                   |
| `POST`   | `/verify`   | Vérification du token                                |                   |
| `GET`    | `/`         | Liste tous les utilisateurs                          | Admin             |
| `GET`    | `/:id`      | Détails utilisateur                                  | Auth + Ownership  |
| `POST`   | `/create`   | Créer utilisateur                                    | Admin             |
| `PATCH`  | `/:id`      | Modifier utilisateur                                 | Auth + Ownership  |
| `DELETE` | `/:id`      | Supprimer utilisateur                                | Auth + Ownership  |

### 🔧 Outils — `/api/tools`

| Méthode  | Endpoint       | Description                    | Auth             |
|----------|----------------|--------------------------------|------------------|
| `GET`    | `/`            | Liste tous les outils          |                  |
| `GET`    | `/:id`         | Détails d'un outil             |                  |
| `GET`    | `/user/:userId`| Outils par utilisateur         |                  |
| `POST`   | `/`            | Créer un outil                 | ✅               |
| `PATCH`  | `/:id`         | Modifier un outil              | Propriétaire/Admin |
| `DELETE` | `/:id`         | Supprimer un outil             | Propriétaire/Admin |

### 📦 Ressources — `/api/resources`

| Méthode  | Endpoint | Description              |
|----------|----------|--------------------------|
| `GET`    | `/`      | Liste des ressources     |
| `GET`    | `/:id`   | Détails d'une ressource  |
| `POST`   | `/`      | Créer une ressource      |
| `PATCH`  | `/:id`   | Modifier une ressource   |
| `DELETE` | `/:id`   | Supprimer une ressource  |

### 🗂️ Catégories — `/api/category`

| Méthode  | Endpoint | Description                | Auth  |
|----------|----------|----------------------------|-------|
| `GET`    | `/`      | Liste des catégories       |       |
| `POST`   | `/`      | Créer une catégorie        | Admin |
| `PATCH`  | `/:id`   | Modifier une catégorie     | Admin |
| `DELETE` | `/:id`   | Supprimer une catégorie    | Admin |

### ⚙️ Autres Endpoints

| Route             | Méthode  | Endpoint | Description                     | Auth  |
|-------------------|----------|----------|---------------------------------|-------|
| **Rôles**         | `GET`    | `/`      | Liste des rôles                 |       |
| `/api/roles`      | `PATCH`  | `/:id`   | Modifier un rôle                | Admin |
| **Plateformes**   | `GET`    | `/`      | Liste des plateformes           |       |
| **OS**            | `GET`    | `/`      | Liste des systèmes d'exploitation|      |
| **Bookmarks**     | `GET`    | `/`      | Favoris utilisateur             | ✅    |
| `/api/bookmarks`  | `GET`    | `/:id`   | Détails d'un favori             | ✅    |
|                   | `POST`   | `/`      | Ajouter un favori               | ✅    |
|                   | `DELETE` | `/:id`   | Supprimer un favori             | ✅    |

---

## Sécurité & Authentification

### Backend

- **JWT** (JSON Web Tokens) pour l'authentification
- **`requireAuth`** — Vérifie le token JWT sur les routes protégées
- **`requireAdminOrOwnership`** — Accès réservé à l'admin ou au propriétaire de la ressource
  - Les admins (`ID_Role = 3`) peuvent modifier n'importe quelle ressource
  - Les utilisateurs ne peuvent modifier que leurs propres ressources
- **Bcrypt** pour le hashage des mots de passe
- **Protection CORS** configurée

### Frontend

`AuthManager` (`FrontEnd/Scripts/utils/auth.js`) gère :

- Les tokens access/refresh via `localStorage`
- Les méthodes `isAuthenticated()`, `getAuthHeader()`, `getCurrentUser()`
- La mise à jour automatique de l'UI selon l'état de connexion
- Le refresh automatique des tokens expirés
- La redirection vers `/login` si non authentifié
- La navigation adaptative *(Login/Signup ↔ Hello/Logout)*

### Système de Rôles

| ID | Rôle      | Description              |
|----|-----------|--------------------------|
| 1  | Visitor   | Utilisateur invité       |
| 2  | Member    | Membre standard          |
| 3  | Admin     | Administrateur complet   |
| 4  | Moderator | Modérateur               |

---

## Architecture

### Frontend

| Couche        | Dossier                    | Rôle                                         |
|---------------|----------------------------|----------------------------------------------|
| Pages         | `FrontEnd/*.html`          | Structure minimale, contenu injecté dynamiquement |
| Scripts       | `Scripts/*.js`             | Point d'entrée par page                      |
| Views         | `Scripts/view/*inner.js`   | Logique et templates par page                |
| Contrôleurs   | `Scripts/controller/`      | Actions UI (filtres, favoris, header)        |
| Utils         | `Scripts/utils/`           | Utilitaires réutilisables (auth, navigation, cookies) |
| Tools         | `Scripts/Tools/`           | Composants UI (étoiles, burger menu)         |

### Backend

| Couche      | Rôle                                     |
|-------------|------------------------------------------|
| Routes      | Définition des endpoints                 |
| Controllers | Logique métier et validation             |
| Middleware  | Authentification et autorisations        |
| Config      | Configuration base de données et environnement |

### Base de Données

- **MySQL** avec `mysql2`
- Tables principales : `users`, `tools`, `resources`, `category`, `roles`, `bookmarks`, `platforms`, `os`
- Relations many-to-many : `run_on` *(tools ↔ os)*, `need_platform` *(tools ↔ platforms)*

---

## Technologies

### Backend

| Package         | Version |
|-----------------|---------|
| Node.js         | 18+     |
| Express         | 5.1.0   |
| MySQL2          | 3.14.3  |
| jsonwebtoken    | 9.0.2   |
| bcrypt          | 6.0.0   |
| cors            | 2.8.5   |
| dotenv          | 17.2.1  |

### Frontend

- HTML5
- CSS3 — Variables, Flexbox, Grid, Glassmorphism
- JavaScript ES6+ — Modules natifs
- Fetch API
- LocalStorage

---

## Fonctionnalités Avancées

### Gestion des Outils
- Création avec association automatique au créateur
- Modification/suppression réservée au propriétaire ou à un admin
- Support multi-OS et multi-plateformes
- Upload d'images et liens externes
- Système de notation par étoiles

### Panel Admin
- Interface de gestion complète (en anglais)
- CRUD pour outils et utilisateurs
- Transfert de propriété des outils *(admin uniquement)*
- Attribution des rôles
- Modales modernes avec validation et notifications toast
- Gestion des catégories

### Profil Utilisateur
- Avatar avec initiales générées automatiquement
- Modification du nom et de l'email
- Changement de mot de passe sécurisé
- Suppression de compte avec confirmation renforcée :
  - Avertissement détaillé des données supprimées
  - Saisie obligatoire de `DELETE` pour confirmer
  - Validation en temps réel
  - Notifications toast

### RGPD & Cookies
- Bannière de consentement cookies
- Page RGPD dédiée
- Gestion des préférences utilisateur

---

## Documentation Complémentaire

| Fichier                | Description                             |
|------------------------|-----------------------------------------|
| `User-Credentials.md`  | Identifiants des utilisateurs de test   |
| `BackEnd/README.md`    | Documentation backend détaillée         |
