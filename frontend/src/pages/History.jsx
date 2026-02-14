import React, { useState, useEffect } from 'react';
import { fetchConversations } from '../api';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchConversations(userId)
        .then((data) => {
          if (Array.isArray(data)) {
            setConversations(data);
          } else {
            console.error('Conversations data is not an array:', data);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch conversations:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleConversationClick = (conversationId) => {
    navigate(`/chat?conversationId=${conversationId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-600 mb-1 pl-12 md:pl-0">Conversation History</h1>
          <p className="text-gray-400">View all your past conversations</p>
        </div>
        <div className="text-center text-gray-400">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div className="slide-in-left">
        <h1 className="text-3xl font-bold text-purple-600 mb-1 pl-12 md:pl-0">Conversation History</h1>
        <p className="text-gray-400">View all your past conversations</p>
      </div>
      <div className="flex flex-col gap-4">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-400 fade-in">No conversations found.</div>
        ) : (
          conversations.map((conv, index) => (
            <div
              key={conv._id}
              className="bg-gray-800 rounded-lg p-4 flex justify-between items-center shadow-md cursor-pointer hover-lift stagger-animation"
              onClick={() => handleConversationClick(conv._id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 bounce-in">
                <div className="bg-blue-700 rounded-lg p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-3-6v6m-7 4h14a2 2 0 002-2v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{conv.title}</h3>
                  <p className="text-gray-400 text-sm">{formatTimeAgo(conv.createdAt)}</p>
                  <p className="text-gray-500 text-xs">{conv.messageCount || 0} messages</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-purple-600 text-white text-xs font-semibold rounded-full px-3 py-1">
                  {conv.type}
                </span>
                <span className="bg-purple-400 text-white text-xs font-semibold rounded-full px-3 py-1">
                  Active
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
