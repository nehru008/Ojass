# NearHelp - Emergency Community Response Platform

## Folder Structure
```
nearhelp/
├── .env
├── index.html
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Map/
│   │   │   ├── LiveMap.jsx
│   │   │   └── MapMarker.jsx
│   │   ├── SOS/
│   │   │   ├── SOSButton.jsx
│   │   │   └── SOSForm.jsx
│   │   ├── Chat/
│   │   │   └── ChatPanel.jsx
│   │   ├── AI/
│   │   │   └── CrisisAssistant.jsx
│   │   ├── Responder/
│   │   │   └── ResponderAlert.jsx
│   │   └── shared/
│   │       ├── Navbar.jsx
│   │       └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── SOSBroadcast.jsx
│   │   ├── LiveMapView.jsx
│   │   ├── ResponderView.jsx
│   │   ├── Profile.jsx
│   │   └── AdminDashboard.jsx
│   ├── hooks/
│   │   ├── useSocket.js
│   │   ├── useGeolocation.js
│   │   └── useSOS.js
│   ├── socket/
│   │   └── socketClient.js
│   ├── services/
│   │   ├── api.js
│   │   ├── sosService.js
│   │   └── aiService.js
│   └── store/
│       ├── useSOSStore.js
│       ├── useUserStore.js
│       └── useMapStore.js
```

## Environment Setup
Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_SOCKET_URL=ws://localhost:4000
VITE_AI_API_URL=http://localhost:4000/api/ai
```

## Install & Run
```bash
npm create vite@latest nearhelp -- --template react
cd nearhelp
npm install
npm install socket.io-client leaflet react-leaflet axios zustand react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

## Steps to Run Locally
1. Clone repo
2. `npm install`
3. Copy `.env.example` → `.env` and set backend URLs
4. `npm run dev`
5. Open `http://localhost:5173`

> For demo mode, the app runs fully with simulated WebSocket events and mock data.



# Nearhelp App Demo

This repository contains a mock Nearhelp application based on the files provided by Claude.

## Setup

1. Clone repository (or copy files).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` from `.env.example` and adjust as needed.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser.

## Folder Structure

- `src/`
  - `components.jsx` — shared UI components
  - `pages.jsx` — application page components
  - `stores.js` — Zustand stores
  - `hooks.js` — custom React hooks
  - `services.js` — API and socket services
  - `socketClient.js` — singleton WebSocket client
  - `main.jsx` — application entry point
- `public/` (auto managed by Vite)
- `index.css` — global styles

The app is designed with a dark industrial aesthetic, mobile-first layout, and includes
mocked WebSocket and API logic for the demo.
