const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
     type: String, 
     required: true },
  myadmin: {
     type: String, 
     required: true },

  email: { 
    type: String, required: true, 
    unique: true },

  cinNumber: { 
    type: String, 
    unique: true },
  phoneNumber: { 
    type: String,  },
  password: { 
    type: String, 
    required: true },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'parent'],
    default: 'parent'
  },
  agencies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency'
    }
  ],

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ], // Liste des élèves associés au parent

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
