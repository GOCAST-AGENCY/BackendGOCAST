const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const routes = require('./routes');
const { connectDB } = require('./database/db');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(helmet()); // Sécurité HTTP

// Configuration CORS - Autoriser le frontend Netlify et localhost
const allowedOrigins = [
  'https://gocast.netlify.app',
  'http://localhost:3001',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Pour le développement, autoriser toutes les origines
      // En production, décommentez la ligne suivante :
      // callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev')); // Logging des requêtes
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes API
app.use('/api', routes);

// Servir les fichiers uploadés (fallback pour compatibilité locale)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Le port ${PORT} est déjà utilisé.`);
    console.error(`💡 Arrêtez le processus qui utilise ce port ou changez le port dans .env`);
    process.exit(1);
  } else {
    console.error('❌ Erreur lors du démarrage du serveur:', err);
    process.exit(1);
  }
});

module.exports = app;

