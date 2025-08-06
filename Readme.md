# ToolHub

ToolHub est une plateforme web moderne pour découvrir, filtrer, sauvegarder et gérer des outils numériques (SaaS, logiciels, ressources, etc.) avec une interface responsive et accessible.

## Fonctionnalités principales

- Découverte d’outils via une page d’accueil dynamique (cartes, filtres, recherche)
- Système de favoris (bookmark)
- Filtres avancés (catégorie, plateforme, OS, notation)
- Authentification (login/signup)
- Toolbox personnalisée pour chaque utilisateur
- Responsive design (mobile/desktop)
- Interface claire et moderne (CSS custom, variables, glassmorphism)

## Structure du projet

```
/
├── index.html
├── login.html
├── signup.html
├── ressource.html
├── toolbox.html
├── CSS/
│   ├── index.css
│   ├── login.css
│   ├── signup.css
│   ├── ressource.css
│   └── toolbox.css
├── Scripts/
│   ├── index.js
│   ├── login.js
│   ├── signup.js
│   ├── ressource.js
│   ├── tools.js
│   ├── Tools/
│   │   ├── generateCard.js
│   │   └── burgerMenu.js
│   └── controler/
│       ├── filtercontroler.js
│       ├── bookmark-controler.js
│       ├── homepagecontroler.js
│       └── headercontroler.js
├── Data/
│   ├── carditem.js
│   └── resourcesData.js
├── Assets/
│   └── ... (icônes, images)
└── Readme.md
```

## Installation & Lancement

1. **Cloner le repo**
2. Ouvrir le dossier dans VS Code ou un éditeur moderne
3. Ouvrir `index.html` dans un navigateur pour tester le frontend

## Technologies utilisées

- HTML5, CSS3 (variables, responsive, glassmorphism)
- JavaScript (ES6 modules)
- Aucune dépendance externe pour le frontend

## Prochaines étapes (Backend)

- API REST (Node.js/Express ou autre)
- Base de données (MongoDB, PostgreSQL, etc.)
- Authentification sécurisée (JWT, sessions)
- Gestion des favoris utilisateurs
- Déploiement (Vercel, Netlify, Heroku…)

---

> Ce README sera complété au fur et à mesure de l’avancement du backend et des fonctionnalités.
