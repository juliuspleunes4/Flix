# 🚀 Flix - Getting Started

## Quick Start Guide

### 1. Backend Setup

```bash
cd backend
npm install
```

Copy the environment file:
```bash
copy .env.example .env
```

Edit `.env` and set your password:
```env
SHARED_PASSWORD=your-secure-password-here
```

Start the backend:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Add Movies

You have two options for adding movies to FLIX:

#### Option A: Default Movies Directory (Simple)
Place your movie files (.mp4, .mkv, .avi, .mov, .wmv) in:
```
backend/public/movies/
```

Example structure:
```
backend/public/movies/
├── Interstellar.mp4
├── The_Dark_Knight.mkv
└── Arrival.avi
```

#### Option B: Custom Path Feature (Advanced)
Use the Custom Path feature to scan movies from any location with rich metadata support.

**Setup Custom Path movies:**
1. Create a folder structure like this:
```
C:\MyMovies\
├── Interstellar\
│   ├── movie.mp4
│   └── info.json
├── The Dark Knight\
│   ├── movie.mkv
│   └── info.json
└── Arrival\
    ├── movie.avi
    └── info.json
```

2. Create an `info.json` file for each movie with JSON metadata:
```json
{
  "title": "Interstellar",
  "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  "year": 2014,
  "genre": ["Drama", "Sci-Fi"],
  "duration": "169 min",
  "rating": "PG-13",
  "quality": "1080p",
  "stars": 4.8
}
```

3. In FLIX, click "Custom Path" → Enter your folder path → Click "Scan"

**Supported video formats:** .mp4, .mkv, .avi, .mov, .wmv

### 4. Access Flix

1. Open your browser to `http://localhost:5173`
2. Enter your password from the `.env` file
3. Browse and watch your movies!

## Development Commands

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server (with nodemon)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Common Issues

1. **"Cannot connect to backend"**
   - Make sure backend is running on port 3000
   - Check if `.env` file exists in backend folder

2. **"No movies found"**
   - **Default movies**: Add movie files to `backend/public/movies/`
   - **Custom Path movies**: Ensure each movie folder has an `info.json` file with valid JSON
   - Supported formats: .mp4, .mkv, .avi, .mov, .wmv

3. **"Login failed"**
   - Check password in `backend/.env`
   - Make sure backend is running

4. **Video won't play**
   - Ensure video file is in correct format
   - Check browser console for errors

5. **Custom Path issues**
   - **"No movies found"**: Check if each movie folder has an `info.json` file
   - **"JSON Error"**: Verify `info.json` contains valid JSON format
   - **"Path not found"**: Ensure the path exists and is accessible
   - **Movies disappear**: Custom Path movies are temporary and cleared on server restart

### Port Configuration

If you need to change ports:

**Backend** (edit `backend/.env`):
```env
PORT=3000
```

**Frontend** (edit `frontend/vite.config.ts`):
```typescript
server: {
  port: 5173,
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name flix-backend
   ```

### Frontend
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder with your web server

### Recommended Setup
- Use nginx as reverse proxy
- Set up HTTPS with Let's Encrypt
- Configure firewall to only allow access from your network

## Security Notes

- Change the default password in `.env`
- Only share access with trusted family/friends
- Consider setting up VPN access for remote viewing
- This is designed for personal use only

## Key Features

### 🎬 Movie Management
- **Default Movies**: Simple file-based movie storage
- **Custom Path**: Advanced movie organization with metadata support
- **Multiple Formats**: Support for MP4, MKV, AVI, MOV, WMV
- **Auto-Detection**: Automatic movie discovery and loading
- **Persistent Storage**: Custom paths are saved for future sessions

### 🔐 Security & Access
- Password-protected access
- Cookie-based authentication
- Personal use design

### 📱 User Experience
- Responsive design (desktop & mobile)
- Search functionality
- Clean, Netflix-like interface
- Information pages with comprehensive documentation

## Tech Stack Summary

- **Backend**: Node.js + Express
- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Video**: HTML5 video element
- **Auth**: Cookie-based sessions
- **File serving**: Express static middleware

Happy watching! 🎬
