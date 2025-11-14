# Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/GoCast

# JWT Secret (générez une clé sécurisée en production)
JWT_SECRET=gocast-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

## Instructions

1. Copiez le contenu ci-dessus dans un nouveau fichier nommé `.env`
2. Remplacez les valeurs par vos propres configurations
3. Ne commitez jamais le fichier `.env` dans le repository (il est déjà dans `.gitignore`)

## Configuration MongoDB

Par défaut, l'application se connecte à MongoDB sur `mongodb://localhost:27017/GoCast`.

Si votre MongoDB est configuré différemment, modifiez la variable `MONGODB_URI` dans le fichier `.env`.

### Exemples de connexion MongoDB :

- Local par défaut : `mongodb://localhost:27017/GoCast`
- Avec authentification : `mongodb://username:password@localhost:27017/GoCast`
- Avec options : `mongodb://localhost:27017/GoCast?authSource=admin`
