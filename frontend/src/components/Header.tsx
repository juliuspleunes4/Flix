import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchValue = '' }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const { logout } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-netflix-black/95 backdrop-blur-md border-b border-netflix-gray/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-10">
            <h1 className="text-3xl font-black text-netflix-red tracking-tight cursor-pointer hover:scale-105 transition-transform duration-200">
              FLIX
            </h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-white hover:text-gray-300 transition-colors font-medium text-base relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors text-base relative group">
                Movies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors text-base relative group">
                Recently Added
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors text-base relative group">
                My List
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all duration-200 group-hover:w-full"></span>
              </a>
            </nav>
          </div>

          {/* Search and User Controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="bg-netflix-gray-dark border border-netflix-gray text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-netflix-red transition-all duration-200 w-64"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setIsSearchOpen(false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="ml-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-netflix-gray/30"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {/* Notifications */}
            <button className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-netflix-gray/30 relative">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              {/* Notification dot */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-netflix-red rounded-full"></span>
            </button>

            {/* User Avatar and Menu */}
            <div className="flex items-center space-x-3 group relative">
              <div className="w-8 h-8 bg-gradient-to-br from-netflix-red to-netflix-red-dark rounded-md flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              
              {/* Dropdown Arrow */}
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>

              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-netflix-gray-dark border border-netflix-gray rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100">
                <div className="py-2">
                  <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-netflix-gray transition-colors">
                    Manage Profiles
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-netflix-gray transition-colors">
                    Account
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-netflix-gray transition-colors">
                    Help Center
                  </a>
                  <hr className="my-2 border-netflix-gray" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-netflix-gray transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
