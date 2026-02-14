import express from 'express';
import { getSambanovaResponse } from '../controllers/chatWithSambanova.js';
import { handleVoiceMessage } from '../controllers/voiceChat.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Agent from '../models/Agent.js';

const router = express.Router();

//Create a new conversation
router.post('/conversations', async (req, res) => {
  try {
    const { userId, title, type, task = 'general' } = req.body;

    if (!userId || !title || !type) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Find an active agent for the task
    const agent = await Agent.findOne({ role: task, status: 'active' });

    const conversation = new Conversation({
      userId,
      title,
      type,
      task,
      agentId: agent ? agent._id : null
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.error(' Error creating conversation:', error);
    res.status(500).json({ message: 'Server error while creating conversation.' });
  }
});

// Get all conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    const conversationsWithCount = await Promise.all(
      conversations.map(async (conv) => {
        const messageCount = await Message.countDocuments({ conversationId: conv._id });
        return { ...conv.toObject(), messageCount };
      })
    );
    res.json(conversationsWithCount);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error while fetching conversations.' });
  }
});

//Get all messages for a conversation
router.get('/messages/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages.' });
  }
});

//Handle user messages and AI responses via controller
router.post('/messages', getSambanovaResponse);

//Handle voice messages
router.post('/voice-message', handleVoiceMessage);

export default router;