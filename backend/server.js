const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Static files for movies
app.use('/movies', express.static(path.join(__dirname, 'public/movies')));

// Authentication middleware
const requireAuth = (req, res, next) => {
  const authCookie = req.signedCookies.flixAuth;
  if (authCookie === 'authenticated') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Routes

// Login endpoint
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (password === process.env.SHARED_PASSWORD) {
    res.cookie('flixAuth', 'authenticated', {
      signed: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    });
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('flixAuth');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Check authentication status
app.get('/api/auth/check', requireAuth, (req, res) => {
  res.json({ authenticated: true });
});

// Get list of movies
app.get('/api/movies', requireAuth, (req, res) => {
  const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
  
  try {
    const files = fs.readdirSync(moviesDir);
    const movies = files
      .filter(file => file.endsWith('.mp4') || file.endsWith('.mkv') || file.endsWith('.avi'))
      .map((file, index) => {
        const name = path.parse(file).name;
        return {
          id: index + 1,
          title: name.replace(/[._-]/g, ' ').trim(),
          filename: file,
          url: `/movies/${encodeURIComponent(file)}`,
          thumbnail: `/api/thumbnail/${index + 1}` // Placeholder for future thumbnail support
        };
      });
    
    res.json(movies);
  } catch (error) {
    console.error('Error reading movies directory:', error);
    res.status(500).json({ error: 'Unable to read movies directory' });
  }
});

// Get movie by ID
app.get('/api/movies/:id', requireAuth, (req, res) => {
  const movieId = parseInt(req.params.id);
  const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
  
  try {
    const files = fs.readdirSync(moviesDir);
    const videoFiles = files.filter(file => 
      file.endsWith('.mp4') || file.endsWith('.mkv') || file.endsWith('.avi')
    );
    
    if (movieId > 0 && movieId <= videoFiles.length) {
      const file = videoFiles[movieId - 1];
      const movie = {
        id: movieId,
        title: path.parse(file).name.replace(/[._-]/g, ' ').trim(),
        filename: file,
        url: `/movies/${encodeURIComponent(file)}`
      };
      res.json(movie);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error reading movies directory:', error);
    res.status(500).json({ error: 'Unable to read movies directory' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🎬 Flix Backend running on http://localhost:${PORT}`);
  console.log(`Movies directory: ${path.join(__dirname, process.env.MOVIES_DIR || './public/movies')}`);
});
