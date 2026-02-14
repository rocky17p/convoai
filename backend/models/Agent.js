import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  role: { type: String, required: true, enum: ['sales', 'technical_support', 'general', 'billing', 'other'] }, // Task-specific roles
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  totalConversations: { type: Number, default: 0 },
  avgResponseTime: { type: Number, default: 0 }, // in milliseconds
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

agentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;
