import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { type Movie, formatFileSize } from '../utils/api';

interface MovieCardProps {
  movie: Movie;
  index: number;
  onAddToList?: (movie: Movie) => void;
  onRemoveFromList?: (movie: Movie) => void;
  isInList?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  index, 
  onAddToList, 
  onRemoveFromList, 
  isInList = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Use movie stars rating or fallback to default
  const stars = movie.stars || 3.5; // Default to 3.5 stars if not specified
  const matchPercentage = Math.round((stars / 5) * 100); // Convert stars to percentage
  const year = new Date(movie.modified || Date.now()).getFullYear();

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInList) {
      onRemoveFromList?.(movie);
    } else {
      onAddToList?.(movie);
    }
  };

  return (
    <div
      className="group relative bg-netflix-gray-dark rounded-lg overflow-hidden transition-all duration-500 hover:scale-110 hover:z-20 shadow-lg hover:shadow-2xl movie-card"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/watch/${movie.id}`} className="block">
        {/* Movie Poster */}
        <div className="aspect-[2/3] bg-gradient-to-br from-netflix-red/20 via-netflix-gray-dark to-netflix-black flex items-center justify-center relative overflow-hidden">
          {/* Placeholder backdrop pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(229,9,20,0.3)_0%,_transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(229,9,20,0.2)_0%,_transparent_50%)]"></div>
          </div>
          
          {movie.thumbnail ? (
            <>
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onLoad={(e) => {
                  // Hide the placeholder when image loads
                  const placeholder = (e.target as HTMLImageElement).parentElement?.querySelector('.thumbnail-placeholder') as HTMLElement;
                  if (placeholder) placeholder.style.display = 'none';
                }}
                onError={(e) => {
                  // Show placeholder on error
                  (e.target as HTMLImageElement).style.display = 'none';
                  const placeholder = (e.target as HTMLImageElement).parentElement?.querySelector('.thumbnail-placeholder') as HTMLElement;
                  if (placeholder) placeholder.style.display = 'block';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition-all duration-500 transform group-hover:scale-110 z-10 thumbnail-placeholder">
                🎬
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition-all duration-500 transform group-hover:scale-110 z-10">
                🎬
              </div>
            </>
          )}
          
          {/* Progress bar (simulated watch progress) */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50">
            <div 
              className="h-full bg-netflix-red transition-all duration-300 opacity-0 group-hover:opacity-100" 
              style={{ width: `${Math.random() * 70 + 10}%` }}
            ></div>
          </div>
        </div>

        {/* Enhanced Hover Card */}
        <div className={`absolute inset-0 bg-netflix-gray-dark rounded-lg shadow-2xl transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-110 z-30' : 'opacity-0 scale-100 pointer-events-none'
        }`}>
          {/* Backdrop */}
          <div className="aspect-[2/3] bg-gradient-to-br from-netflix-red/30 via-netflix-gray-dark to-netflix-black flex items-center justify-center relative overflow-hidden rounded-t-lg">
            {movie.thumbnail ? (
              <>
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onLoad={(e) => {
                    // Hide the placeholder when image loads
                    const placeholder = (e.target as HTMLImageElement).parentElement?.querySelector('.hover-thumbnail-placeholder') as HTMLElement;
                    if (placeholder) placeholder.style.display = 'none';
                  }}
                  onError={(e) => {
                    // Show placeholder on error
                    (e.target as HTMLImageElement).style.display = 'none';
                    const placeholder = (e.target as HTMLImageElement).parentElement?.querySelector('.hover-thumbnail-placeholder') as HTMLElement;
                    if (placeholder) placeholder.style.display = 'block';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
                <div className="text-6xl opacity-30 z-10 hover-thumbnail-placeholder">🎬</div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
                <div className="text-6xl opacity-30 z-10">🎬</div>
              </>
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all duration-200">
                <svg className="w-6 h-6 ml-1 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Enhanced Info Panel */}
          <div className="p-4 bg-netflix-gray-dark rounded-b-lg">
            <h3 className="text-white text-sm font-bold mb-3 truncate">
              {movie.title}
            </h3>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 ml-0.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={handleAddToList}
                  className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors"
                >
                  {isInList ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </button>
                
                <button className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
              </div>
              
              <button className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Rating Display */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-green-400 font-bold text-sm">{matchPercentage}% Match</span>
              <div className="flex items-center">
                <span className="text-yellow-400 text-sm">★ {stars.toFixed(1)}</span>
              </div>
            </div>
            
            {/* Movie Details */}
            <div className="flex items-center space-x-3 text-xs text-gray-400 mb-2">
              <span className="border border-gray-400 px-1 text-[10px]">HD</span>
              <span>{year}</span>
              {movie.size && <span>{formatFileSize(movie.size)}</span>}
            </div>
            
            {/* Genres (simulated) */}
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span>Drama</span>
              <span>•</span>
              <span>Action</span>
              <span>•</span>
              <span>Thriller</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
