import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">🎬</div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">
          This page does not exist
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for could not be found. Maybe the movie was moved 
          or the link no longer exists.
        </p>
        <div className="space-x-4">
          <Link
            to="/home"
            className="inline-block bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded transition-colors duration-200"
          >
            Back to overview
          </Link>
          <Link
            to="/login"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded transition-colors duration-200"
          >
            Login again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
