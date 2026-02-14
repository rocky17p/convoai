import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaComments, FaMicrophone, FaHistory, FaTachometerAlt, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'p@gmail.com';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold'
      : 'flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800';

  return (
    <aside className={`w-64 bg-gray-900 flex flex-col justify-between p-6 fixed inset-0 z-50 transform transition-transform md:relative md:translate-x-0 md:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 text-white text-xl"
      >
        <FaTimes />
      </button>
      <div>
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-purple-700 rounded-lg p-2">
            <FaTachometerAlt className="text-white text-xl" />
          </div>
          <span className="text-purple-600 font-bold text-lg">ConvoAI</span>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink to="/chat" className={linkClass}>
            <FaComments /> Chat
          </NavLink>
          <NavLink to="/voice" className={linkClass}>
            <FaMicrophone /> Voice
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            <FaHistory /> History
          </NavLink>
          <NavLink to="/analytics" className={linkClass}>
            <FaTachometerAlt /> Analytics
          </NavLink>
          <NavLink to="/agents" className={linkClass}>
            <FaTachometerAlt /> Agents
          </NavLink>
        </nav>
      </div>
      <div className="mt-8">
        <p className="text-gray-400 mb-2">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;