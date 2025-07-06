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
        setError('Onjuist wachtwoord. Probeer het opnieuw.');
        setPassword('');
      }
    } catch {
      setError('Er ging iets mis. Probeer het later opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-netflix-black to-netflix-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-netflix-red mb-2">🎬 Flix</h1>
          <p className="text-gray-300">Welkom bij jouw persoonlijke filmbibliotheek</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-netflix-gray bg-opacity-75 rounded-lg p-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">
              Wachtwoord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-netflix-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
              placeholder="Voer je wachtwoord in"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-netflix-red text-sm text-center bg-red-900 bg-opacity-20 py-2 px-4 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-netflix-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-netflix-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Inloggen...
              </div>
            ) : (
              'Inloggen'
            )}
          </button>
        </form>
        
        <div className="text-center text-gray-400 text-sm">
          <p>Alleen voor persoonlijk gebruik</p>
          <p>Julius & Michiel © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
