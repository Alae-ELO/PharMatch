const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

const { generateResponse, getConversations, getConversation } = require('../controllers/ai.controller');

// AI chat endpoint - protected route for authenticated users
router.post('/chat', protect, generateResponse);

// Protected conversation routes
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversation);


module.exports = router;