import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Agent from '../models/Agent.js';
console.log('Loaded SambaNova Key (controller):', process.env.SAMBANOVA_API_KEY ? 'Found' : 'Missing');

const sambanovaApiKey = process.env.SAMBANOVA_API_KEY;
const sambanovaApiUrl = process.env.SAMBANOVA_API_URL;

if (!sambanovaApiKey || !sambanovaApiUrl) {
  console.error('SAMBANOVA_API_KEY or SAMBANOVA_API_URL not set. Exiting...');
  process.exit(1);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getSambanovaResponse = async (req, res) => {
  const { conversationId, sender, text } = req.body;

  if (!conversationId || !sender || !text) {
    return res.status(400).json({ message: 'Missing required fields: conversationId, sender, text' });
  }

  try {
    // Save the incoming user message to DB
    const userMessage = new Message({ conversationId, sender, text });
    await userMessage.save();

    // Only trigger AI if sender is "user"
    if (sender !== 'user') {
      return res.json(userMessage);
    }

    // Retrieve conversation and agent
    const conversation = await Conversation.findById(conversationId).populate('agentId');
    const agent = conversation?.agentId;

    // Retrieve conversation history
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    const chatHistory = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    // Customize system prompt based on agent
    let systemContent = 'You are a helpful AI assistant for ConvoAI platform.';
    if (agent) {
      systemContent = `You are ${agent.name}, a specialized AI assistant for ${agent.role.replace('_', ' ')} tasks. ${agent.description} Be professional, friendly, and knowledgeable.`;
    } else {
      systemContent = 'You are a helpful AI assistant specialized in sales and customer support for ConvoAI platform. Help users with product inquiries, provide information about features, assist with onboarding, troubleshoot issues, and guide them through sales processes. Be professional, friendly, and knowledgeable.';
    }

    const systemPrompt = {
      role: 'system',
      content: systemContent
    };
    const fullMessages = [systemPrompt, ...chatHistory];

    const maxRetries = 5;
    let attempt = 0;
    let backoff = 1000; // start with 1s

    while (attempt < maxRetries) {
      try {
        // Send to SambaNova API
        const response = await fetch(sambanovaApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sambanovaApiKey}`,
          },
          body: JSON.stringify({
            model: 'DeepSeek-V3-0324', // or another available model
            messages: fullMessages,
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`SambaNova API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('SambaNova response:', data);

        const aiText = data?.choices?.[0]?.message?.content?.trim();
        if (!aiText) {
          throw new Error('Unexpected response format: missing message content.');
        }

        // Save AI message
        const aiMessage = new Message({
          conversationId,
          sender: 'ai',
          text: aiText,
        });
        await aiMessage.save();

        return res.json(aiMessage);
      } catch (error) {
        console.error('Error communicating with SambaNova:', error.message);

        // Handle rate limits gracefully
        if (error.message.includes('429')) {
          attempt++;
          console.warn(`Retrying after ${backoff}ms (attempt ${attempt}/${maxRetries})`);
          await delay(backoff);
          backoff *= 2;
          continue;
        }

        // Other errors — abort and return fallback
        const fallback = new Message({
          conversationId,
          sender: 'ai',
          text: 'Sorry, I had trouble getting a response from the AI. Please try again later.',
        });
        await fallback.save();
        return res.status(500).json(fallback);
      }
    }

    return res.status(503).json({
      message: 'SambaNova API temporarily unavailable. Please try again later.',
    });
  } catch (err) {
    console.error('Server error in getSambanovaResponse:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};