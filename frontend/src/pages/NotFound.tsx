import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/10 via-transparent to-netflix-black"></div>
      
      <div className="relative z-10 text-center animate-fade-in">
        <div className="text-9xl mb-8 animate-bounce">🎬</div>
        <h1 className="text-8xl font-bold text-netflix-red mb-6 tracking-tight">404</h1>
        <h2 className="text-3xl font-bold text-white mb-6">
          Lost in the Library
        </h2>
        <p className="text-gray-300 mb-12 max-w-md mx-auto text-lg leading-relaxed">
          The page you are looking for could not be found. Maybe the movie was moved 
          or the link no longer exists.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
          <Link
            to="/home"
            className="inline-block bg-netflix-red hover:bg-netflix-red-dark text-white px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg"
          >
            Back to Library
          </Link>
          <Link
            to="/login"
            className="inline-block bg-netflix-gray-dark hover:bg-netflix-gray text-white px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg border border-netflix-gray"
          >
            Sign In Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
