# Hybrid Movie Storage Setup

FLIX now supports both local movies and Google Drive movies! This allows you to stream movies from both your local server and Google Drive links.

## How It Works

The system combines:
- **Local Movies**: Files stored in the `backend/public/movies/` folder
- **Google Drive Movies**: Configured links to Google Drive files

## Setting Up Google Drive Movies

### Method 1: Manual Configuration (Recommended)

1. **Upload your movie to Google Drive**
2. **Get the shareable link**:
   - Right-click the movie file → Share
   - Copy the link (it looks like: `https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing`)
   
3. **Convert to direct download link**:
   - Change from: `https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing`
   - To: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`

4. **Add to configuration**:
   - Edit `backend/movies.config.js`
   - Add your movie to the `googleDriveMovies` array:

```javascript
{
  id: 'gdrive_3', // Use next available number
  title: 'Your Movie Title',
  description: 'Movie description',
  year: 2023,
  genre: ['Action', 'Adventure'],
  duration: '120 min',
  rating: 'PG-13',
  thumbnail: 'https://path-to-movie-poster.jpg', // Optional
  url: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID',
  source: 'gdrive',
  size: 2147483648, // Size in bytes (optional)
  quality: '1080p'
}
```

5. **Restart the server** to load the new movie

### Method 2: API Endpoints (Advanced)

You can also add movies via API calls:

```bash
# Add a new Google Drive movie
curl -X POST http://localhost:3000/api/admin/gdrive-movies \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Your Movie Title",
    "url": "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID",
    "description": "Movie description",
    "year": 2023,
    "genre": ["Action"],
    "duration": "120 min",
    "rating": "PG-13",
    "quality": "1080p"
  }'

# List all Google Drive movies
curl http://localhost:3000/api/admin/gdrive-movies

# Delete a Google Drive movie
curl -X DELETE http://localhost:3000/api/admin/gdrive-movies/gdrive_1
```

## Important Notes

### Google Drive Limitations
- **15GB free storage** (or paid plan limits)
- **Bandwidth limits** - Google may throttle large downloads
- **Download quotas** - Google may block downloads if too many users access the same file
- **Sharing permissions** - Make sure your files are set to "Anyone with the link can view"

### File Size Recommendations
- For free Google Drive: Keep movies under 2GB each
- Use lower quality for larger files
- Consider splitting very large movies

### Security
- Google Drive links are NOT private - anyone with the link can download
- Don't upload copyrighted content
- Consider your privacy when sharing links

## Movie Sources in the App

Movies will show a source indicator:
- **Local**: Stored on your server
- **Google Drive**: Streamed from Google Drive

## Troubleshooting

### Movie won't play from Google Drive
1. Check if the Google Drive link is correct
2. Verify the file is shared publicly
3. Try the direct download link in your browser
4. Check Google Drive bandwidth limits

### Performance Issues
- Google Drive streaming may be slower than local files
- Consider downloading frequently watched movies locally
- Use appropriate quality settings for your internet speed

## Future Migration

When you set up your dedicated server:
1. Keep the hybrid system
2. Gradually move Google Drive movies to local storage
3. Update the configuration to remove Google Drive entries
4. The system will seamlessly transition

## Example Configuration

Here's a complete example of `movies.config.js`:

```javascript
const googleDriveMovies = [
  {
    id: 'gdrive_1',
    title: 'The Matrix',
    description: 'A computer hacker learns about the true nature of reality.',
    year: 1999,
    genre: ['Action', 'Sci-Fi'],
    duration: '136 min',
    rating: 'R',
    thumbnail: 'https://example.com/matrix-poster.jpg',
    url: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_1',
    source: 'gdrive',
    size: 2147483648,
    quality: '1080p'
  },
  {
    id: 'gdrive_2',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    year: 2010,
    genre: ['Action', 'Thriller', 'Sci-Fi'],
    duration: '148 min',
    rating: 'PG-13',
    thumbnail: 'https://example.com/inception-poster.jpg',
    url: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_2',
    source: 'gdrive',
    size: 3221225472,
    quality: '720p'
  }
];

module.exports = { googleDriveMovies };
```

Happy streaming! 🎬
