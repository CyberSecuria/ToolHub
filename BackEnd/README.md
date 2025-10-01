# Backend ToolHub

Backend Node.js/Express exposant les API de l'application ToolHub.

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
```
Le frontend statique est servi depuis `FrontEnd/`.

## Montage des routes (index.js)

- `/api/tools` → `BackEnd/routes/toolsRoutes.js`
- `/api/users` → `BackEnd/routes/usersRoutes.js`
- `/api/bookmarks` → `BackEnd/routes/bookmarksRoutes.js`
- `/api/auth` → `BackEnd/routes/authRoutes.js`
- `/api/category` → `BackEnd/routes/categoryroutes.js`
- `/api/platforms` → `BackEnd/routes/platformsroutes.js`
- `/api/os` → `BackEnd/routes/osroutes.js`
- `/api/resources` → `BackEnd/routes/resourcesRoutes.js`

## Endpoints principaux

- Auth (`/api/auth`): `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`
- Users (`/api/users`): `POST /login`, `POST /signup`, `POST /verify`, `GET /`, `GET /:id`, `POST /create`, `PATCH /:id`, `DELETE /:id`
- Tools (`/api/tools`): `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`
- Resources (`/api/resources`): `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`
- Category (`/api/category`): `GET /`
- Platforms (`/api/platforms`): `GET /`
- OS (`/api/os`): `GET /`
- Bookmarks (`/api/bookmarks`): `GET /`, `GET /:id`, `POST /`, `DELETE /:id`

## Sécurité

- Middleware `requireAuth` et `requireOwnership` pour `PATCH/DELETE /api/users/:id`
- CORS activé globalement
- Tokens JWT requis pour routes protégées (cf. contrôleurs)

## Logs

- `BackEnd/src/logger.js` et dossier `BackEnd/logs/`

## À faire

- Brancher la base de données via `BackEnd/Config/database.js`
- Vérifier les contrôleurs et validations selon le schéma réel
