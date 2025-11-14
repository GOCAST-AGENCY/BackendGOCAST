# Guide de Test Postman - Résolution des Problèmes

## ⚠️ Problème : Vous recevez du HTML au lieu de JSON

Si vous recevez du HTML (comme une page Nuxt.js) au lieu d'une réponse JSON, cela signifie que :
1. Le backend GoCast n'est pas démarré
2. Vous utilisez la mauvaise URL dans Postman
3. Un autre service répond sur le port utilisé

## ✅ Solution : Vérifications étape par étape

### 1. Vérifier que le backend est démarré

**Terminal 1 - Backend:**
```bash
cd BackendGOCAST
npm run dev
```

Vous devriez voir :
```
✅ Connexion à MongoDB établie
✅ Admin par défaut créé (username: admin, password: admin123)
🚀 Serveur démarré sur le port 3000
📍 Environnement: development
🌐 URL: http://localhost:3000
```

### 2. Tester la route de santé (sans authentification)

**Méthode:** `GET`  
**URL:** `http://localhost:3000/health`  
**Headers:** Aucun

**Réponse attendue:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Si vous recevez cette réponse, le backend fonctionne correctement ! ✅

### 3. URLs correctes à utiliser dans Postman

**⚠️ IMPORTANT : Utilisez ces URLs exactes :**

- **Backend API:** `http://localhost:3000/api/...`
- **Health Check:** `http://localhost:3000/health`
- **NE PAS utiliser:** `http://localhost:3001/...` (c'est le frontend)

### 4. Test complet étape par étape

#### Étape 1 : Test de santé
```
GET http://localhost:3000/health
```
**Attendu:** JSON avec status "OK"

#### Étape 2 : Connexion
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

Body:
{
  "username": "admin",
  "password": "admin123"
}
```
**Attendu:** JSON avec un token

#### Étape 3 : Créer un talent
```
POST http://localhost:3000/api/talents
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI

Body:
{
  "nom": "Test",
  "prenom": "User",
  "date_naissance": "1990-01-01",
  "specialite": "Acteur"
}
```
**Attendu:** JSON avec message de succès et id

## 🔍 Dépannage

### Problème : "Cannot connect to server"
**Solution:** 
- Vérifiez que le backend est démarré
- Vérifiez que MongoDB est démarré
- Vérifiez le port 3000 n'est pas utilisé par un autre service

### Problème : "404 Not Found"
**Solution:**
- Vérifiez l'URL : doit commencer par `http://localhost:3000/api/`
- Vérifiez que les routes sont bien configurées

### Problème : "401 Unauthorized"
**Solution:**
- Vérifiez que vous avez inclus le header `Authorization: Bearer TOKEN`
- Vérifiez que le token est valide (pas expiré)
- Reconnectez-vous pour obtenir un nouveau token

### Problème : Vous recevez toujours du HTML
**Solution:**
1. Arrêtez tous les autres serveurs qui pourraient utiliser le port 3000
2. Vérifiez que vous utilisez bien `http://localhost:3000` (pas 3001)
3. Testez d'abord la route `/health` pour confirmer que le backend répond

## 📋 Checklist avant de tester

- [ ] Backend démarré sur le port 3000
- [ ] MongoDB démarré et connecté
- [ ] URL Postman : `http://localhost:3000/api/...`
- [ ] Headers corrects (Content-Type: application/json)
- [ ] Token valide pour les routes protégées

## 🧪 Test rapide dans le terminal

Vous pouvez aussi tester avec curl :

```bash
# Test de santé
curl http://localhost:3000/health

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Créer un talent (remplacez TOKEN par le token obtenu)
curl -X POST http://localhost:3000/api/talents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"nom":"Test","prenom":"User","date_naissance":"1990-01-01","specialite":"Acteur"}'
```

