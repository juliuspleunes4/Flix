# Custom Path Feature - FLIX

Deze feature stelt je in staat om films uit een custom folder te laden in FLIX.

## Hoe werkt het?

1. **Folder Structuur**: Elke film moet in een eigen subfolder zitten
2. **Vereiste Bestanden**: 
   - Een video bestand (.mp4, .mkv, .avi, .mov, .wmv)
   - Een `source.txt` bestand met film metadata

## Voorbeeld Folder Structuur

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

Het `source.txt` bestand moet een JSON object bevatten met de volgende informatie:

```json
{
  "title": "Film Titel",
  "description": "Beschrijving van de film",
  "year": 2023,
  "genre": ["Drama", "Action"],
  "duration": "120 min",
  "rating": "PG-13",
  "quality": "1080p",
  "stars": 4.2,
  "thumbnail": "https://example.com/poster.jpg"
}
```

### Vereiste Velden
- `title`: De titel van de film

### Optionele Velden
- `description`: Beschrijving van de film
- `year`: Uitkomstjaar
- `genre`: Array van genres
- `duration`: Duur van de film
- `rating`: Film rating (PG, PG-13, R, etc.)
- `quality`: Video kwaliteit (1080p, 720p, etc.)
- `stars`: Sterren rating (0-5)
- `thumbnail`: URL naar een poster afbeelding

## Hoe te gebruiken

1. Klik op de "Custom Path" knop naast "Sign Out" in de navbar
2. Voer het pad in naar je custom movies folder
3. Klik op "Scan" om de folder te scannen
4. Films met een geldig `source.txt` bestand worden toegevoegd aan je library

## Belangrijk

- **Alleen films met een `source.txt` bestand worden getoond**
- De `source.txt` moet geldige JSON bevatten
- Films worden tijdelijk geladen (verdwijnen bij server restart)
- Gebruik "Clear" om alle custom films te verwijderen

## Troubleshooting

- **Geen films gevonden**: Controleer of elke film folder een `source.txt` bestand heeft
- **JSON Error**: Controleer of de `source.txt` geldige JSON bevat
- **Pad niet gevonden**: Controleer of het ingevoerde pad correct is en toegankelijk
