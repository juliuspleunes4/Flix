import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiClient, type Movie, formatFileSize } from '../utils/api';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-300">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <header className="bg-netflix-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-netflix-red">🎬 Flix</h1>
              <span className="ml-3 text-gray-400 hidden sm:block">
                Your personal movie library
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-700 text-red-300 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={loadMovies}
              className="ml-4 text-red-400 hover:text-red-300 underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Available Movies</h2>
          <p className="text-gray-400">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'} available
          </p>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-gray-400 mb-4">
              There are currently no movies available in the library.
            </p>
            <button
              onClick={loadMovies}
              className="bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                to={`/watch/${movie.id}`}
                className="group relative bg-netflix-gray rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-[2/3] bg-gradient-to-b from-netflix-gray to-netflix-dark flex items-center justify-center">
                  <div className="text-4xl opacity-50">🎬</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-center">
                      <div className="text-3xl mb-2">▶️</div>
                      <p className="text-sm">Play</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <h3 className="text-white text-sm font-medium truncate mb-1">
                    {movie.title}
                  </h3>
                  {movie.size && (
                    <p className="text-gray-400 text-xs">
                      {formatFileSize(movie.size)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
