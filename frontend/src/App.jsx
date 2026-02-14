import React, { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Voice from './pages/Voice';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Agents from './pages/Agents';
import Landing from './pages/Landing';
import { FaBars } from 'react-icons/fa';

function App() {
  // For simplicity, assume user is authenticated if email exists in localStorage
  const isAuthenticated = !!localStorage.getItem('userEmail');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex h-screen bg-gray-900 text-white">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-6 overflow-auto">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden fixed top-4 left-4 z-20 bg-purple-600 p-2 rounded-lg"
            >
              <FaBars className="text-white" />
            </button>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/voice" element={<Voice />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
