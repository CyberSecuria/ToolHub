# Configuration de l'Authentification ToolHub

## ✅ État actuel

- Backend Express avec routes auth montées sur `/api/auth`
- Gestion des utilisateurs complémentaire sur `/api/users`
- Frontend utilise `AuthManager` (`FrontEnd/Scripts/utils/auth.js`) pour gérer tokens et UI

## 🔧 Routes Backend

- `/api/auth`
  - `POST /register` — Inscription
  - `POST /login` — Connexion
  - `POST /refresh` — Rafraîchir le token d'accès
  - `POST /logout` — Déconnexion
  - `GET /me` — Profil du token (protégé)
- `/api/users`
  - `POST /login`, `POST /signup`, `POST /verify`
  - `GET /`, `GET /:id`, `POST /create`, `PATCH /:id`, `DELETE /:id`

Note: Les routes `/api/users/:id` en `PATCH/DELETE` sont protégées par `requireAuth` + `requireOwnership`.

## 🔐 Variables d'environnement

Fichier `BackEnd/Config/.env`:
```env
PORT=3001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_NAME=toolhub
JWT_SECRET=replace_me
```

## 🎛 Frontend: AuthManager

Emplacement: `FrontEnd/Scripts/utils/auth.js`

- `isAuthenticated()` — indique l'état de connexion
- `getAuthHeader()` — retourne `Bearer <token>` si disponible
- `setAuth(data)` — enregistre `accessToken`, `refreshToken`, `user`
- `logout()` / `handleLogout()` — nettoie les données et met à jour l'UI
- `verifyToken()` — appelle `/api/auth/me` et tente un refresh via `/api/auth/refresh`
- `updateUI()` — adapte les boutons Login/Sign Up ↔ Hello/Logout

Intégrations UI:
- Le bouton `Add Tool` (homepage) n'est visible que si l'utilisateur est connecté.
- Redirection vers `profile.html` via le menu utilisateur.

## ▶️ Démarrage & Test

1. Démarrer le serveur:
```bash
node index.js
```
2. Ouvrir `http://localhost:3001`
3. Tester:
   - Inscription / connexion via `login.html` / `signup.html`
   - Vérifier `/api/auth/me` (dans le réseau du navigateur)
   - Déconnexion et suppression du stockage local si besoin

## 🧩 Personnalisation

- Durée des tokens: ajuster dans le contrôleur (backend) selon vos besoins
- Rôles par défaut: adapter dans les contrôleurs utilisateurs
- Messages UI: modifier dans `logininner.js` / `signupinner.js`

## 🐛 Dépannage rapide

- 401 sur `/api/auth/me`:
  - Vérifier `Authorization: Bearer <token>`
  - Tenter le refresh via `/api/auth/refresh`
  - Vérifier `JWT_SECRET`
- Erreurs CORS: s'assurer que `cors()` est bien appliqué dans `index.js`
- Problèmes de session: nettoyer `localStorage` (tokens, user)
