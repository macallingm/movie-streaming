# StreamLab — CMPT 315 streaming

React frontend plus an **Express + MongoDB** API. The catalog, auth, profiles, My List, watch progress, billing, and admin screens load from the API when it is reachable (`VITE_API_URL`, default `http://localhost:4000`). If the API is down, you will see an error banner and an empty catalog.

## Frontend (React + Vite)

### Install dependencies

From this project folder (`movie-streaming`):

```bash
npm install
```

### Run the React app

```bash
npm start
```

Or:

```bash
npm run dev
```

(`npm start` and `npm run dev` both start Vite.)

### Environment (frontend)

Copy `.env.example` to `.env` in the project root if you want to override:

- `VITE_API_URL` — base URL of the Express API (default `http://localhost:4000`).
- `VITE_TMDB_API_KEY` — optional; still used only for the **home hero** artwork.

You must be **signed in** (JWT from `POST /api/auth/login`) to use the app beyond the sign-in page. Seed a demo user with `SEED_DEMO_USER=true` in `server/.env` when running `npm run seed` in `server/`, then sign in with that email/password.

### Build (optional)

```bash
npm run build
```

---

## Backend (Node.js + Express + Mongoose)

Stack matches common patterns from the [Express.js guide](https://www.w3schools.com/nodejs/nodejs_express.asp) and [Mongoose getting started](https://mongoosejs.com/docs/). [Node frameworks overview](https://www.w3schools.com/nodejs/nodejs_frameworks.asp) — this API uses **Express** as the HTTP layer.

### Requirements

- [MongoDB](https://www.mongodb.com/) running locally or a connection string (e.g. MongoDB Atlas).

### Install and configure

```bash
cd server
npm install
copy .env.example .env
```

Edit `.env`: set `MONGODB_URI`, `JWT_SECRET`, and optionally `CLIENT_ORIGIN` (default `http://localhost:5173`).

To **import real movie metadata** (posters, titles, descriptions) from TMDb into MongoDB, add **`TMDB_API_KEY`** to **`server/.env`** (same value as frontend `VITE_TMDB_API_KEY` is fine). Then sign in as a **content_manager** user and use **Admin → Library → Import TMDb trending / now playing**. Titles get IDs like `TMDB-12345` and appear in Search, Movies, and **Play** in-app; video is still a **legal sample clip** for the course (TMDb does not provide full films).

### Seed data (plans + titles)

```bash
npm run seed
```

Optional demo account (example records: user + Premium + My List + progress on **T5001**):

```bash
set SEED_DEMO_USER=true
npm run seed
```

Default demo login: `macallingm@mymacewan.ca` / `password123` (override with `SEED_DEMO_EMAIL` / `SEED_DEMO_PASSWORD`).

Optional content manager (for admin API):

```bash
set SEED_ADMIN_EMAIL=manager@example.com
set SEED_ADMIN_PASSWORD=yourpassword
npm run seed
```

### Run the API

```bash
npm start
```

Dev (auto-restart on file changes):

```bash
npm run dev
```

Default base URL: `http://localhost:4000`.

### REST endpoints (summary)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | — | Liveness check |
| POST | `/api/auth/register` | — | Create user + default profile |
| POST | `/api/auth/login` | — | Returns JWT |
| GET | `/api/auth/me` | Bearer | Current user |
| GET | `/api/plans` | — | Active subscription plans |
| GET/PATCH/DELETE | `/api/profiles` … | Bearer | Profiles for logged-in user |
| GET/POST | `/api/subscriptions/me` | Bearer | One active subscription per user |
| PATCH | `/api/subscriptions/me/cancel` | Bearer | Cancel active subscription |
| GET | `/api/payments/me` | Bearer | Payment / invoice rows |
| GET | `/api/titles` | — | List / filter (`genre`, `year`, `type`, `q`) |
| GET | `/api/titles/:id` | — | By Mongo `_id` or `legacyKey` (e.g. `T5001`) |
| POST/PATCH/DELETE | `/api/titles` … | Bearer + **content_manager** | Manage catalog |
| GET/POST/DELETE | `/api/my-list` … | Bearer | Watchlist per profile |
| GET/PUT | `/api/watch-progress` | Bearer | List / upsert progress |
| GET | `/api/admin/users` | Bearer + **content_manager** | Subscribers |
| PATCH | `/api/admin/users/:id/status` | Bearer + **content_manager** | Suspend / activate |
| GET | `/api/admin/analytics/genres` | Bearer + **content_manager** | Progress summed by genre |

Send `Authorization: Bearer <token>` for protected routes.

---

## Frontend sitemap (React Router)

| Path | Description |
| --- | --- |
| `/` | Landing: hero + rows |
| `/search` | Search titles |
| `/movies` | Library with filters |
| `/watch/:movieid` | Player (query `season` / `episode` for shows) |
| `/profile` | Profiles + My List |
| `/billing` | Plan + invoices |
| `/signin` | Sign-in (prototype) |
| `/subscribe` | Plan + payment steps |
| `/admin` | Manager dashboard |
| `/admin/library` | Title CRUD (mock) |
| `/admin/users` | Subscribers list |
| `/admin/analytics` | Genre report (mock) |

## Authors

Mahar Macalling, Jordan Nguyen, Aldwin Enriquez (CMPT 315 group project).
