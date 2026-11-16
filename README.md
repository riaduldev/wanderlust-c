# Wanderlast 🌍

A full-stack travel booking web app built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui** — browse destinations, book trips, and manage your profile.

## Features

- **Destination catalogue** with client-side filtering, sorting, and image fallbacks
- **Destination detail pages** with booking flow
- **Bookings page** — bookings persist in browser `localStorage` (with cross-tab sync)
- **Add destination form** — posts to the external Express API
- **Authentication** (better-auth) — email + password and Google sign-in
- **Protected routes** — `/profile`, destination detail/edit, `/add-destinations`, and `/bookings` require sign-in (edge proxy + server-side session check, see [Route protection](#route-protection))
- **Profile page** — live travel statistics derived from your bookings, editable display name
- Static info pages (Help, Terms, Privacy) plus global error/404 boundaries

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 (CSS-first tokens), shadcn `base-nova` on @base-ui/react |
| Auth | [better-auth](https://better-auth.com) + `@better-auth/mongo-adapter` |
| DB | MongoDB (mongoose for the local API, raw `mongodb` driver for auth) |
| Fonts | Josefin Sans via `next/font` |

## Getting Started

### Prerequisites

- Node.js 20+
- A running MongoDB instance (local or Atlas)
- The Express API backend (see below)

### 1. Environment variables

Create a `.env` file in the project root (gitignored — no `.env.example` is committed) and fill in the values:

| Variable | Used by | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | `/api/travel-packages` route | Mongo connection string |
| `MONGODB_DB` | `/api/travel-packages` route | Optional db name override |
| `DESTINATIONS_API_URL` | Server-side fetches | Express API base URL |
| `NEXT_PUBLIC_API_URL` | Client components | Express API base URL |
| `BETTER_AUTH_DB_URI` | better-auth | Mongo URI for auth (database name is hardcoded to `wanderlust`) |
| `BETTER_AUTH_SECRET` | better-auth | Session signing secret (auto-read) |
| `BETTER_AUTH_URL` | better-auth | App base URL, e.g. `http://localhost:3000` (auto-read) |
| `GOOGLE_DB_CLIENT_ID` / `GOOGLE_DB_SECRET` | Google social login | OAuth credentials |
| `JWT_SECRET` | Both apps | Shared HS256 secret for API JWTs — **must be set in this repo's `.env` *and* in `wanderlust-s/.env`** (same value) |

Without `MONGODB_URI` the app still runs — `/api/travel-packages` just returns 503 (no UI calls it yet). Destination data needs only the Express backend. Without `JWT_SECRET` the destination APIs fail closed (503/empty catalogue).

### 2. Google OAuth (optional, for Google login)

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add to the OAuth client:

- **Authorized redirect URI**: `http://localhost:3000/api/auth/callback/google`
- **Authorized JavaScript origin**: `http://localhost:3000`

### 3. Run the Express API backend

The destination data comes from a separate Express server (sibling repo, e.g. `../wanderlust-s`):

```bash
cd ../wanderlust-s
node index.js   # runs on http://localhost:8000
```

### 4. Run the Next.js app

```bash
npm install
npm run dev     # http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config, `eslint-config-next`) |
| `npx tsc --noEmit` | Type checking |

## API Overview

All data endpoints require `Authorization: Bearer <jwt>` (see [API authentication](#api-authentication-jwt)) — unauthenticated calls get `401`, missing `JWT_SECRET` gets `503`.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/token` | Session cookie | Exchange the sign-in session for a 15-minute API JWT |

### External Express API (`http://localhost:8000`)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/destinations` | List all destinations |
| POST | `/add-destination` | Create a destination |
| PUT | `/update-destination/:id` | Update a destination |
| DELETE | `/delete-destination/:id` | Delete a destination |

(`GET /` stays open as a no-data health probe.)

### Local Next.js route (`/api/travel-packages`)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/travel-packages?category=&minPrice=&maxPrice=&sort=` | List the 100 newest packages |
| POST | `/api/travel-packages` | Create a package (validated) |

## Route protection

Protected pages: `/profile`, `/destinations/[id]`, `/destinations/[id]/edit`, `/add-destinations`, `/bookings`. The `/destinations` catalogue list stays public.

Two layers enforce sign-in:

1. **Edge proxy** — `src/proxy.ts` (Next 16's middleware convention is named `proxy`). It checks for a session cookie with `getSessionCookie()` (presence only — no DB) and redirects to `/sign-in?next=…`. Every matcher entry must start with `/`.
2. **Server session check** — `src/lib/require-session.ts` validates the session against MongoDB via `auth.api.getSession()` before the destination detail/edit pages fetch data. Fail-closed: any error redirects to sign-in. Called **outside** `<Suspense>` so the redirect returns a real `307`, not a streamed `200`.

The sign-in page reads `?next=` (same-site paths only) and returns you there after login.

## API authentication (JWT)

APIs are secured separately from pages — page access uses session cookies (above), API calls use **HS256 JWT bearer tokens** signed with a shared `JWT_SECRET` (issuer `wanderlust`):

- **Issuing** — `POST /api/token` validates the better-auth session and returns a 15-minute JWT. Client components cache it in memory via `getApiJwt()` (`src/lib/api-jwt.ts`) and send `Authorization: Bearer <jwt>` on every mutation. Sign-out clears the cache.
- **Server-side fetches** — SSR (`src/lib/destinations-api.ts`) has no browser session, so it signs short-lived *service* JWTs (`sub: "service"`) on the fly. This is why the public catalogue still renders while direct curl access to `:8000` is rejected.
- **Verification** — the Express API (`wanderlust-s/index.js`, `requireJwt` middleware, runs before body parsing) and `/api/travel-packages` (`requireApiJwt`) both verify signature + expiry + issuer. Wrong secret, forged/expired token, or wrong issuer → `401`.
- **Fail-closed** — missing `JWT_SECRET` on either side → `503`; never an open endpoint.

## Project Structure

```
src/
├── app/
│   ├── (main)/            # All pages (Navbar/Footer layout)
│   │   ├── destinations/  # Catalogue, [id] detail, [id]/edit
│   │   ├── bookings/      # localStorage-backed bookings
│   │   ├── add-destinations/
│   │   ├── sign-in / sign-up / profile
│   │   └── help, terms, privacy
│   ├── api/
│   │   ├── auth/[...all]/ # better-auth catch-all handler + auth-client
│   │   ├── token/         # POST — session cookie → 15-min API JWT
│   │   └── travel-packages/
│   ├── layout.tsx         # Root layout (fonts, Toaster)
│   ├── error.tsx          # Global error boundary
│   └── not-found.tsx      # 404 page
├── components/            # Navbar, Footer, destination cards, ui/ primitives
├── hooks/                 # use-bookings (useSyncExternalStore)
├── lib/                   # auth, mongodb, bookings, jwt, api-jwt, destinations-api, require-session helpers
├── models/                # mongoose TravelPackage model
├── proxy.ts               # Edge route protection (session cookie check)
└── types/                 # Shared TS types
```

## Notes

- **Three data stores, never mixed**: Express writes `wanderlust.destination` (raw driver); better-auth uses the same `wanderlust` database name (hardcoded in `src/lib/auth.ts`, different collections); `/api/travel-packages` uses `MONGODB_URI`/`MONGODB_DB` → `travel-packages` collection (mongoose).
- Bookings live only in browser `localStorage` (`wanderlust.bookings`) — there is no bookings backend.
- Seeded destination image URLs may point at fake hosts — the UI falls back to local images in `public/images/destinations/` when the optimizer fails.
