const express = require('express');
const router = express.Router();
const {
  getAllTalents,
  getTalentById,
  createTalent,
  updateTalent,
  deleteTalent
} = require('../controllers/talentController');
const {
  upload,
  uploadPhoto,
  uploadVideo,
  uploadCV,
  deletePhoto
} = require('../controllers/uploadController');
const { authenticateToken } = require('../middleware/auth');

// Routes publiques (pour l'accueil)
router.get('/', getAllTalents);
router.get('/:id', getTalentById);

// Routes protégées
router.post('/', createTalent);
router.put('/:id', authenticateToken, updateTalent);
router.delete('/:id', authenticateToken, deleteTalent);

// Upload de fichiers
router.post('/:id/photos', authenticateToken, upload.single('photo'), uploadPhoto);
router.post('/:id/video', authenticateToken, upload.single('video'), uploadVideo);
router.post('/:id/cv', authenticateToken, upload.single('cv_pdf'), uploadCV);
router.delete('/photos/:photoId', authenticateToken, deletePhoto);

module.exports = router;

