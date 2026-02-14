import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      if (data.token) {
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-black p-4">
      <div className="bg-gray-900 rounded-lg p-6 md:p-8 max-w-md w-full shadow-lg hover-lift fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-purple-700 rounded-lg p-3 md:p-4 mb-4 bounce-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 md:h-10 md:w-10 text-white"
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
          <h1 className="text-purple-600 text-lg md:text-xl font-semibold mb-1 slide-in-left">Welcome Back</h1>
          <p className="text-gray-400 text-xs md:text-sm slide-in-right text-center">Sign in to your ConvoAI account</p>
        </div>
        {error && <p className="text-red-500 mb-4 fade-in text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
          <label className="text-gray-400 text-xs md:text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <div className="relative slide-in-left">
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 md:px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300 text-sm md:text-base"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 12H8m0 0l4-4m-4 4l4 4"
              />
            </svg>
          </div>
          <label className="text-gray-400 text-xs md:text-sm font-semibold" htmlFor="password">
            Password
          </label>
          <div className="relative slide-in-right">
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 md:px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300 text-sm md:text-base"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2v1h4v-1zM12 11v1a2 2 0 002 2h4a2 2 0 002-2v-1a2 2 0 00-2-2h-4z"
              />
            </svg>
          </div>
          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-purple-500 transition button-hover pulse-glow text-sm md:text-base"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4 fade-in text-xs md:text-sm">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
