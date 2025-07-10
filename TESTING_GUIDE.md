# Test de Custom Path Feature

## Setup voor Testing

1. Maak een test folder aan bijvoorbeeld: `D:\Movies`

2. **Belangrijk**: Maak subfolders voor elke film:
   - `D:\Movies\Movie1\`
   - `D:\Movies\Movie2\`
   - `D:\Movies\Movie3\`

3. In elke subfolder, plaats:
   - Een video bestand (bijvoorbeeld `movie.mp4`)
   - Een `source.txt` bestand

**Voorbeeld structuur:**
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

4. Elke `source.txt` moet deze inhoud hebben:

```json
{
  "title": "Test Movie",
  "description": "Dit is een test film om de custom path feature te testen",
  "year": 2023,
  "genre": ["Test", "Demo"],
  "duration": "5 min",
  "rating": "G",
  "quality": "1080p",
  "stars": 5.0,
  "thumbnail": "https://via.placeholder.com/300x450/141414/E50914?text=Test+Movie"
}
```

## Stappen om te testen

1. Start de FLIX applicatie
2. Log in
3. Klik op "Custom Path" naast "Sign Out"
4. Voer het pad in: `D:\Movies` (het hoofdpad, niet een specifieke film folder)
5. Klik op "Scan"
6. Controleer de server console voor debug informatie
7. Je films zouden nu moeten verschijnen in je library

## Debug Stappen

Als je 0 films krijgt, controleer in de server console:
1. Wordt het pad correct gescand?
2. Worden de subfolders gevonden?
3. Worden video bestanden en source.txt gevonden?
4. Zijn er JSON parsing errors?

## Verwachte Console Output

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

## Verwachte Resultaten

- De film verschijnt in zowel Home als Movies pagina
- De metadata uit source.txt wordt correct getoond
- De film is afspeelbaar via de video player
- Source wordt getoond als "Custom Path" in de player

## Troubleshooting

Als de film niet verschijnt, controleer:
- **Folder structuur**: Elke film moet in een eigen subfolder zitten
- **Bestandsnamen**: `source.txt` moet exact zo heten (case-sensitive)
- **JSON format**: De source.txt moet geldige JSON bevatten
- **Video bestanden**: Ondersteunde formaten: .mp4, .mkv, .avi, .mov, .wmv
- **Toegankelijkheid**: Beide bestanden moeten leesbaar zijn voor de server
- **Console output**: Controleer de server console voor specifieke foutmeldingen

## Veel Voorkomende Fouten

1. **Films direct in hoofdfolder**: Films moeten in subfolders staan
2. **Geen source.txt**: Elke film folder moet een source.txt bevatten
3. **Onjuiste JSON**: Controleer of de JSON syntaxis correct is
4. **Case sensitivity**: `source.txt` moet exact zo geschreven zijn
