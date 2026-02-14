import React, { useEffect, useState } from 'react';
import { fetchAnalytics } from '../api';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        if (data && data.length > 0) {
          setAnalyticsData(data[0]);
        }
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      }
    };
    loadAnalytics();
  }, []);

  if (!analyticsData) {
    return <div>Loading analytics...</div>;
  }

  // Calculate max conversation volume for bar width scaling
  const maxVolume = analyticsData.conversationVolume
    ? Math.max(...analyticsData.conversationVolume.map(v => v.count))
    : 1;

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div className="slide-in-left">
        <h1 className="text-3xl font-bold text-purple-600 mb-1 pl-12 md:pl-0">Analytics Dashboard</h1>
        <p className="text-gray-400">Track performance and conversation insights</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-2 shadow-md hover-lift stagger-animation">
          <div className="mb-2">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2M7 8H5a2 2 0 00-2 2v8a2 2 0 002 2h2m10-12V6a4 4 0 00-8 0v2m8 0H7" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Total Conversations</p>
          <p className="text-2xl font-semibold">{analyticsData.totalConversations.toLocaleString()}</p>
          <p className={`text-xs ${analyticsData.totalConversationsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {analyticsData.totalConversationsChange >= 0 ? '+' : ''}{analyticsData.totalConversationsChange}%
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-2 shadow-md hover-lift stagger-animation">
          <div className="mb-2">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Avg Response Time</p>
          <p className="text-2xl font-semibold">{analyticsData.avgResponseTime}ms</p>
          <p className={`text-xs ${analyticsData.avgResponseTimeChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
            {analyticsData.avgResponseTimeChange >= 0 ? '+' : ''}{analyticsData.avgResponseTimeChange}%
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-2 shadow-md hover-lift stagger-animation">
          <div className="mb-2">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Resolution Rate</p>
          <p className="text-2xl font-semibold">{analyticsData.resolutionRate}%</p>
          <p className={`text-xs ${analyticsData.resolutionRateChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {analyticsData.resolutionRateChange >= 0 ? '+' : ''}{analyticsData.resolutionRateChange}%
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-2 shadow-md hover-lift stagger-animation">
          <div className="mb-2">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Active Users</p>
          <p className="text-2xl font-semibold">{analyticsData.activeUsers.toLocaleString()}</p>
          <p className={`text-xs ${analyticsData.activeUsersChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {analyticsData.activeUsersChange >= 0 ? '+' : ''}{analyticsData.activeUsersChange}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-md hover-lift fade-in">
          <h2 className="text-xl font-semibold text-white slide-in-left mb-4">Conversation Volume</h2>
          {analyticsData.conversationVolume && analyticsData.conversationVolume.map(({ day, count }) => (
            <div key={day} className="flex items-center mb-2">
              <div className="w-12">{day}</div>
              <div className="flex-1 bg-gray-700 rounded-full h-6 relative">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 h-6 rounded-full text-white text-right pr-3"
                  style={{ width: `${(count / maxVolume) * 100}%` }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-md hover-lift fade-in">
          <h2 className="text-xl font-semibold text-white slide-in-left mb-4">Recent Activity</h2>
          {analyticsData.recentActivity && analyticsData.recentActivity.map(({ agent, conversations, positive, time }, index) => (
            <div key={index} className="mb-4 p-3 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold">{agent}</div>
                <div className="text-sm text-gray-400">{time}</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2M7 8H5a2 2 0 00-2 2v8a2 2 0 002 2h2m10-12V6a4 4 0 00-8 0v2m8 0H7" />
                  </svg>
                  {conversations} conversations
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {positive}% positive
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
