# MarioFun72 V3

Un site web complet, intelligent et responsive développé en français, conçu pour offrir une expérience utilisateur moderne et interactive.

## 🚀 Technologies Utilisées

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Base de données**: Drizzle ORM avec Neon Database
- **Styling**: Tailwind CSS + Radix UI
- **Authentification**: Passport.js avec Google OAuth
- **État global**: TanStack Query
- **Animations**: Framer Motion + Lottie React

## 📦 Installation

1. Clonez le repository :
```bash
git clone https://github.com/buralux/mariofun72V3.git
cd mariofun72V3
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
# Créez un fichier .env à la racine du projet
# Ajoutez vos variables d'environnement nécessaires
```

4. Initialisez la base de données :
```bash
npm run db:push
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Lance l'application en mode production
- `npm run check` - Vérifie les types TypeScript
- `npm run db:push` - Pousse les changements de schéma vers la base de données

## 🏗️ Structure du Projet

```
├── client/          # Application React frontend
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── hooks/       # Hooks personnalisés
│   │   └── lib/         # Utilitaires et configurations
├── server/          # API Express backend
├── shared/          # Code partagé (schémas, types)
└── attached_assets/ # Ressources du projet
```

## 🌟 Fonctionnalités

- Interface utilisateur moderne et responsive
- Authentification sécurisée avec Google OAuth
- Gestion d'état optimisée avec TanStack Query
- Animations fluides et interactives
- Architecture full-stack TypeScript
- Base de données relationnelle avec Drizzle ORM

## 🚀 Déploiement

### Déploiement sur Vercel

1. **Connectez votre repository GitHub à Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Importez votre repository GitHub
   - Vercel détectera automatiquement la configuration

2. **Variables d'environnement** :
   Configurez les variables suivantes dans Vercel :
   ```
   DATABASE_URL=your_neon_database_url
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id (optionnel)
   GOOGLE_CLIENT_SECRET=your_google_client_secret (optionnel)
   ```

3. **Déploiement automatique** :
   - Chaque push sur la branche `main` déclenchera un déploiement automatique
   - Vercel utilisera le script `vercel-build` défini dans package.json

### Configuration post-déploiement

1. **Base de données** :
   - Configurez votre base de données Neon
   - Exécutez `npm run db:push` pour initialiser le schéma

2. **Domaine personnalisé** (optionnel) :
   - Configurez votre domaine dans les paramètres Vercel
   - Mettez à jour les URLs de callback OAuth si nécessaire

3. **Monitoring** :
   - Activez les analytics Vercel
   - Configurez les alertes de performance

### Déploiement local

1. **Build de production** :
```bash
npm run build
```

2. **Démarrage en production** :
```bash
npm start
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Buralux** - [GitHub](https://github.com/buralux)