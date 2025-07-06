import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavBarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  showSearch?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ 
  searchQuery = '', 
  setSearchQuery = () => {}, 
  showSearch = true 
}) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 50, 
      backgroundColor: 'rgba(20, 20, 20, 0.95)', 
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(51, 51, 51, 0.2)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div className="flex justify-between items-center py-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-10" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <Link to="/home" className="text-4xl font-black text-netflix-red tracking-tight cursor-pointer hover:scale-105 transition-transform duration-200" style={{ 
              fontSize: '2.25rem', 
              fontWeight: '900', 
              color: '#E50914', 
              letterSpacing: '-0.025em', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              textDecoration: 'none'
            }}>
              FLIX
            </Link>
            <nav className="hidden md:flex space-x-8" style={{ display: 'flex', gap: '2rem' }}>
              <Link 
                to="/home" 
                className={`transition-colors font-medium text-base relative group ${isActive('/home') ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
                style={{ 
                  color: isActive('/home') ? 'white' : '#9CA3AF', 
                  fontWeight: '500', 
                  textDecoration: 'none' 
                }}
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className={`transition-colors font-medium text-base relative group ${isActive('/movies') ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
                style={{ 
                  color: isActive('/movies') ? 'white' : '#9CA3AF', 
                  fontWeight: '500', 
                  textDecoration: 'none' 
                }}
              >
                Movies
              </Link>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors font-medium text-base relative group" style={{ color: '#9CA3AF', fontWeight: '500', textDecoration: 'none' }}>
                Recently Added
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors font-medium text-base relative group" style={{ color: '#9CA3AF', fontWeight: '500', textDecoration: 'none' }}>
                My List
              </a>
            </nav>
          </div>

          {/* Search and User Controls */}
          <div className="flex items-center space-x-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search */}
            {showSearch && (
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-netflix-gray-dark border border-netflix-gray text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-netflix-red transition-all duration-200 w-64"
                  style={{
                    backgroundColor: '#222222',
                    border: '1px solid #333333',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    width: '16rem'
                  }}
                />
              </div>
            )}

            {/* Notifications */}
            <button className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-netflix-gray/30 relative" style={{ 
              color: '#D1D5DB', 
              background: 'none', 
              border: 'none', 
              padding: '0.5rem',
              borderRadius: '50%',
              position: 'relative',
              cursor: 'pointer'
            }}>
              <svg className="w-6 h-6" width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-netflix-red rounded-full" style={{
                position: 'absolute',
                top: '0.25rem',
                right: '0.25rem',
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#E50914',
                borderRadius: '50%'
              }}></span>
            </button>

            {/* User Avatar and Menu */}
            <div className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="w-8 h-8 bg-gradient-to-br from-netflix-red to-netflix-red-dark rounded-md flex items-center justify-center shadow-lg" style={{
                width: '2rem',
                height: '2rem',
                background: 'linear-gradient(to bottom right, #E50914, #B20710)',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <span className="text-white font-bold text-sm" style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>U</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors font-medium"
                style={{ 
                  color: '#D1D5DB', 
                  background: 'none', 
                  border: 'none', 
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
