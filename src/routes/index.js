const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const talentRoutes = require('./talents');
const fileRoutes = require('./files');

// Routes
router.use('/auth', authRoutes);
router.use('/talents', talentRoutes);
router.use('/files', fileRoutes);

// Route API info
router.get('/api', (req, res) => {
  res.json({
    message: 'API GoCast',
    version: '1.0.0'
  });
});

module.exports = router;



