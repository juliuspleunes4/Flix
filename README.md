# 🎬 Flix

**Flix** is een zelfgehoste, minimalistische webapp voor het kijken van films uit je eigen collectie — veilig, snel, en zonder afhankelijkheid van commerciële platforms. Gebouwd voor persoonlijk gebruik door Julius (frontend) en Michiel (hardware/backend), met als doel om films op elk apparaat te kunnen streamen vanuit je eigen opslag.

---

## 🧠 Over het project

We vonden het omslachtig om films handmatig over te zetten of losse mediaspelers te gebruiken. Daarom hebben we **Flix** gemaakt: een web-based alternatief voor Netflix dat draait op onze eigen hardware. Toegang is alleen mogelijk via een gedeeld wachtwoord, zodat alleen wijzelf en eventueel familie/vrienden gebruik kunnen maken van het platform.

---

## 🧱 Tech Stack

### Frontend (Julius)
- **React** met **Vite** voor snelle performance
- **TailwindCSS** voor moderne styling
- **React Router** voor paginanavigatie
- **Video.js** voor een mooie, responsieve video player
- **Cookie-based auth** voor sessiebeheer

### Backend (Michiel)
- **Node.js** met **Express**
- Statische file serving vanuit lokale HDD (MP4-bestanden)
- Auth-verificatie op login
- Streaming via HTTP (optioneel uitbreidbaar met HLS/FFmpeg)

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
│           └── <film.mp4>
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedRoutes.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── NavBar.tsx
│   │   │   └── PageTransition.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Movies.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── Watch.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── utils/
│   │   │   └── api.ts
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── .gitignore
├── CHANGELOG.md
├── GETTING_STARTED.md
├── LICENSE.md
└── README.md
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
- ⏯️ Laatst bekeken voortgang onthouden
- 🧑‍🤝‍🧑 Gebruikersbeheer
- 📱 Responsieve mobiele weergave
- 💬 Recensies/reacties per film
- 🎞️ Subtitles en meerdere audiotracks
- 📈 Serverstatus-dashboard voor Michiel

## 👥 Auteurs

- **Julius** – Frontend, UI/UX, authenticatie, routing
- **Michiel** – Backend, media-opslag, streaming, hosting

📜 Licentie
- 🔒 Dit project is uitsluitend bedoeld voor privégebruik. Distributie van auteursrechtelijk beschermd materiaal buiten je huishouden is in strijd met de wetgeving.