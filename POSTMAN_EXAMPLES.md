# Exemples de requêtes Postman pour GoCast API

## ⚠️ IMPORTANT - Avant de commencer

**Assurez-vous que :**
1. Le backend est démarré sur le port **3000** (`npm run dev` dans BackendGOCAST)
2. MongoDB est démarré et accessible
3. Vous utilisez l'URL : `http://localhost:3000/api/...` (pas 3001)

**Test rapide :**
```
GET http://localhost:3000/health
```
Si vous recevez du JSON avec `"status": "OK"`, le backend fonctionne ! ✅

---

## 🔐 1. Connexion (obtenir le token)

**Méthode:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`  
**Headers:** 
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Réponse attendue:**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin"
  }
}
```

**⚠️ Important:** Copiez le `token` de la réponse pour l'utiliser dans les requêtes suivantes.

---

## 👤 2. Créer un Talent (Acteur)

**Méthode:** `POST`  
**URL:** `http://localhost:3000/api/talents`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Body (raw JSON) - Exemple complet:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "telephone": "+33 6 12 34 56 78",
  "date_naissance": "1990-05-15",
  "genre": "Homme",
  "specialite": "Acteur",
  "type_acting": "Drame",
  "cv_texte": "Acteur expérimenté avec 10 ans d'expérience au théâtre et au cinéma. Formation au Conservatoire de Paris.",
  "statut": "Actif",
  "note_interne": "Excellent pour les rôles dramatiques",
  "commentaire": "Disponible pour tournages à partir de mars 2024"
}
```

**Body (raw JSON) - Exemple minimal (champs requis uniquement):**
```json
{
  "nom": "Martin",
  "prenom": "Sophie",
  "date_naissance": "1995-08-20",
  "specialite": "Acteur"
}
```

**Réponse attendue:**
```json
{
  "message": "Talent créé avec succès",
  "id": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

---

## 👤 3. Créer un Talent (Mannequin)

**Méthode:** `POST`  
**URL:** `http://localhost:3000/api/talents`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Body (raw JSON):**
```json
{
  "nom": "Bernard",
  "prenom": "Marie",
  "email": "marie.bernard@example.com",
  "telephone": "+33 6 98 76 54 32",
  "date_naissance": "1998-03-10",
  "genre": "Femme",
  "specialite": "Mannequin",
  "type_acting": null,
  "cv_texte": "Mannequin professionnel, taille 1m75, expérience dans la mode et la publicité.",
  "statut": "Actif",
  "note_interne": "Très photogénique",
  "commentaire": "Spécialisée en mode haute couture"
}
```

---

## 🎙️ 4. Créer un Talent (Voix off)

**Méthode:** `POST`  
**URL:** `http://localhost:3000/api/talents`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Body (raw JSON):**
```json
{
  "nom": "Lefebvre",
  "prenom": "Pierre",
  "email": "pierre.lefebvre@example.com",
  "telephone": "+33 6 11 22 33 44",
  "date_naissance": "1985-11-25",
  "genre": "Homme",
  "specialite": "Voix off",
  "type_acting": null,
  "cv_texte": "Comédien voix off professionnel, voix grave et chaleureuse. Expérience en doublage, publicité et narration.",
  "statut": "Actif",
  "note_interne": "Voix très polyvalente",
  "commentaire": "Studio d'enregistrement personnel disponible"
}
```

---

## 📋 5. Créer un Talent (Enfant)

**Méthode:** `POST`  
**URL:** `http://localhost:3000/api/talents`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Body (raw JSON):**
```json
{
  "nom": "Petit",
  "prenom": "Lucas",
  "email": "lucas.petit@example.com",
  "telephone": "+33 6 55 66 77 88",
  "date_naissance": "2015-07-12",
  "genre": "Homme",
  "specialite": "Acteur",
  "type_acting": "Comédie",
  "cv_texte": "Jeune acteur débutant, très à l'aise devant la caméra.",
  "statut": "Actif",
  "note_interne": "Très naturel, bon potentiel",
  "commentaire": "Autorisation parentale nécessaire"
}
```

---

## 📋 6. Créer un Talent (Senior)

**Méthode:** `POST`  
**URL:** `http://localhost:3000/api/talents`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Body (raw JSON):**
```json
{
  "nom": "Moreau",
  "prenom": "Claude",
  "email": "claude.moreau@example.com",
  "telephone": "+33 6 99 88 77 66",
  "date_naissance": "1950-02-28",
  "genre": "Homme",
  "specialite": "Acteur",
  "type_acting": "Drame",
  "cv_texte": "Acteur de théâtre et cinéma avec 40 ans d'expérience. Spécialisé dans les rôles de caractère.",
  "statut": "Actif",
  "note_interne": "Très expérimenté, présence scénique remarquable",
  "commentaire": "Disponible pour projets cinéma et théâtre"
}
```

---

## 📝 Notes importantes

### Champs requis:
- `nom` (string)
- `prenom` (string)
- `date_naissance` (string, format: YYYY-MM-DD)
- `specialite` (string: "Acteur", "Mannequin", ou "Voix off")

### Champs optionnels:
- `email` (string)
- `telephone` (string)
- `genre` (string: "Homme", "Femme", ou "Autre")
- `type_acting` (string: "Comédie", "Drame", "Burlesque", "Action", "Romance", etc.)
- `cv_texte` (string)
- `statut` (string: "Actif" ou "En pause", défaut: "Actif")
- `note_interne` (string)
- `commentaire` (string)

### Calcul automatique:
- `tranche_age` est calculé automatiquement selon la date de naissance:
  - **Enfant**: < 12 ans
  - **Ado**: 12-17 ans
  - **Adulte**: 18-64 ans
  - **Senior**: ≥ 65 ans

### Format de date:
Utilisez le format ISO: `YYYY-MM-DD` (ex: `1990-05-15`)

---

## 🔍 Autres requêtes utiles

### Obtenir tous les talents
**Méthode:** `GET`  
**URL:** `http://localhost:3000/api/talents`  
**Headers:** Aucun (route publique)

### Obtenir un talent par ID
**Méthode:** `GET`  
**URL:** `http://localhost:3000/api/talents/ID_DU_TALENT`  
**Headers:** Aucun (route publique)

### Mettre à jour un talent
**Méthode:** `PUT`  
**URL:** `http://localhost:3000/api/talents/ID_DU_TALENT`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

### Supprimer un talent
**Méthode:** `DELETE`  
**URL:** `http://localhost:3000/api/talents/ID_DU_TALENT`  
**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ICI
```

