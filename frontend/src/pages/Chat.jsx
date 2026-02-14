import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUserCircle, FaPaperPlane, FaPlus } from 'react-icons/fa';
import { sendMessage, createConversation, fetchConversations } from '../api';
import { useSearchParams } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedTask, setSelectedTask] = useState('general');
  const messagesEndRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUserId(userId);
      const convoId = searchParams.get('conversationId');
      if (convoId) {
        setConversationId(convoId);
        loadMessages(convoId);
      } else {
        loadConversations(userId);
      }
    }
  }, [searchParams]);

  const loadConversations = async (userId) => {
    const convos = await fetchConversations(userId);
    if (convos.length > 0) {
      setConversationId(convos[0]._id);
      loadMessages(convos[0]._id);
    } else {
      const newConvo = await createConversation(userId, 'New Chat', 'chat');
      setConversationId(newConvo._id);
      setMessages([]);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`http://localhost:5000/chat/messages/${conversationId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId || !userId) return;
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const aiMessage = await sendMessage(conversationId, 'user', input);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = async () => {
    if (!userId) return;
    const newConvo = await createConversation(userId, 'New Chat', 'chat', selectedTask);
    setConversationId(newConvo._id);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full fade-in">
      <div className="flex justify-between items-center mb-4 slide-in-left">
        <h2 className="text-xl font-semibold text-white">Chat</h2>
        <div className="flex items-center gap-2">
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          >
            <option value="sales">Sales</option>
            <option value="technical_support">Technical Support</option>
            <option value="general">General</option>
            <option value="billing">Billing</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition button-hover pulse-glow"
          >
            <FaPlus /> New Chat
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1 bg-gray-900 rounded-lg p-4 overflow-y-auto hover-lift">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-grow text-gray-400 fade-in">
            <FaRobot className="text-purple-600 text-6xl mb-4 bounce-in" />
            <h2 className="text-xl font-semibold mb-1 slide-in-left">Start a conversation</h2>
            <p className="slide-in-right">Ask me anything, I'm here to help!</p>
          </div>
        )}
        {messages.map(({ id, _id, text, sender }, index) => (
          <div
            key={id || _id || index}
            className={`flex gap-3 mb-4 stagger-animation ${
              sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {sender === 'ai' && (
              <FaRobot className="text-purple-600 text-3xl mt-1 bounce-in" />
            )}
            <div
              className={`max-w-[70%] p-4 rounded-lg whitespace-pre-wrap hover-lift ${
                sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-300 rounded-bl-none overflow-auto max-h-64'
              }`}
            >
              {text}
            </div>
            {sender === 'user' && (
              <FaUserCircle className="text-gray-400 text-3xl mt-1 bounce-in" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 slide-in-right">
        <textarea
          rows={2}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg bg-gray-800 border border-purple-600 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none transition-all duration-300"
        />
        <button
          onClick={handleSend}
          className="mt-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold py-2 px-4 rounded-lg float-right hover:from-purple-700 hover:to-purple-500 transition button-hover pulse-glow"
          aria-label="Send message"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;