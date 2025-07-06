import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiClient, type Movie, formatFileSize } from '../utils/api';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setIsLoading(true);
      const movieList = await apiClient.getMovies();
      setMovies(movieList);
    } catch (error) {
      console.error('Failed to load movies:', error);
      setError('Could not load movies. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const filteredMovies = searchQuery 
    ? movies.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : movies;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black">
        {/* Header skeleton */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-netflix-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-8">
                <div className="w-20 h-8 bg-netflix-gray rounded loading-shimmer"></div>
                <div className="hidden md:flex space-x-6">
                  <div className="w-12 h-4 bg-netflix-gray rounded loading-shimmer"></div>
                  <div className="w-16 h-4 bg-netflix-gray rounded loading-shimmer"></div>
                  <div className="w-24 h-4 bg-netflix-gray rounded loading-shimmer"></div>
                </div>
              </div>
              <div className="w-16 h-4 bg-netflix-gray rounded loading-shimmer"></div>
            </div>
          </div>
        </header>
        
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="w-64 h-12 bg-netflix-gray rounded-lg loading-shimmer mb-4"></div>
              <div className="w-48 h-6 bg-netflix-gray rounded loading-shimmer"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-netflix-gray rounded-lg loading-shimmer"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
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
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-10" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              <h1 className="text-4xl font-black text-netflix-red tracking-tight cursor-pointer hover:scale-105 transition-transform duration-200" style={{ 
                fontSize: '2.25rem', 
                fontWeight: '900', 
                color: '#E50914', 
                letterSpacing: '-0.025em', 
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>
                FLIX
              </h1>
              <nav className="hidden md:flex space-x-8" style={{ display: 'flex', gap: '2rem' }}>
                <a href="#" className="text-white hover:text-gray-300 transition-colors font-medium text-base relative group" style={{ color: 'white', fontWeight: '500', textDecoration: 'none' }}>
                  Home
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors text-base relative group" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  Movies
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors text-base relative group" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  Recently Added
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors text-base relative group" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  My List
                </a>
              </nav>
            </div>

            {/* Search and User Controls */}
            <div className="flex items-center space-x-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-netflix-gray-dark border border-netflix-gray text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-netflix-red transition-all duration-200 w-64"
                  style={{
                    backgroundColor: '#222222',
                    border: '1px solid #333333',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    width: '16rem'
                  }}
                />
              </div>

              {/* Notifications */}
              <button className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-netflix-gray/30 relative" style={{ 
                color: '#D1D5DB', 
                background: 'none', 
                border: 'none', 
                padding: '0.5rem',
                borderRadius: '50%',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <svg className="w-6 h-6" width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-netflix-red rounded-full" style={{
                  position: 'absolute',
                  top: '0.25rem',
                  right: '0.25rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  backgroundColor: '#E50914',
                  borderRadius: '50%'
                }}></span>
              </button>

              {/* User Avatar and Menu */}
              <div className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="w-8 h-8 bg-gradient-to-br from-netflix-red to-netflix-red-dark rounded-md flex items-center justify-center shadow-lg" style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'linear-gradient(to bottom right, #E50914, #B20710)',
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <span className="text-white font-bold text-sm" style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>U</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                  style={{ 
                    color: '#D1D5DB', 
                    background: 'none', 
                    border: 'none', 
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with proper top padding */}
      <main className="pt-24" style={{ paddingTop: '6rem' }}>
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', marginBottom: '2rem' }}>
            <div className="bg-netflix-red/10 border border-netflix-red/30 text-netflix-red px-6 py-4 rounded-xl backdrop-blur-sm animate-slide-up" style={{
              backgroundColor: 'rgba(229, 9, 20, 0.1)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              color: '#E50914',
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem'
            }}>
              <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="mr-3 text-xl" style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>⚠️</span>
                  <span className="font-medium" style={{ fontWeight: '500' }}>{error}</span>
                </div>
                <button
                  onClick={loadMovies}
                  className="bg-netflix-red hover:bg-netflix-red-dark text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
                  style={{
                    backgroundColor: '#E50914',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          {/* Enhanced Hero Section */}
          <section className="mb-16" style={{ marginBottom: '4rem' }}>
            <div className="relative py-12" style={{ position: 'relative', padding: '3rem 0' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/5 to-transparent rounded-3xl" style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(229, 9, 20, 0.05), transparent)',
                borderRadius: '1.5rem'
              }}></div>
              <div className="relative z-10" style={{ position: 'relative', zIndex: 10 }}>
                <h2 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight" style={{
                  fontSize: '3.75rem',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.025em'
                }}>
                  {searchQuery ? 'Search Results' : 'Your Library'}
                </h2>
                <p className="text-2xl text-gray-300 mb-8 max-w-3xl font-light" style={{
                  fontSize: '1.5rem',
                  color: '#D1D5DB',
                  marginBottom: '2rem',
                  maxWidth: '48rem',
                  fontWeight: '300'
                }}>
                  {searchQuery ? (
                    `${filteredMovies.length} ${filteredMovies.length === 1 ? 'movie' : 'movies'} found for "${searchQuery}"`
                  ) : (
                    `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'} ready to stream in stunning quality`
                  )}
                </p>
                <div className="flex items-center space-x-6" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{
                      width: '0.75rem',
                      height: '0.75rem',
                      backgroundColor: '#10B981',
                      borderRadius: '50%'
                    }}></div>
                    <span className="text-green-400 font-medium" style={{ color: '#34D399', fontWeight: '500' }}>All systems online</span>
                  </div>
                  <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg className="w-5 h-5 text-netflix-red" width="20" height="20" fill="#E50914" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300 font-medium" style={{ color: '#D1D5DB', fontWeight: '500' }}>Instant streaming</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-32 animate-fade-in" style={{ textAlign: 'center', padding: '8rem 0' }}>
              <div className="relative inline-block" style={{ position: 'relative', display: 'inline-block' }}>
                <div className="text-9xl mb-8 opacity-30" style={{ fontSize: '8rem', marginBottom: '2rem', opacity: 0.3 }}>🎬</div>
                <div className="absolute inset-0 bg-netflix-red/10 rounded-full blur-3xl" style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(229, 9, 20, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(48px)'
                }}></div>
              </div>
              <h3 className="text-4xl font-bold text-white mb-6" style={{
                fontSize: '2.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1.5rem'
              }}>
                {searchQuery ? 'No movies found' : 'Your library awaits'}
              </h3>
              <p className="text-gray-400 mb-12 text-xl max-w-2xl mx-auto leading-relaxed" style={{
                color: '#9CA3AF',
                marginBottom: '3rem',
                fontSize: '1.25rem',
                maxWidth: '42rem',
                margin: '0 auto 3rem auto',
                lineHeight: '1.625'
              }}>
                {searchQuery ? (
                  `No movies match your search for "${searchQuery}". Try a different search term.`
                ) : (
                  'Add some movies to your collection to start streaming. Simply drop your video files in the movies folder.'
                )}
              </p>
              <button
                onClick={loadMovies}
                className="bg-netflix-red hover:bg-netflix-red-dark text-white px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 font-bold text-xl shadow-2xl shadow-netflix-red/25"
                style={{
                  backgroundColor: '#E50914',
                  color: 'white',
                  padding: '1rem 3rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  boxShadow: '0 25px 50px -12px rgba(229, 9, 20, 0.25)'
                }}
              >
                Refresh Library
              </button>
            </div>
          ) : (
            <section className="pb-16" style={{ paddingBottom: '4rem' }}>
              <div className="mb-8" style={{ marginBottom: '2rem' }}>
                <h3 className="text-2xl font-bold text-white mb-4" style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '1rem'
                }}>
                  {searchQuery ? 'Search Results' : 'Continue Watching'}
                </h3>
              </div>
              <div className="grid gap-6" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {filteredMovies.map((movie, index) => (
                  <Link
                    key={movie.id}
                    to={`/watch/${movie.id}`}
                    className="group relative bg-netflix-gray-dark rounded-xl overflow-hidden hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-netflix hover:z-10 movie-card"
                    style={{ 
                      position: 'relative',
                      backgroundColor: '#222222',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      transition: 'all 0.5s',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      textDecoration: 'none',
                      color: 'inherit',
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {/* Enhanced Movie Poster */}
                    <div className="aspect-[2/3] bg-gradient-to-br from-netflix-red/20 via-netflix-gray-dark to-netflix-black flex items-center justify-center relative overflow-hidden" style={{
                      aspectRatio: '2/3',
                      background: 'linear-gradient(to bottom right, rgba(229, 9, 20, 0.2), #222222, #000000)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10" style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
                        <div className="absolute inset-0" style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(circle at 20% 50%, rgba(229,9,20,0.3) 0%, transparent 50%)'
                        }}></div>
                        <div className="absolute inset-0" style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(circle at 80% 20%, rgba(229,9,20,0.2) 0%, transparent 50%)'
                        }}></div>
                      </div>
                      
                      <div className="absolute inset-0" style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent, rgba(0,0,0,0.2))'
                      }}></div>
                      <div className="text-6xl opacity-20 z-10" style={{
                        fontSize: '3.75rem',
                        opacity: 0.2,
                        zIndex: 10,
                        transition: 'all 0.5s'
                      }}>🎬</div>
                      
                      {/* Progress bar simulation */}
                      <div className="absolute bottom-0 left-0 right-0 h-1" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '0.25rem',
                        backgroundColor: 'rgba(75, 85, 99, 0.5)'
                      }}>
                        <div style={{ 
                          height: '100%', 
                          backgroundColor: '#E50914', 
                          width: `${Math.random() * 70 + 10}%`,
                          opacity: 0,
                          transition: 'all 0.3s'
                        }}></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Movie Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4" style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.9), transparent)',
                      padding: '1rem'
                    }}>
                      <h3 className="text-white text-base font-bold truncate mb-2" style={{
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '0.5rem',
                        transition: 'color 0.3s'
                      }}>
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {movie.size && (
                          <p className="text-gray-400 text-xs" style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                            {formatFileSize(movie.size)}
                          </p>
                        )}
                        <div className="flex items-center space-x-1" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span className="text-yellow-400 text-xs" style={{ color: '#FBBF24', fontSize: '0.75rem' }}>★</span>
                          <span className="text-gray-400 text-xs" style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{(Math.random() * 2 + 3).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
