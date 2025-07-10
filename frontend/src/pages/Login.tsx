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
    <div className="min-h-screen text-white" style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white' }}>
      {/* Enhanced Netflix-style Header */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50, 
        backgroundColor: 'rgba(20, 20, 20, 0.95)', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(51, 51, 51, 0.2)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div className="flex justify-between items-center py-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            {/* Logo */}
            <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/src/assets/logo_flix.png" 
                alt="FLIX" 
                className="h-9 cursor-pointer hover:scale-105 transition-transform duration-200"
                style={{
                  height: '2.25rem',
                  width: 'auto',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
              />
            </div>

            {/* Login Status Indicator */}
            <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="w-2 h-2 bg-gray-500 rounded-full" style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#6B7280',
                borderRadius: '50%'
              }}></div>
              <span className="text-gray-400 font-medium text-sm" style={{ color: '#9CA3AF', fontWeight: '500', fontSize: '0.875rem' }}>Sign In Required</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 flex items-center justify-center min-h-screen" style={{ paddingTop: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="max-w-md w-full mx-4" style={{ maxWidth: '28rem', width: '100%', margin: '0 1rem' }}>
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="mb-8" style={{ marginBottom: '2rem' }}>
              <div className="text-6xl mb-6" style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.8 }}>🎬</div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4" style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Welcome Back
            </h2>
            <p className="text-lg text-gray-400 mb-8" style={{
              fontSize: '1.125rem',
              color: '#9CA3AF',
              marginBottom: '2rem',
              fontWeight: '400'
            }}>
              Sign in to access your personal movie library
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-netflix-gray-dark rounded-xl p-8 shadow-2xl border border-netflix-gray/20 backdrop-blur-sm" style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(51, 51, 51, 0.2)',
            backdropFilter: 'blur(4px)'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#D1D5DB',
                  marginBottom: '0.75rem'
                }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-netflix-gray-dark border border-netflix-gray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-netflix-red transition-all duration-200 text-lg"
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    backgroundColor: '#222222',
                    border: '1px solid #333333',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-netflix-red/10 border border-netflix-red/30 text-netflix-red px-4 py-3 rounded-lg backdrop-blur-sm animate-slide-up" style={{
                  backgroundColor: 'rgba(229, 9, 20, 0.1)',
                  border: '1px solid rgba(229, 9, 20, 0.3)',
                  color: '#E50914',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backdropFilter: 'blur(4px)'
                }}>
                  <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="mr-2 text-lg" style={{ marginRight: '0.5rem', fontSize: '1.125rem' }}>⚠️</span>
                    <span className="font-medium" style={{ fontWeight: '500' }}>{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="w-full bg-netflix-red hover:bg-netflix-red-dark disabled:bg-netflix-gray disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg text-lg tracking-wide"
                style={{
                  width: '100%',
                  backgroundColor: isLoading || !password.trim() ? '#4B5563' : '#E50914',
                  color: 'white',
                  fontWeight: '600',
                  padding: '1rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '1rem',
                  letterSpacing: '0.025em',
                  cursor: isLoading || !password.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      marginRight: '0.75rem',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-8 text-center" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '1.5rem',
                fontSize: '0.875rem',
                color: '#9CA3AF'
              }}>
                <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg className="w-4 h-4 text-green-500" width="16" height="16" fill="#10B981" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Access</span>
                </div>
                <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg className="w-4 h-4 text-netflix-red" width="16" height="16" fill="#E50914" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                  <span>HD Streaming</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm" style={{ 
            textAlign: 'center', 
            marginTop: '2rem', 
            color: '#6B7280', 
            fontSize: '0.875rem' 
          }}>
            <p className="mb-2" style={{ marginBottom: '0.5rem' }}>For personal use only</p>
            <p className="text-xs opacity-75" style={{ fontSize: '0.75rem', opacity: 0.75 }}>FLIX © M. Dirks & J. Pleunes</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
