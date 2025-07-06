import React, { useState, useEffect } from 'react';
import { apiClient, type Movie } from '../utils/api';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [myList, setMyList] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [movies, searchQuery]);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToList = (movie: Movie) => {
    setMyList(prev => [...prev, movie.id]);
  };

  const handleRemoveFromList = (movie: Movie) => {
    setMyList(prev => prev.filter(id => id !== movie.id));
  };

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
    <div className="min-h-screen bg-netflix-black text-white">
      <Header onSearch={handleSearch} searchValue={searchQuery} />

      {/* Main Content with proper top padding */}
      <main className="pt-20">
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="bg-netflix-red/10 border border-netflix-red/30 text-netflix-red px-6 py-4 rounded-xl backdrop-blur-sm animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
                <button
                  onClick={loadMovies}
                  className="bg-netflix-red hover:bg-netflix-red-dark text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Hero Section */}
          <section className="mb-16">
            <div className="relative py-12">
              <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/5 to-transparent rounded-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
                  {searchQuery ? 'Search Results' : 'Your Library'}
                </h2>
                <p className="text-2xl text-gray-300 mb-8 max-w-3xl font-light">
                  {searchQuery ? (
                    `${filteredMovies.length} ${filteredMovies.length === 1 ? 'movie' : 'movies'} found for "${searchQuery}"`
                  ) : (
                    `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'} ready to stream in stunning quality`
                  )}
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">All systems online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-netflix-red" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300 font-medium">Instant streaming</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-32 animate-fade-in">
              <div className="relative inline-block">
                <div className="text-9xl mb-8 opacity-30">🎬</div>
                <div className="absolute inset-0 bg-netflix-red/10 rounded-full blur-3xl"></div>
              </div>
              <h3 className="text-4xl font-bold text-white mb-6">
                {searchQuery ? 'No movies found' : 'Your library awaits'}
              </h3>
              <p className="text-gray-400 mb-12 text-xl max-w-2xl mx-auto leading-relaxed">
                {searchQuery ? (
                  `No movies match your search for "${searchQuery}". Try a different search term.`
                ) : (
                  'Add some movies to your collection to start streaming. Simply drop your video files in the movies folder.'
                )}
              </p>
              <button
                onClick={loadMovies}
                className="bg-netflix-red hover:bg-netflix-red-dark text-white px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 font-bold text-xl shadow-2xl shadow-netflix-red/25"
              >
                Refresh Library
              </button>
            </div>
          ) : (
            <>
              {/* Continue Watching Section */}
              <section className="mb-12">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {searchQuery ? 'Search Results' : 'Continue Watching'}
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                  {filteredMovies.map((movie, index) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      index={index}
                      onAddToList={handleAddToList}
                      onRemoveFromList={handleRemoveFromList}
                      isInList={myList.includes(movie.id)}
                    />
                  ))}
                </div>
              </section>

              {/* My List Section */}
              {myList.length > 0 && !searchQuery && (
                <section className="pb-16">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">My List</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                    {movies
                      .filter(movie => myList.includes(movie.id))
                      .map((movie, index) => (
                        <MovieCard
                          key={`mylist-${movie.id}`}
                          movie={movie}
                          index={index}
                          onAddToList={handleAddToList}
                          onRemoveFromList={handleRemoveFromList}
                          isInList={true}
                        />
                      ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
