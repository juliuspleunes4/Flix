import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Movies from '../pages/Movies';
import Watch from '../pages/Watch';
import NotFound from '../pages/NotFound';
import CustomPathInfo from '../pages/CustomPathInfo';
import NavBar from './NavBar';
import PageTransition from './PageTransition';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isLoginPage = location.pathname === '/login';
  
  const handleMoviesUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      {/* Persistent NavBar - only show on authenticated pages */}
      {!isLoginPage && (
        <NavBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          showSearch={location.pathname === '/home' || location.pathname === '/movies'}
          onMoviesUpdate={handleMoviesUpdate}
        />
      )}
      
      {/* Animated content area */}
      <TransitionGroup component={null}>
        <PageTransition 
          key={location.pathname}
          timeout={300}
        >
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} refreshTrigger={refreshTrigger} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <Movies searchQuery={searchQuery} setSearchQuery={setSearchQuery} refreshTrigger={refreshTrigger} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/custom-path-info"
              element={
                <ProtectedRoute>
                  <CustomPathInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watch/:id"
              element={
                <ProtectedRoute>
                  <Watch />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </TransitionGroup>
    </div>
  );
};

export default AnimatedRoutes;
