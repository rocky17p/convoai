import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Analytics from '../models/Analytics.js';

dotenv.config();

const sampleAnalyticsData = [
  {
    date: new Date(),
    totalConversations: 5138,
    totalConversationsChange: 12.5,
    avgResponseTime: 685,
    avgResponseTimeChange: -8.2,
    resolutionRate: 94.3,
    resolutionRateChange: 5.1,
    activeUsers: 1247,
    activeUsersChange: 18.7,
    conversationVolume: [
      { day: 'Mon', count: 996 },
      { day: 'Tue', count: 550 },
      { day: 'Wed', count: 723 },
      { day: 'Thu', count: 863 },
      { day: 'Fri', count: 658 },
      { day: 'Sat', count: 618 },
      { day: 'Sun', count: 700 },
    ],
    recentActivity: [
      { agent: 'Sales Assistant', conversations: 234, positive: 85, time: '2 hours ago' },
      { agent: 'Support Agent', conversations: 189, positive: 92, time: '3 hours ago' },
      { agent: 'Sales Assistant', conversations: 156, positive: 78, time: '5 hours ago' },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await Analytics.deleteMany({});
    console.log('Cleared existing analytics data');

    await Analytics.insertMany(sampleAnalyticsData);
    console.log('Inserted sample analytics data');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding analytics data:', error);
  }
}

seed();
