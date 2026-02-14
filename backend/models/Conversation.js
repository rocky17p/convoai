import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Chat' },
  type: { type: String, enum: ['chat', 'voice'], default: 'chat' },
  task: { type: String, enum: ['sales', 'technical_support', 'general', 'billing', 'other'], default: 'general' },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  createdAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;