# Custom Path Feature - FLIX

This feature allows you to load movies from a custom folder into FLIX.

## How does it work?

1. **Folder Structure**: Each movie must be in its own subfolder
2. **Required Files**: 
   - A video file (.mp4, .mkv, .avi, .mov, .wmv)
   - A `source.txt` file with movie metadata

## Example Folder Structure

```
C:\CustomMovies\
├── Movie1\
│   ├── movie1.mp4
│   └── source.txt
├── Movie2\
│   ├── movie2.mkv
│   └── source.txt
└── Movie3\
    ├── movie3.avi
    └── source.txt
```

## source.txt Format

The `source.txt` file must contain a JSON object with the following information:

```json
{
  "title": "Movie Title",
  "description": "Description of the movie",
  "year": 2023,
  "genre": ["Drama", "Action"],
  "duration": "120 min",
  "rating": "PG-13",
  "quality": "1080p",
  "stars": 4.2,
  "thumbnail": "https://example.com/poster.jpg"
}
```

### Required Fields
- `title`: The title of the movie

### Optional Fields
- `description`: Description of the movie
- `year`: Release year
- `genre`: Array of genres
- `duration`: Duration of the movie
- `rating`: Movie rating (PG, PG-13, R, etc.)
- `quality`: Video quality (1080p, 720p, etc.)
- `stars`: Star rating (0-5)
- `thumbnail`: URL to a poster image

## How to use

1. Click the "Custom Path" button next to "Sign Out" in the navbar
2. Enter the path to your custom movies folder
3. Click "Scan" to scan the folder
4. Movies with a valid `source.txt` file will be added to your library

## Important

- **Only movies with a `source.txt` file will be shown**
- The `source.txt` must contain valid JSON
- Movies are loaded temporarily (will disappear on server restart)
- Use "Clear" to remove all custom movies

## Troubleshooting

- **No movies found**: Check if each movie folder has a `source.txt` file
- **JSON Error**: Check if the `source.txt` contains valid JSON
- **Path not found**: Check if the entered path is correct and accessible
