const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  badgeId: { type: String, required: true, unique: true },
  cinParent: {
    type: String,
    required: true,
    unique: true,
  },
  phoneParent: {
    type: String,
    required: true,
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, // Référence explicite au parent via son _id
  
  level: {
    type: String,
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);