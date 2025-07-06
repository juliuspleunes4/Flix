import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Movies from '../pages/Movies';
import Watch from '../pages/Watch';
import NotFound from '../pages/NotFound';
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
  
  return (
    <TransitionGroup component={null}>
      <PageTransition 
        key={location.pathname}
        classNames="page"
        timeout={300}
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <Movies />
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
  );
};

export default AnimatedRoutes;
