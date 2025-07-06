import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient, type Movie, formatFileSize } from '../utils/api';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (id) {
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

  const loadMovie = async (movieId: string) => { // Changed from number to string
    try {
      setIsLoading(true);
      const movieData = await apiClient.getMovie(movieId);
      setMovie(movieData);
    } catch (error) {
      console.error('Failed to load movie:', error);
      setError('Movie could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await videoRef.current.requestFullscreen();
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
                {movie.title}
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
      <div className="relative w-full h-screen bg-black">
        <video
          ref={videoRef}
          controls
          autoPlay
          className="w-full h-full object-contain"
          onError={() => setError('Error playing the video.')}
          style={{
            filter: 'contrast(1.1) brightness(1.05)'
          }}
        >
          <source
            src={`http://localhost:3000${movie.url}`}
            type={movie.filename.endsWith('.mp4') ? 'video/mp4' : 
                  movie.filename.endsWith('.mkv') ? 'video/x-matroska' : 
                  'video/avi'}
          />
          <p className="text-white">
            Your browser does not support the video element.
          </p>
        </video>

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

      {/* Movie Info Overlay - hidden in fullscreen */}
      {!isFullscreen && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h2 className="text-4xl font-bold text-white mb-4">{movie.title}</h2>
                <div className="text-gray-300 space-y-2 mb-6">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      {movie.filename}
                    </span>
                    {movie.size && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        {formatFileSize(movie.size)}
                      </span>
                    )}
                    {movie.modified && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(movie.modified).toLocaleDateString('en-US')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={toggleFullscreen}
                  className="bg-netflix-red hover:bg-netflix-red-dark text-white px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Fullscreen
                </button>
                <Link
                  to="/home"
                  className="bg-netflix-gray-dark hover:bg-netflix-gray text-white px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Browse Library
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
