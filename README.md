# Real-Time Trading Dashboard

## Project Overview

A full-stack real-time trading dashboard built with **Node.js / Express** on the backend and **React / TypeScript** on the frontend. Prices update every second via WebSocket and are immediately reflected in the live chart and price display.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend runtime | Node.js + TypeScript |
| HTTP / REST | Express |
| Real-time | WebSocket (`ws`) |
| Frontend | React 18 + TypeScript + Vite |
| Routing | React Router v7 |
| Server state | TanStack React Query v5 |
| Charts | Recharts |
| Styling | CSS Modules |
| Formatting | Prettier (tabs, width 100) |
| Containerization | Docker + Docker Compose |

### Features

- **11 live instruments** across equities (AAPL, TSLA, MSFT, GOOGL, AMZN, NVDA, META), crypto (BTC-USD, ETH-USD), commodities (GOLD), and FX (EUR-USD)
- **Mock authentication** — credentials validated on the backend; session persisted in `localStorage`
- **Tickers page** — full instrument table with name, exchange, asset class, sector, live price and % change; click any row to open that ticker on the dashboard
- **Dashboard page** — live price chart (Recharts), price display with delta %, live/offline badge, and a selectable ticker list
- **Price alerts** — set upper/lower thresholds per ticker; toast notifications fire when a threshold is crossed
- **Deep-linkable ticker selection** — `/dashboard?ticker=NVDA` pre-selects that instrument on load

### Architecture

```
backend/src/
├── auth/                    # Mock login endpoint (POST /api/auth/login)
├── domain/                  # PriceEngine (random walk ±0.5%/tick) + shared types
├── storage/                 # InMemoryStore — circular history buffer, 100 pts/ticker
├── services/                # MarketDataService — orchestrates engine, store, events
├── controllers/             # Request handlers (no business logic)
├── routes/                  # Express router wiring
├── websocket/               # WebSocketServer — per-ticker subscription + broadcast
├── app.ts                   # Express factory (test-importable, no port binding)
├── config.ts                # Seed prices + ticker metadata + env config
└── index.ts                 # Composition root

frontend/src/
├── pages/
│   ├── Dashboard/           # Live chart page
│   ├── Tickers/             # Instrument table
│   └── Login/               # Sign-in form
├── components/
│   ├── AppLayout/           # Auth guard + Header + <Outlet />
│   ├── Header/              # Nav links + sign-out
│   ├── TickerList/          # Sidebar ticker list with live highlights
│   ├── PriceDisplay/        # Price, delta %, connection badge
│   ├── PriceChart/          # Recharts real-time line chart
│   ├── AlertsPanel/         # Create / manage price threshold alerts
│   └── ToastContainer/      # Toast notifications
├── router/index.tsx         # createBrowserRouter route definitions
├── context/                 # AuthContext, DashboardContext, AlertsContext, ToastContext
├── hooks/                   # useWebSocket, useMarketData, useDashboard, …
├── services/apiService.ts   # axios wrappers for all REST endpoints
├── types/                   # market.ts, auth.ts
└── utils/format.ts          # formatPrice — handles equity / crypto / FX decimal rules
```

### Running Locally

**Prerequisites:** Node.js 20+, npm 9+

```bash
# Backend
cd backend && npm install && npm run dev
# → http://localhost:3001

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
# → http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:3001`, so no CORS configuration is needed locally.

### Running with Docker

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:3001 |

The frontend container waits for the backend health check (`GET /health`) before starting.

### Demo Credentials

| Username | Password |
|----------|----------|
| admin | password123 |
| trader | trade456 |

---

## Assumptions and Trade-offs

| Area | Decision | Reasoning |
|------|----------|-----------|
| **Authentication** | Mock credentials stored as plain text in `backend/src/auth/mockUsers.ts`; no tokens or sessions | Satisfies the auth requirement without introducing JWT/session complexity out of scope for this assessment |
| **Storage** | All price history is held in memory; restarting the server resets it | Acceptable for a simulation — a production system would use a time-series DB such as InfluxDB or TimescaleDB |
| **Price simulation** | Each ticker runs its own `setInterval` with a ±0.5% random walk per tick | Independent ticks are more realistic; the overhead of 11 timers is negligible |
| **History cap** | `Array.shift()` is used to evict the oldest entry once the 100-point buffer is full | O(n) but n ≤ 100, making it effectively O(1); a ring buffer would only matter at much larger depths |
| **Server state** | TanStack React Query manages all fetched data (tickers, info, history) | Eliminates manual loading/error state boilerplate and provides free caching and deduplication |
| **Ticker deep-link** | `/dashboard?ticker=AAPL` is read once on mount via `useSearchParams`; subsequent selections are internal state | Keeps the URL shareable and bookmarkable without coupling the router to every ticker change |
| **Build-time env vars** | `VITE_API_BASE_URL` and `VITE_WS_URL` are embedded at Vite build time | Simple and standard for Vite projects; changing the backend host requires a rebuild (runtime injection via `/config.json` would allow single-image deployments) |
| **WebSocket on same port** | The `ws` library attaches to the existing `http.Server` | Avoids a second Docker port and simplifies the network configuration |

---

## Running Tests

### Backend

```bash
cd backend
npm test                # run all tests
npm run test:coverage   # with coverage report
```

| File | What it covers |
|------|---------------|
| `tests/unit/PriceEngine.test.ts` | Price generation, ±0.5% bounds, per-ticker isolation |
| `tests/unit/InMemoryStore.test.ts` | 100-point history cap, previous price tracking, copy semantics |
| `tests/unit/MarketDataService.test.ts` | Event emission, start/stop lifecycle, fake timers |
| `tests/integration/routes.test.ts` | All REST endpoints via supertest against `createApp()` |

### Frontend

```bash
cd frontend
npm test
```

Component tests for `TickerList` using **Vitest** + **Testing Library**.

---

## Bonus Features

Implemented three bonus features out of four required features.

- I have mocked user authentication in the backend side and provided a auth endpoint to mock the login behaviour.
- Used react-query to manage server state and the data layer and made advantage of it's data Caching system.
- Implemented price alerting system and utilized it into a price alert-panel component. 

### Authentication

- `POST /api/auth/login` validates credentials on the backend and returns `{ username, displayName }` or a `401` error.
- The frontend calls this endpoint from `apiService.ts`; no credentials are ever validated client-side.
- Session is persisted in `localStorage` and cleared on sign-out.
- All protected routes (`/dashboard`, `/tickers`) redirect to `/login` when unauthenticated via the `AppLayout` guard.

### Price Alerts

- Users can create upper or lower price threshold alerts for any ticker from the **Alerts Panel** on the dashboard sidebar.
- `AlertsContext` evaluates every incoming WebSocket price update against active alerts.
- When a threshold is crossed the alert fires a **toast notification** and is automatically removed from the active list.

### Extended Instrument Catalogue

- The original 3 tickers have been extended to **11 instruments** spanning four asset classes.
- A dedicated `GET /api/tickers/info` endpoint returns static metadata (name, sector, asset class, exchange, description, seed price) for each instrument.
- The **Tickers page** renders this data in a sortable table with live prices and percentage change, linking directly to the dashboard for each instrument.
