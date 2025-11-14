const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const Talent = require('../models/Talent');

// Route pour obtenir une photo en base64
router.get('/photo/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    
    if (!photo.base64) {
      return res.status(404).json({ error: 'Photo non disponible' });
    }
    
    // Retourner directement le base64
    res.json({
      base64: photo.base64,
      mimeType: photo.mimeType || 'image/jpeg'
    });
  } catch (error) {
    console.error('Erreur récupération photo:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la photo' });
  }
});

// Route pour obtenir le CV PDF d'un talent
router.get('/talent/:talentId/cv', async (req, res) => {
  try {
    const { talentId } = req.params;
    const talent = await Talent.findById(talentId);
    
    if (!talent || !talent.cv_pdf_base64) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }
    
    // Retourner directement le base64
    res.json({
      base64: talent.cv_pdf_base64,
      mimeType: talent.cv_pdf_mimeType || 'application/pdf'
    });
  } catch (error) {
    console.error('Erreur récupération CV:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du CV' });
  }
});

// Route pour obtenir la vidéo d'un talent
router.get('/talent/:talentId/video', async (req, res) => {
  try {
    const { talentId } = req.params;
    const talent = await Talent.findById(talentId);
    
    if (!talent || !talent.video_presentation_base64) {
      return res.status(404).json({ error: 'Vidéo non trouvée' });
    }
    
    // Retourner directement le base64
    res.json({
      base64: talent.video_presentation_base64,
      mimeType: talent.video_presentation_mimeType || 'video/mp4'
    });
  } catch (error) {
    console.error('Erreur récupération vidéo:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la vidéo' });
  }
});

module.exports = router;
