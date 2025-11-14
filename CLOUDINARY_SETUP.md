# Configuration Cloudinary

## Étape 1 : Créer un compte Cloudinary

1. Allez sur https://cloudinary.com
2. Cliquez sur "Sign Up" (gratuit)
3. Créez votre compte

## Étape 2 : Récupérer vos identifiants

Une fois connecté, allez dans le **Dashboard** :
- **Cloud Name** : visible en haut à droite
- **API Key** : dans "Account Details"
- **API Secret** : dans "Account Details" (cliquez sur "Reveal")

## Étape 3 : Configurer les variables d'environnement

### Sur Render (Production)

1. Allez sur votre service Render
2. Section "Environment"
3. Ajoutez ces variables :

```
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

### En local (développement)

Créez un fichier `.env` à la racine du backend :

```env
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

## Avantages de Cloudinary

✅ **Gratuit** jusqu'à 25 GB de stockage et 25 GB de bande passante par mois
✅ **CDN intégré** : vos fichiers sont servis rapidement partout dans le monde
✅ **Transformations automatiques** : redimensionnement, compression, etc.
✅ **Persistant** : les fichiers ne sont jamais perdus
✅ **Compatible Render** : fonctionne parfaitement avec le plan gratuit

## Structure des dossiers Cloudinary

Les fichiers sont organisés ainsi :
- Photos : `gocast/photos/{talent_id}/`
- Vidéos : `gocast/videos/{talent_id}/`
- CVs : `gocast/cvs/{talent_id}/`

## Test

Après configuration, testez l'upload d'une photo. Elle devrait apparaître dans votre dashboard Cloudinary sous le dossier `gocast/photos/`.

