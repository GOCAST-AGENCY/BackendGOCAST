const express = require('express');
const router = express.Router();
const gridfsService = require('../services/gridfsService');
const Photo = require('../models/Photo');
const Talent = require('../models/Talent');

// Servir un fichier depuis GridFS par ID
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    gridfsService.streamFile(fileId, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du fichier' });
  }
});

// Route pour obtenir l'ID GridFS d'une photo
router.get('/photo/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    
    if (!photo.gridfs_id) {
      return res.status(404).json({ error: 'Fichier non trouvé dans GridFS' });
    }
    
    gridfsService.streamFile(photo.gridfs_id, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la photo' });
  }
});

// Route pour obtenir le CV PDF d'un talent
router.get('/talent/:talentId/cv', async (req, res) => {
  try {
    const { talentId } = req.params;
    const talent = await Talent.findById(talentId);
    
    if (!talent || !talent.cv_pdf_gridfs_id) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }
    
    gridfsService.streamFile(talent.cv_pdf_gridfs_id, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du CV' });
  }
});

// Route pour obtenir la vidéo d'un talent
router.get('/talent/:talentId/video', async (req, res) => {
  try {
    const { talentId } = req.params;
    const talent = await Talent.findById(talentId);
    
    if (!talent || !talent.video_presentation_gridfs_id) {
      return res.status(404).json({ error: 'Vidéo non trouvée' });
    }
    
    gridfsService.streamFile(talent.video_presentation_gridfs_id, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la vidéo' });
  }
});

module.exports = router;

