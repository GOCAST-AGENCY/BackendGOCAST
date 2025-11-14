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
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Photo', photoSchema);

