const axios = require('axios');
const Conversation = require('../models/conversation.model');
require('dotenv').config();

// @desc    Generate AI response using OpenRouter API
// @route   POST /api/ai/chat
// @access  Public
exports.generateResponse = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    
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
            content: '(if anythink follow this not a medical question say i only answer to medical questions)' +message
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
    
    // Save conversation if user is authenticated
    let savedConversationId = conversationId;
    
    try {
      // Check if user is authenticated
      if (req.user && req.user._id) {
        // User is authenticated, save to their conversation
        if (conversationId) {
          // Add to existing conversation
          const conversation = await Conversation.findById(conversationId);
          
          if (conversation && conversation.user.toString() === req.user._id.toString()) {
            // Add messages to conversation
            conversation.messages.push(
              { sender: 'user', content: message },
              { sender: 'ai', content: aiResponseText }
            );
            await conversation.save();
          } else {
            // Create new conversation if ID not found or doesn't belong to user
            const newConversation = new Conversation({
              user: req.user._id,
              title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
              messages: [
                { sender: 'user', content: message },
                { sender: 'ai', content: aiResponseText }
              ]
            });
            await newConversation.save();
            savedConversationId = newConversation._id;
          }
        } else {
          // Create new conversation
          const newConversation = new Conversation({
            user: req.user._id,
            title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
            messages: [
              { sender: 'user', content: message },
              { sender: 'ai', content: aiResponseText }
            ]
          });
          await newConversation.save();
          savedConversationId = newConversation._id;
        }
      }
    } catch (saveError) {
      console.error('Error saving conversation:', saveError);
    }
    
    return res.status(200).json({
      success: true,
      response: aiResponseText,
      conversationId: savedConversationId
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

// @desc    Get user conversations
// @route   GET /api/ai/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Conversation.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      count: conversations.length,
      total,
      data: conversations.map(conv => ({
        id: conv._id,
        title: conv.title,
        lastMessage: conv.messages.length > 0 ? 
          conv.messages[conv.messages.length - 1].content.substring(0, 50) + 
          (conv.messages[conv.messages.length - 1].content.length > 50 ? '...' : '') : '',
        messageCount: conv.messages.length,
        updatedAt: conv.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

// @desc    Get conversation by ID
// @route   GET /api/ai/conversations/:id
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    // Check if user owns this conversation
    if (conversation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: conversation._id,
        title: conversation.title,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation',
      error: error.message
    });
  }
};