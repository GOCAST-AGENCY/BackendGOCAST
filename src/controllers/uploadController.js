const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const Photo = require('../models/Photo');
const Talent = require('../models/Talent');
const gridfsService = require('../services/gridfsService');

// Configuration du stockage en mémoire (pour GridFS)
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
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: fileFilter
});

// Upload de photos
const uploadPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { expression } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `photo-${id}-${uniqueSuffix}${ext}`;

    // Uploader dans GridFS
    // Convertir ArrayBuffer en Buffer si nécessaire
    const fileBuffer = req.file.buffer instanceof Buffer 
      ? req.file.buffer 
      : Buffer.from(req.file.buffer);
    
    const result = await gridfsService.uploadFile(
      fileBuffer,
      filename,
      {
        talent_id: id,
        expression: expression || null,
        contentType: req.file.mimetype,
        type: 'photo'
      }
    );

    // Enregistrer dans la base de données
    const photo = await Photo.create({
      talent_id: id,
      expression: expression || null,
      chemin: filename, // Garde pour compatibilité
      gridfs_id: result.fileId
    });

    res.status(201).json({
      message: 'Photo uploadée avec succès',
      photo: {
        id: photo._id,
        talent_id: id,
        expression: expression || null,
        gridfs_id: result.fileId
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

    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `video-${id}-${uniqueSuffix}${ext}`;

    // Supprimer l'ancienne vidéo si elle existe
    const talent = await Talent.findById(id);
    if (talent && talent.video_presentation_gridfs_id) {
      await gridfsService.deleteFile(talent.video_presentation_gridfs_id);
    }

    // Uploader dans GridFS
    // Convertir ArrayBuffer en Buffer si nécessaire
    const fileBuffer = req.file.buffer instanceof Buffer 
      ? req.file.buffer 
      : Buffer.from(req.file.buffer);
    
    const result = await gridfsService.uploadFile(
      fileBuffer,
      filename,
      {
        talent_id: id,
        contentType: req.file.mimetype,
        type: 'video'
      }
    );

    // Mettre à jour le talent
    const updatedTalent = await Talent.findByIdAndUpdate(
      id,
      {
        video_presentation: filename, // Garde pour compatibilité
        video_presentation_gridfs_id: result.fileId
      },
      { new: true }
    );

    if (!updatedTalent) {
      await gridfsService.deleteFile(result.fileId);
      return res.status(404).json({ error: 'Talent non trouvé' });
    }

    res.json({
      message: 'Vidéo uploadée avec succès',
      video_path: filename,
      gridfs_id: result.fileId
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

    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `cv-${id}-${uniqueSuffix}${ext}`;

    // Supprimer l'ancien CV s'il existe
    const talent = await Talent.findById(id);
    if (talent && talent.cv_pdf_gridfs_id) {
      await gridfsService.deleteFile(talent.cv_pdf_gridfs_id);
    }

    // Uploader dans GridFS
    // Convertir ArrayBuffer en Buffer si nécessaire
    const fileBuffer = req.file.buffer instanceof Buffer 
      ? req.file.buffer 
      : Buffer.from(req.file.buffer);
    
    const result = await gridfsService.uploadFile(
      fileBuffer,
      filename,
      {
        talent_id: id,
        contentType: req.file.mimetype,
        type: 'cv_pdf'
      }
    );

    // Mettre à jour le talent
    const updatedTalent = await Talent.findByIdAndUpdate(
      id,
      {
        cv_pdf: filename, // Garde pour compatibilité
        cv_pdf_gridfs_id: result.fileId
      },
      { new: true }
    );

    if (!updatedTalent) {
      await gridfsService.deleteFile(result.fileId);
      return res.status(404).json({ error: 'Talent non trouvé' });
    }

    res.json({
      message: 'CV PDF uploadé avec succès',
      cv_pdf: filename,
      gridfs_id: result.fileId
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

    // Supprimer de GridFS si gridfs_id existe
    if (photo.gridfs_id) {
      await gridfsService.deleteFile(photo.gridfs_id);
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
