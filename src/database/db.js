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
    
    // Créer l'admin par défaut si nécessaire
    await createDefaultAdmin();
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
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
