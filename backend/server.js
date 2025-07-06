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
    if (!fs.existsSync(moviesDir)) {
      console.log('Movies directory does not exist, creating it...');
      fs.mkdirSync(moviesDir, { recursive: true });
      return res.json([]);
    }

    const files = fs.readdirSync(moviesDir);
    const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
    const movies = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return supportedFormats.includes(ext);
      })
      .map((file, index) => {
        const name = path.parse(file).name;
        const stats = fs.statSync(path.join(moviesDir, file));
        return {
          id: index + 1,
          title: name.replace(/[._-]/g, ' ').trim(),
          filename: file,
          url: `/movies/${encodeURIComponent(file)}`,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          thumbnail: `/api/thumbnail/${index + 1}` // Placeholder for future thumbnail support
        };
      });
    
    console.log(`Found ${movies.length} movies in ${moviesDir}`);
    res.json(movies);
  } catch (error) {
    console.error('Error reading movies directory:', error);
    res.status(500).json({ error: 'Unable to read movies directory', details: error.message });
  }
});

// Get movie by ID
app.get('/api/movies/:id', requireAuth, (req, res) => {
  const movieId = parseInt(req.params.id);
  const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
  
  try {
    if (!fs.existsSync(moviesDir)) {
      return res.status(404).json({ error: 'Movies directory not found' });
    }

    const files = fs.readdirSync(moviesDir);
    const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
    const videoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedFormats.includes(ext);
    });
    
    if (movieId > 0 && movieId <= videoFiles.length) {
      const file = videoFiles[movieId - 1];
      const filePath = path.join(moviesDir, file);
      const stats = fs.statSync(filePath);
      
      const movie = {
        id: movieId,
        title: path.parse(file).name.replace(/[._-]/g, ' ').trim(),
        filename: file,
        url: `/movies/${encodeURIComponent(file)}`,
        size: stats.size,
        modified: stats.mtime.toISOString()
      };
      res.json(movie);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error reading movies directory:', error);
    res.status(500).json({ error: 'Unable to read movies directory', details: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Server stats endpoint
app.get('/api/stats', requireAuth, (req, res) => {
  const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
  
  try {
    let movieCount = 0;
    let totalSize = 0;
    
    if (fs.existsSync(moviesDir)) {
      const files = fs.readdirSync(moviesDir);
      const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
      
      files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (supportedFormats.includes(ext)) {
          movieCount++;
          const stats = fs.statSync(path.join(moviesDir, file));
          totalSize += stats.size;
        }
      });
    }
    
    res.json({
      movieCount,
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      moviesDir,
      serverUptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting server stats:', error);
    res.status(500).json({ error: 'Unable to get server stats' });
  }
});

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

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
  console.log(`📁 Movies directory: ${path.join(__dirname, process.env.MOVIES_DIR || './public/movies')}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  
  // Check if movies directory exists
  const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
  if (!fs.existsSync(moviesDir)) {
    console.log(`⚠️  Movies directory doesn't exist, will create on first API call`);
  } else {
    try {
      const files = fs.readdirSync(moviesDir);
      const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
      const movieCount = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return supportedFormats.includes(ext);
      }).length;
      console.log(`🎥 Found ${movieCount} movies in directory`);
    } catch (error) {
      console.log(`⚠️  Could not read movies directory: ${error.message}`);
    }
  }
});
