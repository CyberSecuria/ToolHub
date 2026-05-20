# ToolHub - Identifiants Utilisateurs & Comptes de Test

## Comptes Utilisateurs de Test

Voici les comptes de test disponibles dans la base de données pour le développement et les tests.

### Comptes Administrateurs

**AdminMaster**
- Nom d'utilisateur: `AdminMaster`
- Mot de passe: `admin`
- Rôle: Admin (ID: 3)
- Accès: Accès complet au panel admin, peut gérer tous les utilisateurs et outils

**Max Control**
- Nom d'utilisateur: `Max Control`
- Mot de passe: `controlled`
- Rôle: Moderator (ID: 4)
- Accès: Modérateur

### Comptes Utilisateurs Réguliers

**Lina Bakri**
- Nom d'utilisateur: `Lina Bakri`
- Mot de passe: `BakriBananaSplit`
- Rôle: Member (ID: 2)
- Accès: Peut créer et gérer ses propres outils

**Charlie Nguyen**
- Nom d'utilisateur: `Charlie Nguyen`
- Mot de passe: `TotallyNotNguyen123`
- Rôle: Member (ID: 2)
- Accès: Peut créer et gérer ses propres outils

**Bob Martin**
- Nom d'utilisateur: `Bob Martin`
- Mot de passe: `BobLoves404Errors`
- Rôle: Member (ID: 2)
- Accès: Peut créer et gérer ses propres outils

**Alice Dupont**
- Nom d'utilisateur: `Alice Dupont`
- Mot de passe: `AliceBugHunter`
- Rôle: Member (ID: 2)
- Accès: Peut créer et gérer ses propres outils

### Comptes Invités/Visiteurs

**GuestBot**
- Nom d'utilisateur: `GuestBot`
- Mot de passe: `Human?IDK_lol`
- Rôle: Visitor (ID: 1)
- Accès: Limité, peut seulement consulter le contenu

### Comptes Supprimés/Inactifs

**Deleted_User**
- Nom d'utilisateur: `Deleted_User`
- Mot de passe: `junked`
- Rôle: Admin (ID: 3)
- Note: Compte de dump pour tester les suppressions

---

## Aperçu du Système de Rôles

### 1. Visitor (ID: 1)
**Permissions:**
- Consulter les outils et ressources
- Créer un compte
- Parcourir le contenu public

**Restrictions:**
- Ne peut pas créer d'outils
- Ne peut pas ajouter de favoris
- Ne peut pas accéder aux fonctionnalités de profil

### 2. Member (ID: 2)
**Permissions:**
- Toutes les permissions Visitor
- Créer des outils
- Modifier/supprimer ses propres outils
- Gérer les favoris (bookmarks)
- Modifier son propre profil
- Supprimer son compte
- Changer son mot de passe

**Restrictions:**
- Ne peut pas accéder au panel admin
- Ne peut pas modifier le contenu d'autres utilisateurs
- Ne peut pas changer la propriété des outils

### 3. Admin (ID: 3)
**Permissions:**
- Toutes les permissions Member
- Accès au panel d'administration (`/admin.html`)
- Gérer tous les outils (CRUD complet)
- Gérer tous les utilisateurs (CRUD complet)
- Changer la propriété des outils
- Modifier les rôles utilisateurs
- Gérer les catégories
- Changer le mot de passe de n'importe quel utilisateur sans connaître l'ancien
- Supprimer n'importe quel compte utilisateur

**Privilèges Spéciaux:**
- Contourner les vérifications de propriété
- Accéder aux routes protégées
- Modifier les paramètres système

### 4. Moderator (ID: 4)
**Permissions:**
- Similaire à Member
- Capacités de modération supplémentaires (à définir)

**Note:** Le rôle Moderator est actuellement défini mais les permissions spécifiques sont en attente d'implémentation.

---

## Guide de Connexion Rapide

### Pour Tester les Fonctionnalités Admin:
1. Aller sur `http://localhost:3001/login.html`
2. Se connecter avec:
   - Nom d'utilisateur: `AdminMaster`
   - Mot de passe: `admin`
3. Accéder au panel admin sur `http://localhost:3001/admin.html`

### Pour Tester les Fonctionnalités Utilisateur Régulier:
1. Aller sur `http://localhost:3001/login.html`
2. Se connecter avec n'importe quel compte Member (ex: Alice Dupont)
3. Tester la création d'outils, les favoris, l'édition de profil

### Pour Tester les Limitations Visiteur:
1. Se connecter avec le compte `GuestBot`
2. Vérifier l'accès limité (pas de création d'outils, pas de favoris)

---

## Création de Nouveaux Utilisateurs

### Via la Page d'Inscription
1. Naviguer vers `http://localhost:3001/signup.html`
2. Remplir nom d'utilisateur, email et mot de passe
3. Rôle par défaut assigné: **Visitor (ID: 1)**
4. Compte créé immédiatement

### Via le Panel Admin (Admin Uniquement)
1. Se connecter en tant qu'admin
2. Aller sur `http://localhost:3001/admin.html`
3. Cliquer sur l'onglet "Users"
4. Cliquer sur le bouton "Add User"
5. Remplir le formulaire et sélectionner le rôle désiré
6. L'admin peut assigner n'importe quel rôle: Visitor, Member, Admin ou Moderator

---

## Informations de Sécurité

### Sécurité des Mots de Passe
- Tous les mots de passe sont hashés avec **bcrypt**
- Les mots de passe affichés ici sont pour les tests uniquement
- **IMPORTANT:** Changer tous les mots de passe de test en production!

### Authentification
- **Tokens JWT** utilisés pour la gestion de session
- **Access token** expire après 1 heure
- **Refresh token** expire après 7 jours
- Tokens stockés dans le localStorage du navigateur

### Protection des Routes
- Routes sensibles protégées par middleware
- `requireAuth` - Vérifie le token JWT
- `requireAdminOrOwnership` - Admin ou propriétaire de la ressource uniquement
- Actions admin requièrent `ID_Role = 3`

---

## Structure de la Base de Données

### Table Users
```sql
CREATE TABLE users (
    ID_User INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_Role INT,
    FOREIGN KEY (ID_Role) REFERENCES roles(ID_Role)
);
```

### Table Roles
```sql
CREATE TABLE roles (
    ID_Role INT PRIMARY KEY,
    Name_Role VARCHAR(50) NOT NULL
);

INSERT INTO roles VALUES
(1, 'Visitor'),
(2, 'Member'),
(3, 'Admin'),
(4, 'Moderator');
```

---

## Dépannage

### Impossible de se Connecter
- Vérifier que le nom d'utilisateur et le mot de passe sont corrects
- Vérifier que l'utilisateur existe dans la base de données
- Nettoyer le localStorage du navigateur et réessayer
- Vérifier la console du navigateur pour les erreurs

### Impossible d'Accéder au Panel Admin
- S'assurer que l'utilisateur a `ID_Role = 3` dans la base de données
- Vérifier que vous êtes connecté
- Vérifier que le lien admin apparaît dans la navigation
- Nettoyer le localStorage et se reconnecter

### Problèmes de Mot de Passe
- **Utilisateurs:** Peuvent changer leur mot de passe via la page profil (mot de passe actuel requis)
- **Admins:** Peuvent changer le mot de passe de n'importe quel utilisateur via le panel admin (pas besoin du mot de passe actuel)
- Les mots de passe doivent faire au moins 6 caractères

### Changements de Rôle Non Reflétés
- Se déconnecter et se reconnecter après un changement de rôle
- Nettoyer le cache du navigateur et le localStorage
- Vérifier le changement de rôle dans la base de données
- Vérifier que le bon middleware est appliqué

---

## Liste de Vérification des Tests

### Authentification
- [ ] Inscription avec nouveau compte
- [ ] Connexion avec compte existant
- [ ] Fonctionnalité de déconnexion
- [ ] Rafraîchissement du token à l'expiration
- [ ] Accès aux routes protégées

### Rôles Utilisateurs
- [ ] Visitor peut seulement consulter le contenu
- [ ] Member peut créer des outils
- [ ] Admin peut accéder au panel admin
- [ ] Admin peut modifier tous les utilisateurs
- [ ] Visibilité de la navigation basée sur les rôles

### Panel Admin
- [ ] Gestion des outils (CRUD)
- [ ] Gestion des utilisateurs (CRUD)
- [ ] Gestion des catégories
- [ ] Attribution des rôles
- [ ] Transfert de propriété des outils

### Page Profil
- [ ] Modifier nom d'utilisateur et email
- [ ] Changer le mot de passe
- [ ] Supprimer le compte avec confirmation
- [ ] Affichage de l'avatar
- [ ] Notifications toast

---


**Serveur:** http://localhost:3001