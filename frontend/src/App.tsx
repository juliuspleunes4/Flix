import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './components/AnimatedRoutes';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-netflix-black text-white">
        <AnimatedRoutes />
      </div>
    </Router>
  );
};

export default App;
