const express = require('express');
const { session} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes d'authentification
router.post('/', session);


module.exports = router;
