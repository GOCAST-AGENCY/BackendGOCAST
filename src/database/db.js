const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs-extra');
const { config } = require('../config');

const uploadsDir = path.join(__dirname, '../../uploads');

// Créer les dossiers nécessaires
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(path.join(uploadsDir, 'photos'));
fs.ensureDirSync(path.join(uploadsDir, 'videos'));
fs.ensureDirSync(path.join(uploadsDir, 'cvs'));

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.database.url);
    console.log('✅ Connexion à MongoDB établie');
    
    // Initialiser GridFS après la connexion
    const gridfsService = require('../services/gridfsService');
    gridfsService.initGridFS();
    
    // Créer l'admin par défaut si nécessaire
    await createDefaultAdmin();
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    console.error('💡 Vérifiez que:');
    console.error('   1. MongoDB Atlas est accessible');
    console.error('   2. L\'IP de Render est dans la whitelist MongoDB Atlas');
    console.error('   3. Les identifiants MongoDB sont corrects dans les variables d\'environnement');
    console.error('   4. Le serveur continuera à fonctionner mais les requêtes DB échoueront');
    // Ne pas faire crasher le serveur, mais loguer l'erreur
    // Le serveur pourra répondre aux requêtes mais les appels DB échoueront
  }
};

// Créer un admin par défaut
const createDefaultAdmin = async () => {
  const Admin = require('../models/Admin');
  const bcrypt = require('bcryptjs');
  
  const adminExists = await Admin.findOne({ username: 'admin' });
  
  if (!adminExists) {
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    await Admin.create({
      username: 'admin',
      password: defaultPassword
    });
    console.log('✅ Admin par défaut créé (username: admin, password: admin123)');
  }
};

// Fonction pour calculer la tranche d'âge
function calculerTrancheAge(dateNaissance) {
  const today = new Date();
  const birthDate = new Date(dateNaissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 12) return 'Enfant';
  if (age < 18) return 'Ado';
  if (age < 65) return 'Adulte';
  return 'Senior';
}

module.exports = { connectDB, calculerTrancheAge };
