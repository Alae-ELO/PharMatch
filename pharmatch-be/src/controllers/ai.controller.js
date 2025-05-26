const axios = require('axios');
require('dotenv').config();

// @desc    Generate AI response using OpenRouter API
// @route   POST /api/ai/chat
// @access  Public
exports.generateResponse = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/devstral-small:free",
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || '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'}`,
          'HTTP-Referer': 'https://pharmatch.com',
          'X-Title': 'PharMatch Health Assistant'
        }
      }
    );
    
    // Extract the AI response from OpenRouter API response format
    let aiResponseText = '';
    if (response.data && 
        response.data.choices && 
        response.data.choices[0] && 
        response.data.choices[0].message && 
        response.data.choices[0].message.content) {
      aiResponseText = response.data.choices[0].message.content;
    } else {
      aiResponseText = "I'm sorry, I couldn't generate a response.";
    }
    
    return res.status(200).json({
      success: true,
      response: aiResponseText
    });
  } catch (error) {
    console.error('Error generating AI response:', error.response?.data || error.message);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to generate AI response',
      error: error.message 
    });
  }
};