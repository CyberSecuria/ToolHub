# Backend ToolHub

Backend Node.js/Express exposant les API REST sécurisées de l'application ToolHub.

## Vue d'ensemble

API complète avec:
- Authentification JWT (access + refresh tokens)
- Système de rôles et permissions
- Protection des routes sensibles
- Gestion complète des outils et utilisateurs
- Base de données MySQL

## Démarrage rapide

1. Installer les dépendances à la racine du projet:
```bash
npm install
```
2. Créer `BackEnd/Config/.env`:
```env
PORT=3001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_NAME=toolhub
JWT_SECRET=replace_me
```
3. Lancer le serveur:
```bash
node index.js
# ou avec nodemon pour auto-reload
npm run dev
```

## Accès

- Serveur: `http://localhost:3001`
- Frontend servi depuis `FrontEnd/`
- Healthcheck: `GET /health`
- API: `http://localhost:3001/api/*`

## Montage des routes (index.js)

- `/api/auth` → `BackEnd/routes/authRoutes.js` - Authentification JWT
- `/api/users` → `BackEnd/routes/usersRoutes.js` - Gestion utilisateurs
- `/api/tools` → `BackEnd/routes/toolsRoutes.js` - Gestion outils
- `/api/resources` → `BackEnd/routes/resourcesRoutes.js` - Gestion ressources
- `/api/bookmarks` → `BackEnd/routes/bookmarksRoutes.js` - Favoris utilisateur
- `/api/category` → `BackEnd/routes/categoryroutes.js` - Catégories
- `/api/roles` → `BackEnd/routes/rolesRoutes.js` - Rôles utilisateurs
- `/api/platforms` → `BackEnd/routes/platformsroutes.js` - Plateformes
- `/api/os` → `BackEnd/routes/osroutes.js` - Systèmes d'exploitation

## Endpoints détaillés

### Authentification (`/api/auth`)
- `POST /register` - Inscription (hashage bcrypt)
- `POST /login` - Connexion (génération JWT)
- `POST /refresh` - Rafraîchir access token
- `POST /logout` - Déconnexion
- `GET /me` - Profil utilisateur actuel (protégé)

### Utilisateurs (`/api/users`)
- `POST /login` - Connexion alternative
- `POST /signup` - Inscription alternative
- `POST /verify` - Vérification token
- `GET /` - Liste utilisateurs (admin)
- `GET /:id` - Détails utilisateur (protégé)
- `POST /create` - Créer utilisateur (admin)
- `PATCH /:id` - Modifier utilisateur (propriétaire ou admin)
- `DELETE /:id` - Supprimer utilisateur (propriétaire ou admin)

### Outils (`/api/tools`)
- `GET /` - Liste tous les outils
- `GET /:id` - Détails d'un outil
- `GET /user/:userId` - Outils d'un utilisateur
- `POST /` - Créer outil (authentifié)
- `PATCH /:id` - Modifier outil (propriétaire ou admin)
- `DELETE /:id` - Supprimer outil (propriétaire ou admin)

### Ressources (`/api/resources`)
- `GET /` - Liste ressources
- `GET /:id` - Détails ressource
- `POST /` - Créer ressource
- `PATCH /:id` - Modifier ressource
- `DELETE /:id` - Supprimer ressource

### Catégories (`/api/category`)
- `GET /` - Liste catégories
- `POST /` - Créer catégorie (admin)
- `PATCH /:id` - Modifier catégorie (admin)
- `DELETE /:id` - Supprimer catégorie (admin)

### Rôles (`/api/roles`)
- `GET /` - Liste rôles
- `PATCH /:id` - Modifier rôle (admin)

### Plateformes (`/api/platforms`)
- `GET /` - Liste plateformes

### OS (`/api/os`)
- `GET /` - Liste systèmes d'exploitation

### Bookmarks (`/api/bookmarks`)
- `GET /` - Liste favoris utilisateur (protégé)
- `GET /:id` - Détails favori (protégé)
- `POST /` - Ajouter favori (protégé)
- `DELETE /:id` - Supprimer favori (protégé)

## Sécurité

### Middleware d'Authentification
- **requireAuth** - Vérifie la présence et validité du token JWT
  - Extrait le token du header `Authorization: Bearer <token>`
  - Vérifie la signature avec `JWT_SECRET`
  - Attache `req.user` avec les données utilisateur
  
- **requireAdminOrOwnership** - Autorise admins ou propriétaire
  - Vérifie si l'utilisateur est admin (ID_Role = 3)
  - OU si l'utilisateur est le propriétaire de la ressource
  - Utilisé pour: modification/suppression utilisateurs
  
- **requireOwnership** - Autorise uniquement le propriétaire
  - Vérifie que l'utilisateur modifie sa propre ressource
  - Protection stricte pour certaines opérations

### Hashage des Mots de Passe
- **Bcrypt** avec salt rounds = 10
- Hashage lors de l'inscription et changement de mot de passe
- Vérification sécurisée lors de la connexion

### Tokens JWT
- **Access Token** - Durée courte (1 heures)
- **Refresh Token** - Durée longue (7 jours)
- Stockés dans localStorage côté client
- Refresh automatique géré par le frontend

### CORS
- Activé globalement dans `index.js`
- Permet les requêtes cross-origin
- Headers appropriés configurés

### Validation des Données
- Vérification d'unicité (email, username)
- Validation des IDs et références
- Sanitisation des inputs utilisateur

## Structure des Contrôleurs

### authController.js
- `register()` - Inscription avec hashage bcrypt
- `login()` - Connexion avec génération JWT
- `refresh()` - Rafraîchissement du token
- `logout()` - Déconnexion
- `getMe()` - Récupération profil utilisateur

### usersController.js
- `getAllUsers()` - Liste utilisateurs (admin)
- `getUserById()` - Détails utilisateur
- `createUser()` - Création utilisateur (admin)
- `updateUser()` - Modification utilisateur
  - Admins: peuvent modifier sans currentPassword
  - Utilisateurs: doivent fournir currentPassword
- `deleteUser()` - Suppression utilisateur

### toolsController.js
- `getAllTools()` - Liste outils avec jointures
- `getToolById()` - Détails outil complet
- `createTool()` - Création avec association utilisateur
- `updateTool()` - Modification avec gestion OS/plateformes
  - Admins: peuvent changer le propriétaire (New_ID_User)
  - Propriétaires: peuvent modifier leurs outils
- `deleteTool()` - Suppression (propriétaire ou admin)

### categorycontroller.js
- `getAllCategories()` - Liste catégories
- `createCategory()` - Création (admin)
- `updateCategory()` - Modification (admin)
- `deleteCategory()` - Suppression (admin)

### rolesController.js
- `getAllRoles()` - Liste rôles
- `updateRole()` - Modification rôle (admin)

### bookmarksController.js
- `getBookmarks()` - Favoris utilisateur
- `getBookmarkById()` - Détails favori
- `createBookmark()` - Ajout favori
- `deleteBookmark()` - Suppression favori

## Base de Données

### Configuration
- Fichier: `BackEnd/Config/database.js`
- Pool de connexions MySQL2
- Variables d'environnement pour credentials

### Tables Principales
- **users** - Utilisateurs (ID_User, Name, Email, Password, ID_Role)
- **tools** - Outils (ID_Tools, Name_Tools, Description_Tools, ID_User, ID_Category)
- **resources** - Ressources
- **category** - Catégories (ID_Category, Name_Category)
- **roles** - Rôles (ID_Role, Name_Role)
- **bookmarks** - Favoris utilisateur
- **platforms** - Plateformes
- **os** - Systèmes d'exploitation

### Relations Many-to-Many
- **run_on** - tools ↔ os
- **need_platform** - tools ↔ platforms

## Système de Rôles

1. **Visitor** (ID: 1) - Accès limité
2. **Member** (ID: 2) - Peut créer des outils
3. **Admin** (ID: 3) - Accès complet panel admin
4. **Moderator** (ID: 4) - Permissions intermédiaires

## Dépendances

```json
{
  "bcrypt": "^6.0.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.1",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "mysql2": "^3.14.3"
  
}
```

### Scripts NPM
```bash
npm start    # Démarrer le serveur
npm run dev  # Démarrer avec nodemon (auto-reload)
```

### Logs et Debugging
- Messages d'erreur détaillés
- Codes HTTP appropriés (200, 201, 400, 401, 403, 404, 500)

## Bonnes Pratiques

1. **Toujours valider les inputs** avant insertion en base
2. **Utiliser les middleware** pour la protection des routes
3. **Ne jamais exposer** les mots de passe ou JWT_SECRET
4. **Vérifier les permissions** côté serveur (ne pas se fier au frontend)
5. **Gérer les erreurs** avec try/catch et messages appropriés
6. **Utiliser les transactions** pour les opérations complexes
