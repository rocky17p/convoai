import React, { useState, useEffect } from 'react';
import { FaChartLine, FaComments, FaMicrophone, FaClock } from 'react-icons/fa';
import { fetchConversations } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalConversations: 0,
    chatSessions: 0,
    voiceSessions: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchConversations(userId)
        .then((convos) => {
          if (Array.isArray(convos)) {
            const totalConversations = convos.length;
            const chatSessions = convos.filter((c) => c.type === 'chat').length;
            const voiceSessions = convos.filter((c) => c.type === 'voice').length;
            const totalMessages = convos.reduce(
              (acc, c) => acc + (c.messageCount || 0),
              0
            );
            setStats({
              totalConversations,
              chatSessions,
              voiceSessions,
              totalMessages,
            });
          } else {
            console.error('Conversations is not an array:', convos);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch conversations:', err);
        });
    }
  }, []);

  const statItems = [
    {
      id: 1,
      title: 'Total Conversations',
      value: stats.totalConversations,
      description: 'All time',
      icon: <FaChartLine className="text-white text-lg md:text-xl" />,
      bgColor: 'bg-purple-600',
    },
    {
      id: 2,
      title: 'Chat Sessions',
      value: stats.chatSessions,
      description: 'Text-based conversations',
      icon: <FaComments className="text-white text-lg md:text-xl" />,
      bgColor: 'bg-blue-500',
    },
    {
      id: 3,
      title: 'Voice Sessions',
      value: stats.voiceSessions,
      description: 'Voice conversations',
      icon: <FaMicrophone className="text-white text-lg md:text-xl" />,
      bgColor: 'bg-pink-500',
    },
    {
      id: 4,
      title: 'Total Messages',
      value: stats.totalMessages,
      description: 'Messages exchanged',
      icon: <FaClock className="text-white text-lg md:text-xl" />,
      bgColor: 'bg-green-500',
    },
  ];

  return (
    <div className="flex flex-col gap-6 fade-in px-4 md:px-12">
      {/* Header */}
      <div className="flex flex-row items-center mb-2 slide-in-left gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-600 pl-12 md:pl-0">
          Dashboard
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-gray-400 text-sm md:text-base mb-6">
        Overview of your sales and support conversations
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {statItems.map(({ id, title, value, description, icon, bgColor }) => (
          <div
            key={id}
            className="bg-gray-800 rounded-lg p-4 md:p-6 flex flex-col gap-2 shadow-md hover-lift stagger-animation"
          >
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${bgColor} mb-2 bounce-in`}
            >
              {icon}
            </div>
            <p className="text-gray-400 text-xs md:text-sm">{title}</p>
            <p className="text-xl md:text-2xl font-semibold">{value}</p>
            <p className="text-gray-500 text-xs">{description}</p>
          </div>
        ))}
      </div>

      {/* Welcome Section */}
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-md flex flex-col gap-3 md:gap-4 hover-lift fade-in mt-8">
        <h2 className="text-lg md:text-xl font-semibold text-white slide-in-left">
          Welcome to ConvoAI
        </h2>
        <p className="text-gray-400 text-sm md:text-base slide-in-right">
          Your AI-powered conversational assistant platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
          <div className="bg-gray-900 rounded-lg p-3 md:p-4 flex flex-col gap-2 hover-lift stagger-animation">
            <h3 className="text-white font-semibold flex items-center gap-2 text-sm md:text-base">
              <FaComments /> Chat Assistant
            </h3>
            <p className="text-gray-400 text-xs md:text-sm">
              Start a text-based conversation with AI. Get instant responses to
              your queries.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-3 md:p-4 flex flex-col gap-2 hover-lift stagger-animation">
            <h3 className="text-white font-semibold flex items-center gap-2 text-sm md:text-base">
              <FaMicrophone /> Voice Assistant
            </h3>
            <p className="text-gray-400 text-xs md:text-sm">
              Talk naturally with AI using voice. Real-time voice conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
