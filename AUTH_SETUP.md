# Configuration de l'Authentification ToolHub

## ✅ Système d'authentification configuré avec succès !

### 🔧 Configuration Backend

Le système utilise vos routes utilisateur existantes (`/api/users`) avec les nouvelles fonctionnalités d'authentification :

#### Routes disponibles :
- `POST /api/users/login` - Connexion utilisateur
- `POST /api/users/signup` - Inscription utilisateur  
- `POST /api/users/verify` - Vérification du token

#### Structure de la base de données utilisée :
Votre table `users` existante avec les colonnes :
- `ID_User` (clé primaire)
- `Name` (nom d'utilisateur)
- `Email` (email)
- `Password` (mot de passe hashé avec bcrypt)
- `Register_date` (date d'inscription)
- `ID_Role` (rôle utilisateur)

### 🎨 Configuration Frontend

#### Pages d'authentification :
- `login.html` - Page de connexion avec validation
- `signup.html` - Page d'inscription avec validation

#### Fonctionnalités implémentées :
- ✅ Validation des formulaires côté client
- ✅ Messages d'erreur et de succès
- ✅ Stockage sécurisé des tokens (localStorage)
- ✅ Gestion automatique de l'état de connexion
- ✅ Interface utilisateur adaptative

### 🚀 Comment tester

1. **Démarrer le serveur :**
   ```bash
   cd "d:\Site\Defi Web\Projet"
   node index.js
   ```

2. **Accéder à l'application :**
   - Ouvrir http://localhost:3001
   - Cliquer sur "Login" ou "Sign Up"

3. **Comptes de test disponibles :**
   - **Admin :** `admin@toolhub.dev` / `AdminTopSecret12345678`
   - **Utilisateur :** `alice@example.com` / `AliceHashPass1234567890`
   - **Modérateur :** `mod@toolhub.dev` / `ModHashForModeration9999`

### 🔐 Variables d'environnement nécessaires

Créer un fichier `.env` dans `BackEnd/Config/` avec :
```env
# Base de données
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=votre_mot_de_passe
DB_NAME=toolhub

# JWT Secret (changez cette valeur !)
JWT_SECRET=votre_secret_jwt_super_securise

# Port du serveur
PORT=3001
```

### 📋 Fonctionnalités implémentées

#### Connexion (Login) :
- Validation des champs requis
- Authentification par nom d'utilisateur OU email
- Génération de tokens JWT (access + refresh)
- Redirection automatique après connexion
- Messages d'erreur informatifs

#### Inscription (Signup) :
- Validation complète des données
- Vérification de la correspondance des mots de passe
- Vérification de l'unicité email/username
- Création automatique du compte avec rôle par défaut
- Connexion automatique après inscription

#### Gestion de session :
- Stockage sécurisé des tokens
- Vérification automatique de l'authentification
- Interface utilisateur adaptative (boutons Login/Logout)
- Déconnexion propre

### 🛠️ Personnalisation

#### Modifier les rôles utilisateur :
Dans `usersController.js`, ligne 189 :
```javascript
const roleId = 1; // Changez la valeur par défaut
```

#### Modifier la durée des tokens :
Dans `usersController.js`, lignes 5-6 :
```javascript
const ACCESS_EXP = '15m';  // Token d'accès
const REFRESH_EXP = '7d';  // Token de rafraîchissement
```

#### Personnaliser les messages :
Modifiez les messages dans `logininner.js` et `signupinner.js`

### 🐛 Dépannage

#### Erreur de connexion à la base de données :
- Vérifiez les variables d'environnement dans `.env`
- Assurez-vous que MySQL est démarré
- Vérifiez les permissions de la base de données

#### Erreur "Network error" :
- Vérifiez que le serveur est démarré sur le bon port
- Contrôlez la configuration CORS

#### Tokens invalides :
- Vérifiez la variable `JWT_SECRET` dans `.env`
- Effacez le localStorage du navigateur pour reset

### 📞 Support

Le système d'authentification est maintenant pleinement fonctionnel et intégré à votre application ToolHub !

Pour toute question ou personnalisation supplémentaire, n'hésitez pas à demander.
