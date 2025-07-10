import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../utils/api';

interface NavBarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  showSearch?: boolean;
  onMoviesUpdate?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ 
  searchQuery = '', 
  setSearchQuery = () => {}, 
  showSearch = true,
  onMoviesUpdate = () => {}
}) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showCustomPathModal, setShowCustomPathModal] = useState(false);
  const [customPath, setCustomPath] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; count: number; error?: string } | null>(null);

  // Auto-scan function for saved paths
  const handleAutoScan = async (pathToScan: string) => {
    try {
      console.log('🔍 Auto-scanning saved custom path:', pathToScan);
      const result = await apiClient.scanCustomPath(pathToScan);
      console.log(`✅ Auto-scan completed: ${result.count} movies found`);
      onMoviesUpdate(); // Refresh the movies list
    } catch (error) {
      console.error('❌ Auto-scan failed:', error);
      // Don't show error to user for auto-scan, just log it
    }
  };

  // Load saved custom path from localStorage on component mount
  useEffect(() => {
    const savedPath = localStorage.getItem('flix-custom-path');
    if (savedPath) {
      setCustomPath(savedPath);
      console.log('🔄 Loaded saved custom path from localStorage:', savedPath);
      
      // Auto-scan the saved path if it exists
      handleAutoScan(savedPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save custom path to localStorage
  const saveCustomPath = (path: string) => {
    if (path.trim()) {
      localStorage.setItem('flix-custom-path', path.trim());
      console.log('💾 Saved custom path to localStorage:', path.trim());
    }
  };

  // Clear custom path from localStorage
  const clearSavedCustomPath = () => {
    localStorage.removeItem('flix-custom-path');
    console.log('🗑️ Cleared custom path from localStorage');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleCustomPathScan = async () => {
    if (!customPath.trim()) {
      setScanResult({ success: false, count: 0, error: 'Please enter a valid path' });
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await apiClient.scanCustomPath(customPath);
      setScanResult({ success: true, count: result.count });
      
      // Save the custom path to localStorage on successful scan
      saveCustomPath(customPath);
      
      onMoviesUpdate(); // Refresh the movies list
      
      // Close modal after successful scan (but keep the path)
      setTimeout(() => {
        setShowCustomPathModal(false);
        setScanResult(null);
      }, 2000);
    } catch (error) {
      setScanResult({ success: false, count: 0, error: error instanceof Error ? error.message : 'Failed to scan path' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleClearCustomMovies = async () => {
    try {
      await apiClient.clearCustomMovies();
      
      // Clear the saved custom path from localStorage
      clearSavedCustomPath();
      
      onMoviesUpdate(); // Refresh the movies list
      setShowCustomPathModal(false);
      setCustomPath('');
      setScanResult(null);
    } catch (error) {
      console.error('Failed to clear custom movies:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      width: '100%',
      zIndex: 50, 
      backgroundColor: 'rgba(20, 20, 20, 0.95)', 
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(51, 51, 51, 0.2)',
      transform: 'translateZ(0)', // Force hardware acceleration
      backfaceVisibility: 'hidden' // Prevent flickering
    }}>        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ 
          maxWidth: '80rem', 
          margin: '0 auto', 
          padding: '0 1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div className="flex justify-between items-center py-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-10" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              <Link to="/home" className="cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none" style={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                textDecoration: 'none',
                outline: 'none',
                boxShadow: 'none',
                marginLeft: '-1rem'
              }}>
                <img 
                  src="/src/assets/logo_flix.png" 
                  alt="FLIX" 
                  className="h-9"
                  style={{
                    height: '2.25rem',
                    width: 'auto'
                  }}
                />
              </Link>
            <nav className="hidden md:flex space-x-8" style={{ display: 'flex', gap: '2rem' }}>
              <Link 
                to="/home" 
                className={`transition-colors font-medium text-base relative group focus:outline-none ${isActive('/home') ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
                style={{ 
                  color: isActive('/home') ? 'white' : '#9CA3AF', 
                  fontWeight: '500', 
                  textDecoration: 'none',
                  outline: 'none',
                  boxShadow: 'none'
                }}
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className={`transition-colors font-medium text-base relative group focus:outline-none ${isActive('/movies') ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
                style={{ 
                  color: isActive('/movies') ? 'white' : '#9CA3AF', 
                  fontWeight: '500', 
                  textDecoration: 'none',
                  outline: 'none',
                  boxShadow: 'none'
                }}
              >
                Movies
              </Link>
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
                  className="bg-netflix-gray-dark border border-netflix-gray text-white px-4 py-2 rounded-md focus:outline-none transition-all duration-200 w-64"
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
                onClick={() => setShowCustomPathModal(true)}
                className="text-gray-300 hover:text-white transition-colors font-medium focus:outline-none"
                style={{ 
                  color: '#D1D5DB', 
                  background: 'none', 
                  border: 'none', 
                  fontWeight: '500',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: 'none'
                }}
              >
                Custom Path
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors font-medium focus:outline-none"
                style={{ 
                  color: '#D1D5DB', 
                  background: 'none', 
                  border: 'none', 
                  fontWeight: '500',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: 'none'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Path Modal */}
      {showCustomPathModal && (
        <div className="fixed bg-netflix-gray-dark p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl" style={{
          position: 'fixed',
          top: '5.5rem',
          right: '1rem',
          backgroundColor: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          maxWidth: '28rem',
          width: '28rem',
          zIndex: 60,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}>
          <h3 className="text-xl font-bold text-white mb-4" style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            Custom Movie Path
          </h3>
          <p className="text-gray-300 mb-4 text-sm" style={{
            color: '#D1D5DB',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            Enter the path to scan for movies. Each movie should be in its own folder with a source.txt file containing movie information.
          </p>
          
          <input
            type="text"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            placeholder="C:\Movies\Custom"
            className="w-full bg-netflix-gray border border-netflix-gray-light text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-netflix-red mb-2"
            style={{
              width: 'calc(100% - 2rem)',
              backgroundColor: '#2a2a2a',
              border: '1px solid #444',
              color: 'white',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '0.5rem'
            }}
          />
          
          {localStorage.getItem('flix-custom-path') && (
            <p className="text-xs text-gray-400 mb-4" style={{
              fontSize: '0.75rem',
              color: '#9CA3AF',
              marginBottom: '1rem'
            }}>
              💾 Auto-loaded from saved path
            </p>
          )}
          
          {scanResult && (
            <div className={`p-3 rounded-md mb-4 ${scanResult.success ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`} style={{
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              backgroundColor: scanResult.success ? '#064e3b' : '#7f1d1d',
              color: scanResult.success ? '#bbf7d0' : '#fecaca'
            }}>
              {scanResult.success ? (
                <span>✅ Found {scanResult.count} movies!</span>
              ) : (
                <span>❌ {scanResult.error}</span>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-3" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}>
            <button
              onClick={() => setShowCustomPathModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4b5563',
                color: 'white',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleClearCustomMovies}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#d97706',
                color: 'white',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
            <button
              onClick={handleCustomPathScan}
              disabled={isScanning}
              className="px-4 py-2 bg-netflix-red text-white rounded-md hover:bg-netflix-red-dark transition-colors disabled:opacity-50"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#E50914',
                color: 'white',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                opacity: isScanning ? 0.5 : 1
              }}
            >
              {isScanning ? 'Scanning...' : 'Scan'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
