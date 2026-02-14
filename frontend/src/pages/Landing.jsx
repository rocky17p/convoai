import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaComments, FaMicrophone, FaHistory, FaTachometerAlt, FaShieldAlt } from 'react-icons/fa';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaRobot className="text-purple-600 text-4xl" />,
      title: 'AI-Powered Conversations',
      description: 'Engage in intelligent, context-aware conversations with our advanced AI assistant.'
    },
    {
      icon: <FaComments className="text-blue-500 text-4xl" />,
      title: 'Sales & Support Focus',
      description: 'Specialized AI trained for sales inquiries and customer support interactions.'
    },
    {
      icon: <FaMicrophone className="text-pink-500 text-4xl" />,
      title: 'Voice Integration',
      description: 'Seamless voice conversations for hands-free interaction.'
    },
    {
      icon: <FaHistory className="text-green-500 text-4xl" />,
      title: 'Conversation History',
      description: 'Access and continue your previous conversations anytime.'
    },
    {
      icon: <FaTachometerAlt className="text-yellow-500 text-4xl" />,
      title: 'Real-time Analytics',
      description: 'Track your conversation metrics and performance insights.'
    },
    {
      icon: <FaShieldAlt className="text-red-500 text-4xl" />,
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and stored securely.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 fade-in">
        <div className="flex items-center gap-2">
          <div className="bg-purple-700 rounded-lg p-2 bounce-in">
            <FaTachometerAlt className="text-white text-xl" />
          </div>
          <span className="text-purple-400 font-bold text-2xl slide-in-left">ConvoAI</span>
        </div>
        <div className="flex gap-4 slide-in-right">
          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-2 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition button-hover"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition button-hover pulse-glow"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 fade-in">
        <h1 className="text-5xl font-bold mb-6 text-gradient float">
          AI-Powered Sales & Support Platform
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto slide-in-left">
          Transform your customer interactions with intelligent conversational AI.
          Handle sales inquiries, provide support, and engage customers 24/7.
        </p>
        <div className="flex gap-4 justify-center slide-in-right">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-lg font-semibold button-hover pulse-glow"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="px-8 py-3 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition text-lg font-semibold button-hover"
          >
            Login
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 fade-in">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition hover-lift stagger-animation">
                <div className="flex justify-center mb-4 bounce-in">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-800 fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 slide-in-left">Ready to Transform Your Customer Experience?</h2>
          <p className="text-xl text-gray-300 mb-8 slide-in-right">
            Join thousands of businesses using ConvoAI to enhance their sales and support operations.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-lg font-semibold button-hover pulse-glow"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 fade-in">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-purple-700 rounded-lg p-2 bounce-in">
              <FaTachometerAlt className="text-white text-xl" />
            </div>
            <span className="text-purple-400 font-bold text-xl slide-in-left">ConvoAI</span>
          </div>
          <p className="text-gray-400">© 2024 ConvoAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
