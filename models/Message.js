const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true, // Format: "Parent:<email>" ou "Admin"
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null, // Null pour les messages originaux, ID pour les réponses
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);