const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
// const { googleDriveMovies } = require('./movies.config'); // Commented out - Google Drive movies temporarily disabled
require('dotenv').config();

// Temporary empty array to replace Google Drive movies while commented out
const googleDriveMovies = []; // This will be empty until the Google Drive feature is re-enabled

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Static files for movies (keep for thumbnail generation)
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

// Static files for custom movies
app.use('/custom-movies', requireAuth, express.static('/'));

// Helper function to get proper MIME type for video files
function getVideoMimeType(extension) {
  const mimeTypes = {
    '.mp4': 'video/mp4',
    '.mkv': 'video/x-matroska',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
    '.webm': 'video/webm'
  };
  return mimeTypes[extension] || 'video/mp4';
}

// Video streaming endpoint with range request support
app.get('/api/stream/:id', requireAuth, (req, res) => {
  const movieId = req.params.id;
  const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
  
  console.log(`🎬 Streaming request for movie ID: ${movieId}`);
  
  try {
    // Handle both local and custom movies for streaming
    if (movieId.startsWith('local_')) {
      // Process local movies
      const localIndex = parseInt(movieId.replace('local_', '')) - 1;
      
      if (!fs.existsSync(moviesDir)) {
        return res.status(404).json({ error: 'Movies directory not found' });
      }

      const files = fs.readdirSync(moviesDir);
      const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
      const videoFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return supportedFormats.includes(ext);
      });
      
      if (localIndex < 0 || localIndex >= videoFiles.length) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      
      const file = videoFiles[localIndex];
      const filePath = path.join(moviesDir, file);
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;
      
      console.log(`📹 Streaming file: ${file}, Size: ${fileSize} bytes`);
      
      if (range) {
        // Parse range header
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        
        console.log(`📊 Range request: ${start}-${end}/${fileSize}`);
        
        // Create read stream for the requested range
        const file_stream = fs.createReadStream(filePath, { start, end });
        
        // Set appropriate headers for range request
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': getVideoMimeType(path.extname(file).toLowerCase()),
          'Cache-Control': 'no-cache'
        };
        
        res.writeHead(206, head);
        file_stream.pipe(res);
      } else {
        // No range header, send entire file
        console.log(`📹 Sending entire file: ${file}`);
        
        const head = {
          'Content-Length': fileSize,
          'Content-Type': getVideoMimeType(path.extname(file).toLowerCase()),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-cache'
        };
        
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
      }
    } else if (movieId.startsWith('custom_')) {
      // Redirect to custom streaming endpoint
      const customId = movieId.replace('custom_', '');
      return res.redirect(`/api/stream/custom/${customId}`);
    } else {
      return res.status(400).json({ error: 'Streaming only available for local and custom movies' });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ error: 'Unable to stream video', details: error.message });
  }
});

// Custom movie streaming endpoint
app.get('/api/stream/custom/:id', requireAuth, (req, res) => {
  const movieId = `custom_${req.params.id}`;
  
  console.log(`🎬 Custom streaming request for movie ID: ${movieId}`);
  
  try {
    const customMovie = customMovies.find(movie => movie.id === movieId);
    
    if (!customMovie) {
      return res.status(404).json({ error: 'Custom movie not found' });
    }
    
    const moviePath = path.join(customMovie.customPath, customMovie.filename);
    
    if (!fs.existsSync(moviePath)) {
      return res.status(404).json({ error: 'Movie file not found' });
    }
    
    const stat = fs.statSync(moviePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    console.log(`📹 Streaming custom file: ${customMovie.filename}, Size: ${fileSize} bytes`);
    
    if (range) {
      // Parse range header
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      console.log(`📊 Range request: ${start}-${end}/${fileSize}`);
      
      // Create read stream for the requested range
      const file_stream = fs.createReadStream(moviePath, { start, end });
      
      // Set appropriate headers for range request
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': getVideoMimeType(path.extname(customMovie.filename).toLowerCase()),
        'Cache-Control': 'no-cache'
      };
      
      res.writeHead(206, head);
      file_stream.pipe(res);
    } else {
      // No range header, send entire file
      console.log(`📹 Sending entire custom file: ${customMovie.filename}`);
      
      const head = {
        'Content-Length': fileSize,
        'Content-Type': getVideoMimeType(path.extname(customMovie.filename).toLowerCase()),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache'
      };
      
      res.writeHead(200, head);
      fs.createReadStream(moviePath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming custom video:', error);
    res.status(500).json({ error: 'Unable to stream custom video', details: error.message });
  }
});

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

// Get list of movies (hybrid: local + Google Drive)
app.get('/api/movies', requireAuth, (req, res) => {
  const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
  
  try {
    let localMovies = [];
    
    // Get local movies
    if (fs.existsSync(moviesDir)) {
      const files = fs.readdirSync(moviesDir);
      const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
      localMovies = files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return supportedFormats.includes(ext);
        })
        .map((file, index) => {
          const name = path.parse(file).name;
          const stats = fs.statSync(path.join(moviesDir, file));
          return {
            id: `local_${index + 1}`,
            title: name.replace(/[._-]/g, ' ').trim(),
            filename: file,
            url: `/movies/${encodeURIComponent(file)}`,
            source: 'local',
            size: stats.size,
            modified: stats.mtime.toISOString(),
            thumbnail: `/api/thumbnail/local_${index + 1}`,
            quality: 'Unknown',
            duration: 'Unknown',
            year: new Date(stats.mtime).getFullYear(),
            genre: ['Unknown'],
            rating: 'Not Rated',
            stars: 3.5, // Default star rating for local movies
            description: `Local movie: ${name}`
          };
        });
    }

    // Combine local movies with Google Drive movies and custom movies
    const allMovies = [
      ...localMovies,
      // ...googleDriveMovies.map(movie => ({  // Commented out - Google Drive movies temporarily disabled
      //   ...movie,
      //   modified: new Date().toISOString() // Use current time for Google Drive movies
      // })),
      ...customMovies
    ];
    
    console.log(`Found ${localMovies.length} local movies and ${customMovies.length} custom movies`);
    // console.log(`Found ${localMovies.length} local movies, ${googleDriveMovies.length} Google Drive movies, and ${customMovies.length} custom movies`); // Commented out - Google Drive movies temporarily disabled
    console.log(`Total: ${allMovies.length} movies available`);
    
    res.json(allMovies);
  } catch (error) {
    console.error('Error reading movies:', error);
    res.status(500).json({ error: 'Unable to read movies', details: error.message });
  }
});

// Get movie by ID (hybrid: local + Google Drive)
app.get('/api/movies/:id', requireAuth, (req, res) => {
  const movieId = req.params.id;
  const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
  
  console.log(`🎬 Requesting movie with ID: ${movieId}`);
  
  try {
    // Check if it's a Google Drive movie - Commented out temporarily
    // if (movieId.startsWith('gdrive_')) {
    //   console.log(`📂 Looking for Google Drive movie: ${movieId}`);
    //   const gdriveMovie = googleDriveMovies.find(movie => movie.id === movieId);
    //   if (gdriveMovie) {
    //     console.log(`✅ Found Google Drive movie: ${gdriveMovie.title}`);
    //     res.json({
    //       ...gdriveMovie,
    //       modified: new Date().toISOString()
    //     });
    //     return;
    //   } else {
    //     console.log(`❌ Google Drive movie not found: ${movieId}`);
    //     console.log(`Available Google Drive movies:`, googleDriveMovies.map(m => m.id));
    //   }
    // }
    
    // Check if it's a local movie
    if (movieId.startsWith('local_')) {
      console.log(`💾 Looking for local movie: ${movieId}`);
      const localIndex = parseInt(movieId.replace('local_', '')) - 1;
      
      if (!fs.existsSync(moviesDir)) {
        return res.status(404).json({ error: 'Movies directory not found' });
      }

      const files = fs.readdirSync(moviesDir);
      const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
      const videoFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return supportedFormats.includes(ext);
      });
      
      console.log(`📁 Found ${videoFiles.length} video files, looking for index ${localIndex}`);
      console.log(`📄 Video files:`, videoFiles);
      
      if (localIndex >= 0 && localIndex < videoFiles.length) {
        const file = videoFiles[localIndex];
        const filePath = path.join(moviesDir, file);
        const stats = fs.statSync(filePath);
        
        const movie = {
          id: movieId,
          title: path.parse(file).name.replace(/[._-]/g, ' ').trim(),
          filename: file,
          url: `/movies/${encodeURIComponent(file)}`,
          source: 'local',
          size: stats.size,
          modified: stats.mtime.toISOString(),
          quality: 'Unknown',
          duration: 'Unknown',
          year: new Date(stats.mtime).getFullYear(),
          genre: ['Unknown'],
          rating: 'Not Rated',
          description: `Local movie: ${path.parse(file).name}`
        };
        console.log(`✅ Found local movie: ${movie.title}`);
        res.json(movie);
        return;
      } else {
        console.log(`❌ Local movie index out of range: ${localIndex} (max: ${videoFiles.length - 1})`);
      }
    }
    
    // Check if it's a custom movie
    if (movieId.startsWith('custom_')) {
      console.log(`🎬 Looking for custom movie: ${movieId}`);
      const customMovie = customMovies.find(movie => movie.id === movieId);
      if (customMovie) {
        console.log(`✅ Found custom movie: ${customMovie.title}`);
        res.json(customMovie);
        return;
      } else {
        console.log(`❌ Custom movie not found: ${movieId}`);
        console.log(`Available custom movies:`, customMovies.map(m => m.id));
      }
    }

    // Movie not found
    console.log(`❌ Movie not found: ${movieId}`);
    res.status(404).json({ error: 'Movie not found' });
  } catch (error) {
    console.error('Error getting movie:', error);
    res.status(500).json({ error: 'Unable to get movie', details: error.message });
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

// Server stats endpoint (hybrid: local + Google Drive)
app.get('/api/stats', requireAuth, (req, res) => {
  const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
  
  try {
    let localMovieCount = 0;
    let localTotalSize = 0;
    
    // Count local movies
    if (fs.existsSync(moviesDir)) {
      const files = fs.readdirSync(moviesDir);
      const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
      
      files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (supportedFormats.includes(ext)) {
          localMovieCount++;
          const stats = fs.statSync(path.join(moviesDir, file));
          localTotalSize += stats.size;
        }
      });
    }
    
    // Count Google Drive movies - Commented out temporarily
    // const gdriveMovieCount = googleDriveMovies.length;
    // const gdriveTotalSize = googleDriveMovies.reduce((total, movie) => total + (movie.size || 0), 0);
    const gdriveMovieCount = 0; // Temporarily set to 0 while Google Drive movies are disabled
    const gdriveTotalSize = 0; // Temporarily set to 0 while Google Drive movies are disabled
    
    const totalMovieCount = localMovieCount + gdriveMovieCount;
    const totalSize = localTotalSize + gdriveTotalSize;
    
    res.json({
      totalMovieCount,
      localMovieCount,
      gdriveMovieCount,
      totalSize,
      localTotalSize,
      gdriveTotalSize,
      totalSizeFormatted: formatBytes(totalSize),
      localSizeFormatted: formatBytes(localTotalSize),
      gdriveSizeFormatted: formatBytes(gdriveTotalSize),
      moviesDir,
      serverUptime: process.uptime(),
      timestamp: new Date().toISOString(),
      sources: {
        local: {
          count: localMovieCount,
          size: localTotalSize,
          sizeFormatted: formatBytes(localTotalSize)
        },
        gdrive: {
          count: gdriveMovieCount,
          size: gdriveTotalSize,
          sizeFormatted: formatBytes(gdriveTotalSize)
        }
      }
    });
  } catch (error) {
    console.error('Error getting server stats:', error);
    res.status(500).json({ error: 'Unable to get server stats' });
  }
});

// Add or update Google Drive movie (admin endpoint) - Commented out temporarily
/*
app.post('/api/admin/gdrive-movies', requireAuth, (req, res) => {
  try {
    const { title, url, description, year, genre, duration, rating, quality, thumbnail } = req.body;
    
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }
    
    // Generate a unique ID
    const existingIds = googleDriveMovies.map(m => m.id);
    let newId = 1;
    while (existingIds.includes(`gdrive_${newId}`)) {
      newId++;
    }
    
    const newMovie = {
      id: `gdrive_${newId}`,
      title,
      description: description || `Google Drive movie: ${title}`,
      year: year || new Date().getFullYear(),
      genre: genre || ['Unknown'],
      duration: duration || 'Unknown',
      rating: rating || 'Not Rated',
      thumbnail: thumbnail || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(title),
      url,
      source: 'gdrive',
      size: 0, // Will be updated manually if needed
      quality: quality || 'Unknown'
    };
    
    googleDriveMovies.push(newMovie);
    
    // Note: In a production environment, you'd want to persist this to a database
    // For now, this will only persist until server restart
    console.log(`Added new Google Drive movie: ${title}`);
    
    res.json({ success: true, movie: newMovie });
  } catch (error) {
    console.error('Error adding Google Drive movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Get Google Drive movies only (admin endpoint)
app.get('/api/admin/gdrive-movies', requireAuth, (req, res) => {
  res.json(googleDriveMovies);
});

// Delete Google Drive movie (admin endpoint)
app.delete('/api/admin/gdrive-movies/:id', requireAuth, (req, res) => {
  try {
    const movieId = req.params.id;
    const index = googleDriveMovies.findIndex(movie => movie.id === movieId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    const deletedMovie = googleDriveMovies.splice(index, 1)[0];
    console.log(`Deleted Google Drive movie: ${deletedMovie.title}`);
    
    res.json({ success: true, deletedMovie });
  } catch (error) {
    console.error('Error deleting Google Drive movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});
*/

// Store custom movies
let customMovies = [];

// Helper function to scan custom path for movies
async function scanCustomPath(customPath) {
  const movies = [];
  
  try {
    console.log(`🔍 Scanning custom path: ${customPath}`);
    
    if (!fs.existsSync(customPath)) {
      throw new Error('Custom path does not exist');
    }
    
    const items = fs.readdirSync(customPath);
    console.log(`📁 Found ${items.length} items in directory:`, items);
    
    const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
    
    for (const item of items) {
      const itemPath = path.join(customPath, item);
      const stats = fs.statSync(itemPath);
      
      console.log(`📂 Processing item: ${item}, isDirectory: ${stats.isDirectory()}`);
      
      if (stats.isDirectory()) {
        // Check if this directory contains a movie file and source.txt
        const dirContents = fs.readdirSync(itemPath);
        console.log(`📄 Directory contents for ${item}:`, dirContents);
        
        const movieFile = dirContents.find(file => {
          const ext = path.extname(file).toLowerCase();
          return supportedFormats.includes(ext);
        });
        
        // Look for source.txt (case-insensitive) or source.txt.txt (common Windows issue)
        const sourceFile = dirContents.find(file => {
          const fileName = file.toLowerCase();
          return fileName === 'source.txt' || fileName === 'source.txt.txt';
        });
        
        console.log(`🎬 Movie file found: ${movieFile}`);
        console.log(`📝 Source file found: ${sourceFile}`);
        
        // Only include if both movie file and source.txt exist
        if (movieFile && sourceFile) {
          try {
            const sourceContent = fs.readFileSync(path.join(itemPath, sourceFile), 'utf8');
            console.log(`📖 Source content for ${item}:`, sourceContent);
            const movieData = JSON.parse(sourceContent);
            
            const movieStats = fs.statSync(path.join(itemPath, movieFile));
            
            const movie = {
              id: `custom_${Buffer.from(itemPath).toString('base64')}`,
              title: movieData.title || path.parse(movieFile).name,
              filename: movieFile,
              url: `/custom-movies/${encodeURIComponent(path.relative(customPath, itemPath))}/${encodeURIComponent(movieFile)}`,
              source: 'custom',
              size: movieStats.size,
              modified: movieStats.mtime.toISOString(),
              thumbnail: movieData.thumbnail || `/api/thumbnail/custom_${Buffer.from(itemPath).toString('base64')}`,
              description: movieData.description || `Custom movie: ${movieData.title || path.parse(movieFile).name}`,
              year: movieData.year || new Date(movieStats.mtime).getFullYear(),
              genre: movieData.genre || ['Unknown'],
              duration: movieData.duration || 'Unknown',
              rating: movieData.rating || 'Not Rated',
              quality: movieData.quality || 'Unknown',
              stars: movieData.stars || 3.5,
              customPath: itemPath
            };
            
            movies.push(movie);
            console.log(`✅ Added movie: ${movie.title}`);
          } catch (error) {
            console.error(`❌ Error reading source.txt for ${item}:`, error);
            // Skip this movie if source.txt is invalid
          }
        } else {
          console.log(`⚠️ Skipping ${item} - missing movie file or source.txt`);
        }
      }
    }
    
    console.log(`🎯 Total movies found: ${movies.length}`);
    return movies;
  } catch (error) {
    console.error('❌ Error scanning custom path:', error);
    throw error;
  }
}

// Custom path scanning endpoint
app.post('/api/custom-path', requireAuth, async (req, res) => {
  try {
    const { customPath } = req.body;
    
    if (!customPath) {
      return res.status(400).json({ error: 'Custom path is required' });
    }
    
    console.log(`📁 Scanning custom path: ${customPath}`);
    
    const movies = await scanCustomPath(customPath);
    customMovies = movies;
    
    console.log(`✅ Found ${movies.length} movies in custom path`);
    res.json({ success: true, movies, count: movies.length });
  } catch (error) {
    console.error('Error scanning custom path:', error);
    res.status(500).json({ error: 'Failed to scan custom path', details: error.message });
  }
});

// Clear custom movies
app.delete('/api/custom-path', requireAuth, (req, res) => {
  customMovies = [];
  console.log('🗑️  Cleared custom movies');
  res.json({ success: true, message: 'Custom movies cleared' });
});

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

// Thumbnail generation endpoint
app.get('/api/thumbnail/:id', requireAuth, (req, res) => {
  const movieId = req.params.id;
  
  try {
    // Extract movie title from ID
    let title = 'Movie';
    if (movieId.startsWith('local_')) {
      const movieIndex = parseInt(movieId.replace('local_', '')) - 1;
      const moviesDir = path.join(__dirname, process.env.MOVIES_DIR || './public/movies');
      
      if (fs.existsSync(moviesDir)) {
        const supportedFormats = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
        const files = fs.readdirSync(moviesDir)
          .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return supportedFormats.includes(ext);
          });
        
        if (files[movieIndex]) {
          title = path.parse(files[movieIndex]).name.replace(/[._-]/g, ' ').trim();
        }
      }
    }
    
    // Create a nice movie poster style placeholder
    const placeholderUrl = `https://via.placeholder.com/300x450/141414/E50914?text=${encodeURIComponent(title)}&font=Arial`;
    res.redirect(placeholderUrl);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    // Fallback placeholder
    const fallbackUrl = 'https://via.placeholder.com/300x450/141414/6B7280?text=Movie';
    res.redirect(fallbackUrl);
  }
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
