const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  talent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Talent',
    required: true
  },
  expression: {
    type: String,
    enum: ['Joie', 'Tristesse', 'Colère', 'Surprise', 'Neutre', null],
    default: null
  },
  chemin: {
    type: String,
    default: null
  },
  gridfs_id: {
    type: String,
    default: null
  },
  base64: {
    type: String,
    default: null
  },
  mimeType: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Photo', photoSchema);

