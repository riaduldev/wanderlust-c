# Wanderlast 🌍

A full-stack travel booking web app built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui** — browse destinations, book trips, and manage your profile.

## Features

- **Destination catalogue** with client-side filtering, sorting, and image fallbacks
- **Destination detail pages** with booking flow
- **Bookings page** — bookings persist in browser `localStorage` (with cross-tab sync)
- **Add destination form** — posts to the external Express API
- **Authentication** (better-auth) — email + password and Google sign-in
- **Protected routes** — `/profile` and destination details require sign-in (`src/proxy.ts`)
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

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Used by | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | `/api/travel-packages` route | Mongo connection string |
| `MONGODB_DB` | `/api/travel-packages` route | Optional db name override |
| `DESTINATIONS_API_URL` | Server-side fetches | Express API base URL |
| `NEXT_PUBLIC_DESTINATIONS_API_URL` | Client components | Express API base URL |
| `BETTER_AUTH_DB_URI` | better-auth | Mongo URI for the `wanderlust-db` auth database |
| `BETTER_AUTH_SECRET` | better-auth | Session signing secret (auto-read) |
| `BETTER_AUTH_URL` | better-auth | App base URL, e.g. `http://localhost:3000` (auto-read) |
| `GOOGLE_DB_CLIENT_ID` / `GOOGLE_DB_SECRET` | Google social login | OAuth credentials |

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

### External Express API (`http://localhost:8000`)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/destinations` | List all destinations |
| POST | `/add-destination` | Create a destination |
| PUT | `/update-destination/:id` | Update a destination |
| DELETE | `/delete-destination/:id` | Delete a destination |

### Local Next.js route (`/api/travel-packages`)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/travel-packages?category=&minPrice=&maxPrice=&sort=` | List the 100 newest packages |
| POST | `/api/travel-packages` | Create a package (validated) |

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
│   │   └── travel-packages/
│   ├── layout.tsx         # Root layout (fonts, Toaster)
│   ├── error.tsx          # Global error boundary
│   └── not-found.tsx      # 404 page
├── components/            # Navbar, Footer, destination cards, ui/ primitives
├── hooks/                 # use-bookings (useSyncExternalStore)
├── lib/                   # auth, mongodb, bookings, destinations-api helpers
├── models/                # mongoose TravelPackage model
├── proxy.ts               # Route protection (session cookie check)
└── types/                 # Shared TS types
```

## Notes

- Auth data lives in the `wanderlust-db` MongoDB database; travel packages go to `travel-packages`; the Express backend uses `wanderlust.destination`. The three stores are independent.
- Seeded destination image URLs may point at fake hosts — the UI falls back to local images in `public/images/destinations/` when the optimizer fails.
