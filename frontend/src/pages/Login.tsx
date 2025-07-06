import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // If already authenticated, redirect to home
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(password);
      if (!success) {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-netflix-black via-netflix-black-light to-netflix-dark relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/20 to-transparent"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo and Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-netflix-red mb-4 tracking-tight">FLIX</h1>
            <div className="w-16 h-1 bg-netflix-red mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg font-light">Welcome to your personal movie library</p>
          </div>
          
          {/* Login Form */}
          <div className="bg-netflix-black-light/80 backdrop-blur-md rounded-lg p-8 shadow-netflix border border-netflix-gray/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-netflix-gray-dark border border-netflix-gray rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-netflix-red transition-all duration-200 text-lg"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-netflix-red/20 border border-netflix-red/50 text-netflix-red text-sm p-4 rounded-md backdrop-blur-sm animate-slide-up">
                  <div className="flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="w-full bg-netflix-red hover:bg-netflix-red-dark disabled:bg-netflix-gray disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg text-lg tracking-wide"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Logging in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-sm">
            <p className="mb-2">For personal use only</p>
            <p className="text-xs opacity-75">Julius & Michiel © 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
