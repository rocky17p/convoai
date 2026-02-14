import twilio from 'twilio';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const sambanovaApiKey = process.env.SAMBANOVA_API_KEY;
const sambanovaApiUrl = process.env.SAMBANOVA_API_URL;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

if (!sambanovaApiKey || !sambanovaApiUrl) {
  console.error(' SAMBANOVA_API_KEY or SAMBANOVA_API_URL not set.');
}

if (!twilioAccountSid || !twilioAuthToken) {
  console.error('TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set.');
}

const client = twilio(twilioAccountSid, twilioAuthToken);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleVoiceMessage = async (req, res) => {
  const { userId, text } = req.body;

  if (!userId || !text) {
    return res.status(400).json({ message: 'Missing required fields: userId, text' });
  }

  try {
    // Create or find a voice conversation for the user
    let conversation = await Conversation.findOne({ userId, type: 'voice' }).sort({ createdAt: -1 });
    if (!conversation) {
      conversation = new Conversation({ userId, title: 'Voice Chat', type: 'voice' });
      await conversation.save();
    }

    // Save the incoming user message to DB
    const userMessage = new Message({ conversationId: conversation._id, sender: 'user', text });
    await userMessage.save();

    // Retrieve conversation history
    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    const chatHistory = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    const systemPrompt = {
      role: 'system',
      content: 'You are a helpful AI assistant specialized in sales and customer support for ConvoAI platform. Help users with product inquiries, provide information about features, assist with onboarding, troubleshoot issues, and guide them through sales processes. Be professional, friendly, and knowledgeable.'
    };
    const fullMessages = [systemPrompt, ...chatHistory];

    const maxRetries = 5;
    let attempt = 0;
    let backoff = 1000;

    while (attempt < maxRetries) {
      try {
        const response = await fetch(sambanovaApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sambanovaApiKey}`,
          },
          body: JSON.stringify({
            model: 'DeepSeek-V3-0324',
            messages: fullMessages,
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`SambaNova API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const aiText = data?.choices?.[0]?.message?.content?.trim();
        if (!aiText) {
          throw new Error('Unexpected response format: missing message content.');
        }

        const aiMessage = new Message({
          conversationId: conversation._id,
          sender: 'ai',
          text: aiText,
        });
        await aiMessage.save();

        return res.json({ text: aiText });

      } catch (error) {
        console.error('Error:', error.message);
        if (error.message.includes('429')) {
          attempt++;
          await delay(backoff);
          backoff *= 2;
          continue;
        }
        return res.status(500).json({ message: 'Error processing voice message' });
      }
    }

    return res.status(503).json({ message: 'Service temporarily unavailable' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};