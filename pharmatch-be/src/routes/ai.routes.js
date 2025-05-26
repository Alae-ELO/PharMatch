const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { generateResponse } = require('../controllers/ai.controller');

// AI chat endpoint
router.post('/chat', generateResponse);

module.exports = router;