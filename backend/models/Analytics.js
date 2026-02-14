import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalConversations: { type: Number, default: 0 },
  avgResponseTime: { type: Number, default: 0 }, // in milliseconds
  resolutionRate: { type: Number, default: 0 }, // percentage
  activeUsers: { type: Number, default: 0 },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
