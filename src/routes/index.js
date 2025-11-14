const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const talentRoutes = require('./talents');

// Routes
router.use('/auth', authRoutes);
router.use('/talents', talentRoutes);

// Route API info
router.get('/api', (req, res) => {
  res.json({
    message: 'API GoCast',
    version: '1.0.0'
  });
});

module.exports = router;



