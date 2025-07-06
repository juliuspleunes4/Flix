import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, type Movie, formatFileSize } from '../utils/api';

interface MoviesProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Movies: React.FC<MoviesProps> = ({ searchQuery }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'size' | 'date'>('title');

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

  const filteredMovies = searchQuery 
    ? movies.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : movies;

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'size':
        return (b.size || 0) - (a.size || 0);
      case 'date':
        return new Date(b.modified || 0).getTime() - new Date(a.modified || 0).getTime();
      default:
        return 0;
    }
  });

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
          {/* Movies Header */}
          <section className="mb-12" style={{ marginBottom: '3rem' }}>
            <div className="py-8" style={{ padding: '2rem 0' }}>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                Movies
              </h1>
              <p className="text-lg text-gray-400 mb-8" style={{
                fontSize: '1.125rem',
                color: '#9CA3AF',
                marginBottom: '2rem',
                fontWeight: '400'
              }}>
                {searchQuery ? (
                  `${sortedMovies.length} ${sortedMovies.length === 1 ? 'result' : 'results'} for "${searchQuery}"`
                ) : (
                  `Browse all ${movies.length} movies in your collection`
                )}
              </p>

              {/* Sort and Filter Controls */}
              <div className="flex items-center space-x-4 mb-8" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <label className="text-gray-300 font-medium text-sm" style={{ color: '#D1D5DB', fontWeight: '500', fontSize: '0.875rem' }}>
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'title' | 'size' | 'date')}
                  className="bg-netflix-gray-dark border border-netflix-gray text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-netflix-red transition-all duration-200"
                  style={{
                    backgroundColor: '#222222',
                    border: '1px solid #333333',
                    color: 'white',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem'
                  }}
                >
                  <option value="title">Title A-Z</option>
                  <option value="size">File Size</option>
                  <option value="date">Date Added</option>
                </select>
              </div>
            </div>
          </section>

          {/* Movies Grid */}
          {sortedMovies.length === 0 ? (
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
                {searchQuery ? 'No movies found' : 'No movies available'}
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
                  'Add some movies to your collection to start streaming. Simply drop your video files in the movies folder.'
                )}
              </p>
              <button
                onClick={loadMovies}
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
                Refresh Library
              </button>
            </div>
          ) : (
            <section className="pb-16" style={{ paddingBottom: '4rem' }}>
              <div className="grid gap-6" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {sortedMovies.map((movie) => (
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
                      <div className="text-4xl text-gray-600" style={{
                        fontSize: '2.5rem',
                        color: '#6B7280'
                      }}>🎬</div>
                      
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
                          <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
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

export default Movies;
