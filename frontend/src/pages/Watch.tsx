import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient, type Movie, formatFileSize } from '../utils/api';
import { addRecentMovie } from '../utils/recentMovies';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (id) {
      console.log(`🎬 Frontend: useEffect triggered with ID: ${id}`);
      loadMovie(id); // Changed from parseInt(id) to just id
    }
  }, [id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1635); // Adjusted for almost window size
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobileView]);

  const loadMovie = React.useCallback(async (movieId: string) => {
    try {
      setIsLoading(true);
      console.log(`🎬 Frontend: Loading movie with ID: ${movieId}`);
      const movieData = await apiClient.getMovie(movieId);
      console.log(`✅ Frontend: Received movie data:`, movieData);
      setMovie(movieData);
      setError(''); // Clear any previous errors when movie loads successfully
      console.log(`✅ Frontend: Movie state should be set to:`, movieData.title);
      
      // Add to recent movies when successfully loaded
      addRecentMovie({
        id: movieData.id,
        title: movieData.title,
        thumbnail: movieData.thumbnail,
        stars: movieData.stars,
        size: movieData.size
      });
      loadRecommendedMovies(movieData.title);
    } catch (error) {
      console.error('❌ Frontend: Failed to load movie:', error);
      setError('Movie could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRecommendedMovies = async (title: string) => {
    try {
      const keywords = title.split(' ').filter(word => word.length > 3);
      const recommendations = await apiClient.getMovies();

      // Exclude the current movie from recommendations
      const filteredRecommendations = recommendations.filter(movie => movie.id !== id);

      // Filter movies based on keyword matches
      const keywordMatches = filteredRecommendations.filter(movie =>
        keywords.some(keyword => movie.title.toLowerCase().includes(keyword.toLowerCase()))
      );

      // If fewer than 6 matches, add fallback movies as 6 random ones
      const fallbackMovies = filteredRecommendations
        .filter(movie => !keywordMatches.includes(movie))
        .sort(() => Math.random() - 0.5) // Shuffle the array randomly
        .slice(0, 6); // Pick the first 6 after shuffling

      const combinedRecommendations = [...keywordMatches, ...fallbackMovies].slice(0, 6);

      setRecommendedMovies(combinedRecommendations);
    } catch (error) {
      console.error('Failed to load recommended movies:', error);
    }
  };

  const toggleFullscreen = async () => {
    if (!movie) return;

    try {
      if (!document.fullscreenElement) {
        // For Google Drive, make the whole container fullscreen
        if (movie.source === 'gdrive') {
          const container = document.querySelector('.relative.w-full.h-screen.bg-black');
          if (container) {
            await (container as HTMLElement).requestFullscreen();
          }
        } else {
          // For local videos, make the video element fullscreen
          if (videoRef.current) {
            await videoRef.current.requestFullscreen();
          }
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  const goBack = () => {
    navigate('/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="spinner mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading movie...</h3>
          <p className="text-gray-400">Preparing your viewing experience</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    console.log(`🚨 Frontend: Showing error screen. Error: ${error}, Movie: ${movie ? 'exists' : 'null'}`);
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-8xl mb-6 opacity-50">⚠️</div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {error || 'Movie not found'}
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            We're having trouble loading this movie. Please try again or go back to browse other movies.
          </p>
          <Link
            to="/home"
            className="bg-netflix-red hover:bg-netflix-red-dark text-white px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg"
          >
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  // At this point, movie is guaranteed to be non-null due to the check above
  const currentMovie = movie as Movie;

  return (
    <div className="min-h-screen bg-netflix-black relative">
      {/* Header - hidden in fullscreen */}
      {!isFullscreen && (
        <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center justify-between p-6">
            <button
              onClick={goBack}
              className="flex items-center text-white hover:text-netflix-red transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-black/50 group-hover:bg-netflix-red/20 flex items-center justify-center mr-3 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Back to Library</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white truncate max-w-md">
                {currentMovie.title}
              </h1>
              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-netflix-red/20 flex items-center justify-center text-white hover:text-netflix-red transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Video Player */}
      <div className="relative w-full bg-black flex flex-col items-start justify-start" style={{ paddingTop: '6rem', paddingLeft: '1rem' }}>
        <div className="w-full max-w-[64rem] max-h-[70vh] aspect-video">
          {currentMovie.source === 'gdrive' ? (
            // Google Drive iframe player
            <iframe
              src={currentMovie.url}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                border: 'none',
                filter: 'contrast(1.1) brightness(1.05)',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: '16/9'
              }}
              onLoad={() => console.log('✅ Google Drive iframe loaded')}
              onError={() => {
                console.error('❌ Google Drive iframe error');
                setError('Error loading Google Drive video.');
              }}
            />
          ) : (
            // Local and Custom video player
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('❌ Video player error:', e);
                const streamUrl = currentMovie.source === 'custom' 
                  ? `http://localhost:3000/api/stream/custom/${currentMovie.id.replace('custom_', '')}`
                  : `http://localhost:3000/api/stream/${currentMovie.id}`;
                console.error('❌ Video source:', streamUrl);
                console.error('❌ Movie object:', currentMovie);
                setError('Error playing the video.');
              }}
              onLoadStart={() => {
                console.log('🎬 Video load started');
                const streamUrl = currentMovie.source === 'custom' 
                  ? `http://localhost:3000/api/stream/custom/${currentMovie.id.replace('custom_', '')}`
                  : `http://localhost:3000/api/stream/${currentMovie.id}`;
                console.log('🎬 Video source:', streamUrl);
              }}
              onCanPlay={() => console.log('✅ Video can play')}
              onLoadedData={() => console.log('✅ Video data loaded')}
              onLoadedMetadata={() => console.log('✅ Video metadata loaded')}
              onProgress={() => console.log('📊 Video loading progress')}
              onWaiting={() => console.log('⏳ Video waiting for data')}
              onPlaying={() => console.log('▶️ Video is playing')}
              onPause={() => console.log('⏸️ Video paused')}
              style={{
                filter: 'contrast(1.1) brightness(1.05)',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: '16/9'
              }}
            >
              <source
                src={currentMovie.source === 'custom' 
                  ? `http://localhost:3000/api/stream/custom/${currentMovie.id.replace('custom_', '')}`
                  : `http://localhost:3000/api/stream/${currentMovie.id}`}
                type={currentMovie.filename?.endsWith('.mp4') ? 'video/mp4' : 
                      currentMovie.filename?.endsWith('.mkv') ? 'video/x-matroska' : 
                      currentMovie.filename?.endsWith('.avi') ? 'video/x-msvideo' :
                      currentMovie.filename?.endsWith('.mov') ? 'video/quicktime' :
                      currentMovie.filename?.endsWith('.wmv') ? 'video/x-ms-wmv' :
                      'video/mp4'}
              />
              <p className="text-white">
                Your browser does not support the video element.
              </p>
            </video>
          )}
        </div>

        {/* Movie Info Overlay */}
        <div className="w-full mt-6">
          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-lg lg:text-xl font-bold text-white leading-tight">
              {currentMovie.title}
            </h1>
            {/* Description */}
            {currentMovie.description && currentMovie.description !== `Local movie: ${currentMovie.title.replace(/\s+/g, ' ')}` && (
              <p className="text-gray-300 leading-relaxed text-sm lg:text-base break-words" style={{ maxWidth: '64rem' }}>
                {currentMovie.description}
              </p>
            )}
            {/* Movie Details */}
            <div>
              {currentMovie.year && (
                <div className="flex items-center text-white text-xs">
                  <svg className="text-gray-400" fill="currentColor" viewBox="0 0 20 20" style={{ width: '24px', height: '24px', marginRight: '12px' }}>
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {currentMovie.year}
                </div>
              )}
              {currentMovie.rating && currentMovie.rating !== 'Not Rated' && (
                <div className="flex items-center text-gray-300 text-xs">
                  <svg className="text-gray-400" fill="currentColor" viewBox="0 0 20 20" style={{ width: '24px', height: '24px', marginRight: '12px' }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {currentMovie.rating}
                </div>
              )}
              {currentMovie.duration && currentMovie.duration !== 'Unknown' && (
                <div className="flex items-center text-gray-300 text-xs">
                  <svg className="text-gray-400" fill="currentColor" viewBox="0 0 20 20" style={{ width: '24px', height: '24px', marginRight: '12px' }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {currentMovie.duration}
                </div>
              )}
              {currentMovie.quality && currentMovie.quality !== 'Unknown' && (
                <div className="flex items-center text-gray-300 text-xs">
                  <svg className="text-gray-400" fill="currentColor" viewBox="0 0 20 20" style={{ width: '24px', height: '24px', marginRight: '12px' }}>
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  {currentMovie.quality}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Movies Section */}
      <div className="absolute top-[6rem] right-[1rem] w-[30%] bg-black/50 p-4 rounded-lg" style={{ display: isMobileView ? 'none' : 'block' }}>
        <h2 className="text-white text-lg font-bold mb-4">Your next recommended watch</h2>
        <div className="grid gap-4" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '1rem' 
        }}>
          {recommendedMovies.map(movie => (
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
                    />
                  </>
                ) : (
                  <div className="text-4xl text-gray-600" style={{
                    fontSize: '2.5rem',
                    color: '#6B7280'
                  }}>🎬</div>
                )}
              </div>
              {/* Movie Info */}
              <div className="p-2" style={{ padding: '0.5rem' }}>
                <h3 className="text-white font-medium text-xs truncate mb-1" style={{
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: '0.25rem'
                }}>
                  {movie.title}
                </h3>
                {/* Stars and Size Info */}
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
      </div>

      {/* Custom fullscreen exit button */}
      {isFullscreen && (
        <div className="absolute top-6 right-6 z-30">
          <button
            onClick={toggleFullscreen}
            className="w-12 h-12 rounded-full bg-black/70 hover:bg-netflix-red text-white hover:text-white transition-all duration-200 flex items-center justify-center shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Watch;
