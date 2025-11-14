const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const Photo = require('../models/Photo');
const Talent = require('../models/Talent');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    let subDir = 'photos';
    
    if (file.fieldname === 'video') {
      subDir = 'videos';
    } else if (file.fieldname === 'cv_pdf') {
      subDir = 'cvs';
    }
    
    const dir = path.join(uploadsDir, subDir);
    fs.ensureDirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `talent-${req.params.id || 'new'}-${uniqueSuffix}${ext}`);
  }
});

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

    const relativePath = path.join('photos', req.file.filename);

    const photo = await Photo.create({
      talent_id: id,
      expression: expression || null,
      chemin: relativePath
    });

    res.status(201).json({
      message: 'Photo uploadée avec succès',
      photo: {
        id: photo._id,
        talent_id: id,
        expression: expression || null,
        chemin: relativePath
      }
    });
  } catch (error) {
    // Supprimer le fichier en cas d'erreur
    if (req.file) {
      fs.removeSync(req.file.path);
    }
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

    const relativePath = path.join('videos', req.file.filename);

    const talent = await Talent.findByIdAndUpdate(
      id,
      { video_presentation: relativePath },
      { new: true }
    );

    if (!talent) {
      fs.removeSync(req.file.path);
      return res.status(404).json({ error: 'Talent non trouvé' });
    }

    res.json({
      message: 'Vidéo uploadée avec succès',
      video_path: relativePath
    });
  } catch (error) {
    if (req.file) {
      fs.removeSync(req.file.path);
    }
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

    const relativePath = path.join('cvs', req.file.filename);

    // Supprimer l'ancien CV s'il existe
    const talent = await Talent.findById(id);
    if (talent && talent.cv_pdf) {
      const oldFilePath = path.join(__dirname, '../../uploads', talent.cv_pdf);
      if (fs.existsSync(oldFilePath)) {
        fs.removeSync(oldFilePath);
      }
    }

    // Mettre à jour le talent avec le nouveau CV
    const updatedTalent = await Talent.findByIdAndUpdate(
      id,
      { cv_pdf: relativePath },
      { new: true }
    );

    if (!updatedTalent) {
      fs.removeSync(req.file.path);
      return res.status(404).json({ error: 'Talent non trouvé' });
    }

    res.json({
      message: 'CV PDF uploadé avec succès',
      cv_pdf: relativePath
    });
  } catch (error) {
    if (req.file) {
      fs.removeSync(req.file.path);
    }
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

    // Supprimer le fichier
    const filePath = path.join(__dirname, '../../uploads', photo.chemin);
    fs.removeSync(filePath);

    // Supprimer de la base de données
    await Photo.findByIdAndDelete(photoId);

    res.json({ message: 'Photo supprimée avec succès' });
  } catch (error) {
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
