# Testing the Custom Path Feature

## Setup for Testing

1. Create a test folder, for example: `D:\Movies`

2. **Important**: Create subfolders for each movie:
   - `D:\Movies\Movie1\`
   - `D:\Movies\Movie2\`
   - `D:\Movies\Movie3\`

3. In each subfolder, place:
   - A video file (for example `movie.mp4`)
   - A `source.txt` file

**Example structure:**
```
D:\Movies\
├── TestMovie1\
│   ├── test1.mp4
│   └── source.txt
├── TestMovie2\
│   ├── test2.mkv
│   └── source.txt
└── TestMovie3\
    ├── test3.avi
    └── source.txt
```

4. Each `source.txt` should contain this content:

```json
{
  "title": "Test Movie",
  "description": "This is a test movie to test the custom path feature",
  "year": 2023,
  "genre": ["Test", "Demo"],
  "duration": "5 min",
  "rating": "G",
  "quality": "1080p",
  "stars": 5.0,
  "thumbnail": "https://via.placeholder.com/300x450/141414/E50914?text=Test+Movie"
}
```

## Steps to Test

1. Start the FLIX application
2. Log in
3. Click on "Custom Path" next to "Sign Out"
4. Enter the path: `D:\Movies` (the main path, not a specific movie folder)
5. Click on "Scan"
6. Check the server console for debug information
7. Your movies should now appear in your library

## Debug Steps

If you get 0 movies, check in the server console:
1. Is the path being scanned correctly?
2. Are the subfolders being found?
3. Are video files and source.txt being found?
4. Are there JSON parsing errors?

## Expected Console Output

```
🔍 Scanning custom path: D:\Movies
📁 Found 3 items in directory: ['TestMovie1', 'TestMovie2', 'TestMovie3']
📂 Processing item: TestMovie1, isDirectory: true
📄 Directory contents for TestMovie1: ['test1.mp4', 'source.txt']
🎬 Movie file found: test1.mp4
📝 Source file found: source.txt
✅ Added movie: Test Movie 1
🎯 Total movies found: 3
```

## Expected Results

- The movie appears in both Home and Movies pages
- The metadata from source.txt is displayed correctly
- The movie is playable via the video player
- Source is shown as "Custom Path" in the player

## Troubleshooting

If the movie doesn't appear, check:
- **Folder structure**: Each movie must be in its own subfolder
- **File names**: `source.txt` must be named exactly like this (case-sensitive)
- **JSON format**: The source.txt must contain valid JSON
- **Video files**: Supported formats: .mp4, .mkv, .avi, .mov, .wmv
- **Accessibility**: Both files must be readable by the server
- **Console output**: Check the server console for specific error messages

## Common Errors

1. **Movies directly in main folder**: Movies must be in subfolders
2. **No source.txt**: Each movie folder must contain a source.txt
3. **Incorrect JSON**: Check if the JSON syntax is correct
4. **Case sensitivity**: `source.txt` must be written exactly like this
