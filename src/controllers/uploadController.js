const multer = require('multer');
const path = require('path');
const Photo = require('../models/Photo');
const Talent = require('../models/Talent');

// Configuration du stockage en mémoire (pour base64)
const storage = multer.memoryStorage();

// Filtre des types de fichiers
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seules les images sont autorisées pour les photos'));
  } else if (file.fieldname === 'video') {
    const allowedTypes = /mp4|webm|ogg|mov/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seules les vidéos sont autorisées'));
  } else if (file.fieldname === 'cv_pdf') {
    const allowedTypes = /pdf/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seuls les fichiers PDF sont autorisés pour le CV'));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max (base64 prend plus de place)
  },
  fileFilter: fileFilter
});

// Convertir buffer en base64
const bufferToBase64 = (buffer, mimeType) => {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

// Upload de photos
const uploadPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { expression } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Convertir ArrayBuffer en Buffer si nécessaire
    const fileBuffer = req.file.buffer instanceof Buffer 
      ? req.file.buffer 
      : Buffer.from(req.file.buffer);

    // Vérifier la taille (max 10MB pour base64)
    if (fileBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 10MB)' });
    }

    // Convertir en base64
    const base64String = bufferToBase64(fileBuffer, req.file.mimetype);

    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `photo-${id}-${expression || 'default'}-${uniqueSuffix}${ext}`;

    // Enregistrer dans la base de données
    const photo = await Photo.create({
      talent_id: id,
      expression: expression || null,
      chemin: filename, // Garde pour compatibilité
      base64: base64String,
      mimeType: req.file.mimetype
    });

    res.status(201).json({
      message: 'Photo uploadée avec succès',
      photo: {
        id: photo._id,
        talent_id: id,
        expression: expression || null
      }
    });
  } catch (error) {
    console.error('Erreur upload photo:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la photo' });
  }
};

// Upload de vidéo de présentation
const uploadVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Convertir ArrayBuffer en Buffer si nécessaire
    const fileBuffer = req.file.buffer instanceof Buffer 
      ? req.file.buffer 
      : Buffer.from(req.file.buffer);

    // Vérifier la taille (max 10MB pour base64)
    if (fileBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 10MB)' });
    }

    // Convertir en base64
    const base64String = bufferToBase64(fileBuffer, req.file.mimetype);

    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `video-${id}-${uniqueSuffix}${ext}`;

    // Mettre à jour le talent
    const updatedTalent = await Talent.findByIdAndUpdate(
      id,
      {
        video_presentation: filename, // Garde pour compatibilité
        video_presentation_base64: base64String,
        video_presentation_mimeType: req.file.mimetype
      },
      { new: true }
    );

    if (!updatedTalent) {
      return res.status(404).json({ error: 'Talent non trouvé' });
    }

    res.json({
      message: 'Vidéo uploadée avec succès',
      video_path: filename
    });
  } catch (error) {
    console.error('Erreur upload video:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la vidéo' });
  }
};

// Upload de CV PDF
const uploadCV = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Convertir ArrayBuffer en Buffer si nécessaire
    const fileBuffer = req.file.buffer instanceof Buffer 
      ? req.file.buffer 
      : Buffer.from(req.file.buffer);

    // Vérifier la taille (max 10MB pour base64)
    if (fileBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 10MB)' });
    }

    // Convertir en base64
    const base64String = bufferToBase64(fileBuffer, req.file.mimetype);

    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `cv-${id}-${uniqueSuffix}${ext}`;

    // Mettre à jour le talent
    const updatedTalent = await Talent.findByIdAndUpdate(
      id,
      {
        cv_pdf: filename, // Garde pour compatibilité
        cv_pdf_base64: base64String,
        cv_pdf_mimeType: req.file.mimetype
      },
      { new: true }
    );

    if (!updatedTalent) {
      return res.status(404).json({ error: 'Talent non trouvé' });
    }

    res.json({
      message: 'CV PDF uploadé avec succès',
      cv_pdf: filename
    });
  } catch (error) {
    console.error('Erreur upload CV:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du CV' });
  }
};

// Supprimer une photo
const deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }

    // Supprimer de la base de données
    await Photo.findByIdAndDelete(photoId);

    res.json({ message: 'Photo supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression photo:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  upload,
  uploadPhoto,
  uploadVideo,
  uploadCV,
  deletePhoto
};
