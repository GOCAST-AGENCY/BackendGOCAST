const mongoose = require('mongoose');

const talentSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  telephone: {
    type: String,
    trim: true
  },
  date_naissance: {
    type: Date,
    required: true
  },
  genre: {
    type: String,
    enum: ['Homme', 'Femme', 'Autre'],
    default: null
  },
  specialite: {
    type: String,
    enum: ['Acteur', 'Mannequin', 'Voix off'],
    required: true
  },
  type_acting: {
    type: String,
    trim: true
  },
  tranche_age: {
    type: String,
    enum: ['Enfant', 'Ado', 'Adulte', 'Senior'],
    default: null
  },
  cv_texte: {
    type: String
  },
  cv_pdf: {
    type: String
  },
  video_presentation: {
    type: String
  },
  statut: {
    type: String,
    enum: ['Actif', 'En pause'],
    default: 'Actif'
  },
  note_interne: {
    type: String
  },
  commentaire: {
    type: String
  }
}, {
  timestamps: true
});

// Index pour la recherche
talentSchema.index({ nom: 1, prenom: 1 });
talentSchema.index({ email: 1 });
talentSchema.index({ specialite: 1 });
talentSchema.index({ genre: 1 });
talentSchema.index({ tranche_age: 1 });
talentSchema.index({ statut: 1 });

module.exports = mongoose.model('Talent', talentSchema);

