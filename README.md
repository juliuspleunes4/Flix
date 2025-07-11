# 🎬 Flix

**Flix** is een zelfgehoste, minimalistische webapp voor het kijken van films uit je eigen collectie — veilig, snel, en zonder afhankelijkheid van commerciële platforms. Gebouwd voor persoonlijk gebruik door Julius (frontend) en Michiel (hardware/backend), met als doel om films op elk apparaat te kunnen streamen vanuit je eigen opslag.

---

## 🧠 Over het project

We vonden het omslachtig om films handmatig over te zetten of losse mediaspelers te gebruiken. Daarom hebben we **Flix** gemaakt: een web-based alternatief voor Netflix dat draait op onze eigen hardware. Toegang is alleen mogelijk via een gedeeld wachtwoord, zodat alleen wijzelf en eventueel familie/vrienden gebruik kunnen maken van het platform.

---

## 🧱 Tech Stack

### Frontend + Backend (Julius)
- **React** met **Vite** voor snelle performance
- **TailwindCSS** voor moderne styling
- **React Router** voor paginanavigatie
- **Video.js** voor een mooie, responsieve video player
- **Cookie-based auth** voor sessiebeheer
- **Node.js** met **Express**
- Auth-verificatie op login
- Streaming via HTTP (optioneel uitbreidbaar met HLS/FFmpeg)

### Hardware (Michiel)
- Statische file serving vanuit lokale HDD (MP4-bestanden)
- NAS opzetten

### Overig
- Alle video’s worden lokaal gehost vanaf Michiel's machine/NAS
- Geen gebruik van externe API’s of cloudopslag
- Metadata kan handmatig worden toegevoegd indien gewenst

---

## 🔐 Beveiliging

Toegang tot Flix is afgeschermd via een gedeeld wachtwoord. Na succesvolle login wordt er een cookie geplaatst waarmee de gebruiker toegang krijgt tot de hoofdpagina en de films.

### Werking:
1. Bezoeker komt op `/login`
2. Voert correct wachtwoord in (geconfigureerd in `.env`)
3. Cookie wordt geplaatst met sessie-informatie
4. Bij elke route wordt toegang gecontroleerd
5. Fout wachtwoord = redirect naar loginpagina

---

## 🧭 Navigatie-overzicht

| Pagina            | Beschrijving                                     |
|-------------------|--------------------------------------------------|
| `/login`          | Invoeren van gedeeld wachtwoord                  |
| `/home`           | Overzicht van alle beschikbare films             |
| `/watch/:id`      | Videospeler voor het afspelen van geselecteerde film |
| `/404`            | Fallbackpagina voor ongeldige routes             |

---

## 📁 Mapstructuur

```
flix/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── .env
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
├── .gitignore
├── CHANGELOG.md
├── CUSTOM_PATH_FEATURE.md
├── example_source.txt
├── GETTING_STARTED.md
├── GOOGLE_DRIVE_SETUP.md
├── LICENSE.md
├── package.json
├── README.md
├── TESTING_GUIDE.md
└── TODO.txt
```

---

## ⚙️ Installatie (ontwikkelomgeving)

### 🔹 Backend installeren

```bash
cd backend
npm install
cp .env.example .env
# Voeg je gedeeld wachtwoord toe aan .env
npm start
```

### 🔹 Frontend installeren

```bash
cd frontend
npm install
npm run dev
```
Zorg dat frontend verzoeken stuurt naar het juiste IP-adres van Michiel’s backend. Dit kan lokaal zijn (http://localhost:3000) of via zijn externe IP/netwerknaam.

## 🧪 Testsetup

1. Zet een paar films in `backend/public/movies/`:

```
movies/
├── Interstellar.mp4
├── TheDarkKnight.mp4
└── Arrival.mp4
```

2. Start backend
3. Start frontend
4. Navigeer naar `/login`, voer wachtwoord in
5. Geniet van je eigen Netflix 🥳

## 💡 Mogelijke uitbreidingen

- ✅ Favorieten opslaan
- 🧑‍🤝‍🧑 Gebruikersbeheer
- 📱 Responsieve mobiele weergave
- 💬 Recensies/reacties per film
- 🎞️ Subtitles en meerdere audiotracks
- 📈 Serverstatus-dashboard voor Michiel

## 👥 Auteurs

- **Julius** – Frontend, UI/UX, authenticatie, routing, Backend, streaming, hosting
- **Michiel** – media-opslag, NAS

📜 Licentie
- 🔒 Dit project is uitsluitend bedoeld voor privégebruik. Distributie van auteursrechtelijk beschermd materiaal buiten je huishouden is in strijd met de wetgeving.