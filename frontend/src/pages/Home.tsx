import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, type Movie, formatFileSize } from '../utils/api';
import { getRecentMovies, clearRecentMovies } from '../utils/recentMovies';

interface HomeProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshTrigger?: number;
}

const Home: React.FC<HomeProps> = ({ searchQuery, refreshTrigger }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecentMovies();
  }, [refreshTrigger]);

  // Also refresh when the page becomes visible (user returns from another tab/window)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadRecentMovies();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadRecentMovies = async () => {
    try {
      setIsLoading(true);
      
      // Get recent movie IDs from localStorage
      const recent = getRecentMovies();
      
      // If we have recent movies, fetch their full details
      if (recent.length > 0) {
        const movieList = await apiClient.getMovies();
        // Filter movies to only include recent ones, maintaining order
        const recentMovieDetails = recent.map(recentMovie => 
          movieList.find(movie => movie.id === recentMovie.id)
        ).filter(Boolean) as Movie[];
        
        setMovies(recentMovieDetails);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Failed to load recent movies:', error);
      setError('Could not load recent movies. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMovies = searchQuery 
    ? movies.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : movies;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <main className="pt-24">
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
      {/* Main Content with reduced top padding to move elements up */}
      <main className="pt-16" style={{ paddingTop: '1rem' }}>
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
                  onClick={loadRecentMovies}
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
          {/* Clean Hero Section */}
          <section id="hero" className="mb-8" style={{ marginBottom: '2rem' }}>
            <div className="py-12" style={{ padding: '3rem 0' }}>
              <div className="flex items-center justify-between mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 id="library" className="text-5xl md:text-6xl font-bold text-white" style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  color: 'white',
                  letterSpacing: '-0.02em'
                }}>
                  {searchQuery ? 'Search Results' : 'Recently Watched'}
                </h2>
              </div>
              <p className="text-lg text-gray-400 mb-8" style={{
                fontSize: '1.125rem',
                color: '#9CA3AF',
                marginBottom: '2rem',
                fontWeight: '400'
              }}>
                {searchQuery ? (
                  `${filteredMovies.length} ${filteredMovies.length === 1 ? 'movie' : 'movies'} found for "${searchQuery}"`
                ) : (
                  movies.length > 0 
                    ? `${movies.length} recently watched ${movies.length === 1 ? 'movie' : 'movies'}`
                    : 'No recently watched movies'
                )}
              </p>
              {/* Status indicators */}
              <div className="flex items-center space-x-6" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="w-2 h-2 bg-green-500 rounded-full" style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#10B981',
                    borderRadius: '50%'
                  }}></div>
                  <span className="text-green-400 font-medium text-sm" style={{ color: '#34D399', fontWeight: '500', fontSize: '0.875rem' }}>Online</span>
                </div>
                <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg className="w-4 h-4 text-netflix-red" width="16" height="16" fill="#E50914" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-400 font-medium text-sm" style={{ color: '#9CA3AF', fontWeight: '500', fontSize: '0.875rem' }}>HD Streaming</span>
                </div>
              </div>
            </div>
          </section>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-32 animate-fade-in" style={{ textAlign: 'center', padding: '8rem 0' }}>
              <div className="mb-8" style={{ marginBottom: '2rem' }}>
                <div className="text-6xl mb-6" style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.6 }}>🎬</div>
              </div>
              <h3 className="text-4xl font-bold text-white mb-6" style={{
                fontSize: '2.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1.5rem'
              }}>
                {searchQuery ? 'No movies found' : 'Start watching!'}
              </h3>
              <p className="text-gray-400 mb-12 text-xl max-w-2xl mx-auto leading-relaxed" style={{
                color: '#9CA3AF',
                marginBottom: '3rem',
                fontSize: '1.125rem',
                maxWidth: '42rem',
                margin: '0 auto 3rem auto',
                lineHeight: '1.625'
              }}>
                {searchQuery ? (
                  `No movies match your search for "${searchQuery}". Try a different search term.`
                ) : (
                  'No movies watched yet! Visit the Movies page to start watching and they\'ll appear here.'
                )}
              </p>
              <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={loadRecentMovies}
                  className="bg-netflix-red hover:bg-netflix-red-dark text-white px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 font-bold text-xl shadow-2xl shadow-netflix-red/25"
                  style={{
                    backgroundColor: '#E50914',
                    color: 'white',
                    padding: '0.875rem 2.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Refresh Recent Movies
                </button>
                <Link
                  to="/movies"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-12 py-4 rounded-xl transition-all duration-300 font-bold text-xl"
                  style={{
                    backgroundColor: '#374151',
                    color: 'white',
                    padding: '0.875rem 2.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    textDecoration: 'none',
                    display: 'inline-block',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Browse Movies
                </Link>
              </div>
            </div>
          ) : (
            <section id="movies" className="pb-16" style={{ paddingBottom: '4rem' }}>
              <div className="flex items-center justify-between mb-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 className="text-2xl font-bold text-white" style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {searchQuery ? 'Search Results' : 'Recently Watched'}
                </h3>
                
                {/* Clear Recent Movies Button - only show if there are recent movies and not searching */}
                {movies.length > 0 && !searchQuery && (
                  <button
                    onClick={() => {
                      clearRecentMovies();
                      loadRecentMovies();
                    }}
                    className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-all duration-200"
                    style={{
                      color: '#9CA3AF',
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #4B5563',
                      backgroundColor: 'transparent',
                      cursor: 'pointer'
                    }}
                    title="Clear recently watched movies"
                  >
                    Clear Recent
                  </button>
                )}
              </div>
              <div className="grid gap-6" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {filteredMovies.map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/watch/${movie.id}`}
                    className="group relative bg-netflix-gray-dark rounded-lg overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    style={{ 
                      position: 'relative',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Movie Poster */}
                    <div className="aspect-[2/3] bg-gray-800 flex items-center justify-center relative overflow-hidden" style={{
                      aspectRatio: '2/3',
                      backgroundColor: '#2a2a2a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {movie.thumbnail ? (
                        <>
                          <img
                            src={movie.thumbnail}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-opacity duration-300"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onLoad={(e) => {
                              // Hide the placeholder when image loads
                              const placeholder = (e.target as HTMLImageElement).parentElement?.querySelector('.movie-placeholder') as HTMLElement;
                              if (placeholder) placeholder.style.display = 'none';
                            }}
                            onError={(e) => {
                              // Show placeholder on error
                              (e.target as HTMLImageElement).style.display = 'none';
                              const placeholder = (e.target as HTMLImageElement).parentElement?.querySelector('.movie-placeholder') as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                          <div className="movie-placeholder absolute inset-0 flex items-center justify-center text-4xl text-gray-600" style={{
                            fontSize: '2.5rem',
                            color: '#6B7280'
                          }}>🎬</div>
                        </>
                      ) : (
                        <div className="text-4xl text-gray-600" style={{
                          fontSize: '2.5rem',
                          color: '#6B7280'
                        }}>🎬</div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center" style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center" style={{
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          textAlign: 'center'
                        }}>
                          <div className="w-12 h-12 mx-auto mb-2 bg-white bg-opacity-90 rounded-full flex items-center justify-center" style={{
                            width: '3rem',
                            height: '3rem',
                            margin: '0 auto 0.5rem auto',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg className="w-5 h-5 text-black ml-0.5" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-white font-medium text-sm" style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>Play</p>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '0.25rem',
                        backgroundColor: '#374151'
                      }}>
                        <div className="h-full bg-netflix-red transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ 
                          height: '100%', 
                          backgroundColor: '#E50914', 
                          width: `${Math.random() * 70 + 10}%`,
                          opacity: 0,
                          transition: 'all 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                    
                    {/* Movie Info */}
                    <div className="p-3" style={{ padding: '0.75rem' }}>
                      <h3 className="text-white font-medium text-sm truncate mb-1" style={{
                        color: 'white',
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '0.25rem'
                      }}>
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: '#9CA3AF'
                      }}>
                        {movie.size && (
                          <span>{formatFileSize(movie.size)}</span>
                        )}
                        <div className="flex items-center space-x-1" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ color: '#FBBF24' }}>★</span>
                          <span>{(movie.stars || 3.5).toFixed(1)}</span>
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
