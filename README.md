# 🎬 Flix

**Flix** is a self-hosted, minimalist web app for watching movies from your own collection — secure, fast, and without reliance on commercial platforms. Built for personal use by J.J.G. Pleunes (frontend + backend), with the goal of streaming movies from your own storage to any device.

---

## 🧠 About the project

We found it cumbersome to manually transfer movies or use separate media players. That's why we created **Flix**: a web-based alternative to Netflix that runs on our own hardware. Access is only possible via a shared password, so only we and possibly family/friends can use the platform.

---

## 🧱 Tech Stack
### Frontend + Backend 
- **React** with **Vite** for fast performance
- **TailwindCSS** for modern styling
- **React Router** for page navigation
- **Video.js** for a sleek, responsive video player
- **Cookie-based auth** for session management
- **Node.js** with **Express**
- Auth verification on login
- Streaming via HTTP (optionally extendable with HLS/FFmpeg)
### Hardware (Planned Feature)

*NAS integration is not yet implemented, but support for connecting to a NAS is planned for a future release.*
- Static file serving from local HDD (MP4 files)
- NAS setup

### Other
- All videos are hosted locally
- No use of external APIs or cloud storage
- Metadata can be added manually if desired

---

## 🔐 Security

Access to Flix is protected via a shared password. After successful login, a cookie is placed that gives the user access to the main page and movies.

### How it works:
1. Visitor comes to `/login`
2. Enters correct password (configured in `.env`)
3. Cookie is placed with session information
4. Access is checked on every route
5. Wrong password = redirect to login page

---

## 🧭 Navigation Overview

| Page                  | Description                                            |
|-----------------------|------------------------------------------------------- |
| `/login`              | Enter shared password                                  |
| `/home`               | Overview of all available movies                       |
| `/movies`             | Extended movie library with search functionality       |
| `/watch/:id`          | Video player for playing selected movie                |
| `/custom-path-info`   | Information page about Custom Path functionality       |
| `/404`                | Fallback page for invalid routes                       |

---

## 📁 File Structure

```
flix/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── movies.config.js
│   └── public/
│       └── movies/
│           └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedRoutes.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── NavBar.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   └── VideoPlayer.tsx
│   │   ├── pages/
│   │   │   ├── CustomPathInfo.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Movies.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── Watch.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   └── recentMovies.ts
│   │   ├── assets/
│   │   │   ├── android-chrome-192x192.png
│   │   │   ├── android-chrome-512x512.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   ├── favicon.ico
│   │   │   ├── logo_flix.png
│   │   │   ├── profile_picture.png
│   │   │   ├── profile_picture_user.png
│   │   │   └── react.svg
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── styles.css
│   │   └── vite-env.d.ts
│   ├── public/
│   │   └── vite.svg
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── docs/
│   ├── CHANGELOG.md
│   ├── CUSTOM_PATH_FEATURE.md
│   ├── GETTING_STARTED.md
│   ├── GOOGLE_DRIVE_SETUP.md
│   ├── TESTING_GUIDE.md
│   ├── TODO.txt
│   └── example_source.txt
├── .gitignore
├── LICENSE.md
├── package.json
└── README.md
```

---

## ⚙️ Installation (development environment)

### 🔹 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Add your shared password to .env
npm start
```

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testsetup

1. Place a few movies in `backend/public/movies/`:

```
movies/
├── Interstellar.mp4
├── TheDarkKnight.mp4
└── Arrival.mp4
```

2. Start backend
3. Start frontend
4. Navigate to `/login`, enter password
5. Enjoy your own Netflix 🥳

### 🛠️ Custom Path Functionality

Flix now supports a **Custom Path** feature that allows you to scan and add your own movie collections to the library. This functionality is perfect for organizing personal video collections.

### ✨ Key features:
- **Automatic detection** of video files in specified directories
- **Support for multiple formats**: MP4, MKV, AVI, MOV, WMV
- **Metadata from JSON**: Each movie must contain a `source.txt` file with movie information
- **Persistent storage**: Scanned paths are stored locally for future sessions
- **Responsive interface**: Works on both desktop and mobile devices

### 📁 Required directory structure:
```
Your Custom Path/
├── Movie 1/
│   ├── movie.mp4
│   └── source.txt
├── Movie 2/
│   ├── movie.mkv
│   └── source.txt
└── Movie 3/
    ├── movie.avi
    └── source.txt
```

### 📝 Example source.txt:
```json
{
  "title": "The Matrix",
  "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
  "year": 1999,
  "genre": ["Action", "Sci-Fi", "Thriller"],
  "duration": "136 min",
  "rating": "R",
  "quality": "1080p",
  "stars": 4.5
}
```

### 🔗 Access to information:
Comprehensive documentation about setting up and using Custom Path is available via the **information page** (`/custom-path-info`) accessible through the "?" button in the Custom Path modal.<br>


## 💡 Possible Extensions

- ✅ Save favorites
- 🧑‍🤝‍🧑 User management
- 📱 Responsive mobile view
- 💬 Reviews/comments per movie
- 🎞️ Subtitles and multiple audio tracks
- 📈 Server status dashboard for NAS

## 👥 Authors

- [Julius](https://linkedin.com/in/juliuspleunes) – Frontend, UI/UX, authentication, routing, Backend, streaming, hosting

📜 License
- 🔒 This project is intended for private use only. Distribution of copyrighted material outside your household is against the law.