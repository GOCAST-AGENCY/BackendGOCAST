# Backend GoCast Agency

Backend API pour l'application GoCast Agency développé avec Node.js et Express.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 18 ou supérieure)
- npm

### Installation

1. Installer les dépendances
```bash
npm install
```

2. Configurer les variables d'environnement (optionnel)
```bash
# Créer un fichier .env si nécessaire
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

3. Démarrer le serveur en mode développement
```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

## 📁 Structure du projet

```
BackendGOCAST/
├── src/
│   ├── config/          # Configuration de l'application
│   ├── controllers/     # Contrôleurs (auth, talents, upload)
│   ├── database/        # Configuration de la base de données SQLite
│   ├── middleware/      # Middlewares (authentification)
│   ├── routes/          # Définition des routes
│   └── server.js        # Point d'entrée principal
├── data/                # Base de données SQLite (généré)
├── uploads/             # Fichiers uploadés (photos/vidéos)
├── package.json
└── README.md
```

## 📝 Scripts disponibles

- `npm run dev` - Démarre le serveur en mode développement avec hot-reload (nodemon)
- `npm start` - Démarre le serveur en mode production
- `npm run lint` - Vérifie le code avec ESLint

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion administrateur
- `GET /api/auth/verify` - Vérifier le token (protégé)

### Talents
- `GET /api/talents` - Liste des talents (avec filtres)
- `GET /api/talents/:id` - Détails d'un talent
- `POST /api/talents` - Créer un talent (protégé)
- `PUT /api/talents/:id` - Mettre à jour un talent (protégé)
- `DELETE /api/talents/:id` - Supprimer un talent (protégé)

### Upload
- `POST /api/talents/:id/photos` - Uploader une photo (protégé)
- `POST /api/talents/:id/video` - Uploader une vidéo (protégé)
- `DELETE /api/talents/photos/:photoId` - Supprimer une photo (protégé)

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. 

**Admin par défaut:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important:** Changez le mot de passe par défaut en production !

## 💾 Base de données

Le projet utilise MongoDB pour stocker les données. Assurez-vous que MongoDB est installé et en cours d'exécution sur votre machine.

### Collections
- `admins` - Administrateurs
- `talents` - Profils de talents
- `photos` - Photos des talents

### Configuration MongoDB

Par défaut, l'application se connecte à `mongodb://localhost:27017/GoCast`.

Vous pouvez modifier l'URL de connexion via la variable d'environnement `MONGODB_URI` dans le fichier `.env`.

## 📤 Upload de fichiers

Les fichiers sont stockés dans le dossier `uploads/` :
- Photos: `uploads/photos/`
- Vidéos: `uploads/videos/`

Les fichiers sont servis statiquement via `/uploads/`.

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hashage des mots de passe
- **Multer** - Upload de fichiers
- **Helmet** - Sécurité HTTP
- **CORS** - Gestion des requêtes cross-origin
- **Morgan** - Logging des requêtes HTTP

## 📄 Licence

ISC
