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
      loadMovie(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const loadMovie = async (movieId: number) => {
    try {
      setIsLoading(true);
      const movieData = await apiClient.getMovie(movieId);
      setMovie(movieData);
    } catch (error) {
      console.error('Failed to load movie:', error);
      setError('Film kon niet geladen worden.');
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
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-300">Film laden...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {error || 'Film niet gevonden'}
          </h2>
          <Link
            to="/home"
            className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded transition-colors duration-200"
          >
            Terug naar overzicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header - hidden in fullscreen */}
      {!isFullscreen && (
        <header className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={goBack}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200"
            >
              <span className="text-2xl mr-2">←</span>
              <span>Terug</span>
            </button>
            <h1 className="text-xl font-semibold text-white truncate max-w-md">
              {movie.title}
            </h1>
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <span className="text-2xl">⛶</span>
            </button>
          </div>
        </header>
      )}

      {/* Video Player */}
      <div className="relative w-full h-screen">
        <video
          ref={videoRef}
          controls
          autoPlay
          className="w-full h-full object-contain bg-black"
          onError={() => setError('Fout bij het afspelen van de video.')}
        >
          <source
            src={`http://localhost:3000${movie.url}`}
            type={movie.filename.endsWith('.mp4') ? 'video/mp4' : 
                  movie.filename.endsWith('.mkv') ? 'video/x-matroska' : 
                  'video/avi'}
          />
          <p className="text-white">
            Je browser ondersteunt het video element niet.
          </p>
        </video>

        {/* Custom controls overlay for fullscreen */}
        {isFullscreen && (
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={toggleFullscreen}
              className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-75 transition-colors duration-200"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        )}
      </div>

      {/* Movie Info - hidden in fullscreen */}
      {!isFullscreen && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
            <div className="text-gray-300 mb-4 space-y-1">
              <p>Bestandsnaam: {movie.filename}</p>
              {movie.size && (
                <p>Bestandsgrootte: {formatFileSize(movie.size)}</p>
              )}
              {movie.modified && (
                <p>Gewijzigd: {new Date(movie.modified).toLocaleDateString('nl-NL')}</p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={toggleFullscreen}
                className="bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition-colors duration-200"
              >
                Volledig scherm
              </button>
              <Link
                to="/home"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors duration-200"
              >
                Andere films
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
