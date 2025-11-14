# Stockage Base64 dans MongoDB

## Solution implémentée

Les fichiers (photos, vidéos, PDFs) sont maintenant convertis en **base64** (string) et stockés directement dans MongoDB.

## Avantages

✅ **Simple** : Pas besoin de service externe (Cloudinary, S3, etc.)
✅ **Gratuit** : Utilise uniquement MongoDB
✅ **Persistant** : Les fichiers sont dans la base de données
✅ **Compatible Render** : Fonctionne avec le plan gratuit

## Limitations

⚠️ **Taille maximale** : 10MB par fichier (limite MongoDB = 16MB, base64 prend ~33% plus de place)
⚠️ **Performance** : Plus lent que les solutions CDN
⚠️ **Bande passante** : Les fichiers base64 sont chargés à la demande (pas dans la liste)
⚠️ **Base de données** : Prend plus d'espace dans MongoDB

## Comment ça fonctionne

1. **Upload** : Le fichier est converti en base64 et stocké dans MongoDB
2. **Stockage** : 
   - Photos : `Photo.base64` et `Photo.mimeType`
   - Vidéos : `Talent.video_presentation_base64` et `Talent.video_presentation_mimeType`
   - PDFs : `Talent.cv_pdf_base64` et `Talent.cv_pdf_mimeType`
3. **Affichage** : Les fichiers sont chargés à la demande via `/api/files/photo/:id`, `/api/files/talent/:id/video`, etc.

## Routes API

- `GET /api/files/photo/:photoId` - Récupère une photo en base64
- `GET /api/files/talent/:talentId/video` - Récupère une vidéo en base64
- `GET /api/files/talent/:talentId/cv` - Récupère un CV en base64

## Optimisations

- Les base64 ne sont **pas** inclus dans les listes (économie de bande passante)
- Les fichiers sont chargés **à la demande** dans le frontend
- Cache côté frontend pour éviter les rechargements

## Comparaison avec Cloudinary

| Critère | Base64 MongoDB | Cloudinary |
|---------|---------------|------------|
| Coût | Gratuit | Gratuit (25GB) |
| Taille max | 10MB | Illimité |
| Performance | Moyenne | Excellente (CDN) |
| Complexité | Simple | Moyenne |
| Persistance | ✅ | ✅ |

## Recommandation

- **Petits fichiers (< 5MB)** : Base64 MongoDB est parfait
- **Fichiers volumineux** : Utilisez Cloudinary ou GridFS
- **Production à grande échelle** : Cloudinary est recommandé

