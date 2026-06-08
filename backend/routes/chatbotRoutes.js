const express = require('express');
const router = express.Router();
const { handleChatbotRequest } = require('../controllers/chatbotController');

// Abierto, sin auth middleware para que cualquiera pueda preguntar
router.post('/ask', handleChatbotRequest);

module.exports = router;
