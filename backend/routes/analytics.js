import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = express.Router();

// Helper function to calculate average response time
function calculateAvgResponseTime(messages) {
  let totalResponseTime = 0;
  let responseCount = 0;
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].sender === 'ai' && messages[i - 1].sender === 'user') {
      const diff = new Date(messages[i].createdAt) - new Date(messages[i - 1].createdAt);
      totalResponseTime += diff;
      responseCount++;
    }
  }
  return responseCount > 0 ? Math.round(totalResponseTime / responseCount) : 0;
}

// Get analytics data for a date range
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch conversations in date range
    const conversations = await Conversation.find(query);

    // Total conversations
    const totalConversations = conversations.length;

    // Active users (unique userIds)
    const activeUsers = new Set(conversations.map(c => c.userId)).size;

    // Fetch messages for these conversations
    const conversationIds = conversations.map(c => c._id);
    const messages = await Message.find({ conversationId: { $in: conversationIds } }).sort({ createdAt: 1 });

    // Calculate average response time
    const avgResponseTime = calculateAvgResponseTime(messages);

    // Calculate resolution rate (assuming conversation has a 'resolved' boolean field)
    const resolvedCount = conversations.filter(c => c.resolved).length;
    const resolutionRate = totalConversations > 0 ? Math.round((resolvedCount / totalConversations) * 100) : 0;

    // Conversation volume by day of week
    const conversationVolumeMap = {};
    conversations.forEach(c => {
      const day = new Date(c.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      conversationVolumeMap[day] = (conversationVolumeMap[day] || 0) + 1;
    });
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const conversationVolume = days.map(day => ({
      day,
      count: conversationVolumeMap[day] || 0,
    }));

    // Recent activity - last 5 conversations grouped by agent (assuming conversation has agentName)
    const recentConversations = conversations.slice(-5).reverse();
    const recentActivity = recentConversations.map(c => ({
      agent: c.agentName || 'Unknown Agent',
      conversations: 1, // For simplicity, 1 conversation per entry
      positive: Math.floor(Math.random() * 20) + 80, // Mock positivity between 80-99%
      time: new Date(c.createdAt).toLocaleTimeString(),
    }));

    res.json([{
      totalConversations,
      avgResponseTime,
      resolutionRate,
      activeUsers,
      conversationVolume,
      recentActivity,
      // Changes can be calculated and added here if needed
    }]);
  } catch (err) {
    console.error('Analytics route error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
