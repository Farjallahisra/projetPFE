const express = require('express');
const { createMessage, getMessages, replyToMessage, markMessageAsRead } = require('../controllers/messageController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Créer un nouveau message (accessible à tous les utilisateurs authentifiés)
router.post('/', protect, createMessage);

// Récupérer tous les messages (parents voient leurs messages + réponses, admins voient tout)
router.get('/', protect, getMessages);

// Répondre à un message (seuls les admins)
router.post('/:id/reply', protect, isAdmin, replyToMessage);

// Marquer un message comme lu (expéditeur ou admin)
router.put('/:id/read', protect, markMessageAsRead);

module.exports = router;