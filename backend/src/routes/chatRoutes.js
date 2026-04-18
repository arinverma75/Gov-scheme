import { Router } from 'express';
import { getChatResponse } from '../services/aiService.js';
import { ChatModel } from '../models/db.js';

const router = Router();

// POST /api/chat - Send message to AI chatbot
router.post('/', async (req, res) => {
  try {
    const { message, sessionId, language } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a message' 
      });
    }

    // Get or create chat session
    const chat = ChatModel.getOrCreateChat(sessionId);

    // Add user message
    ChatModel.addMessage(chat.id, {
      role: 'user',
      content: message
    });

    // Get AI response
    const { response, mode } = await getChatResponse(message, chat.messages.slice(-10));

    // Add assistant response
    ChatModel.addMessage(chat.id, {
      role: 'assistant',
      content: response
    });

    res.json({
      success: true,
      sessionId: chat.id,
      response,
      mode,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/chat/history - Get chat history
router.get('/history', (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.json({ success: true, messages: [] });
    }
    const chat = ChatModel.findById(sessionId);
    res.json({
      success: true,
      messages: chat ? chat.messages : []
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
