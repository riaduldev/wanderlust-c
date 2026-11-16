<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Travel site ("Wanderlast"), Next.js 16.4 App Router + React 19 + Tailwind v4 + shadcn. **Two separate backends** — don't confuse them:

- **External Express API at `http://localhost:8000`** — sibling folder `../wanderlust-s` (`C:\Projects\full-stack-projects\wanderlust-s`), not this tree. This is what the UI actually calls: `GET /destinations`, `POST /add-destination`, `PUT /update-destination/:id`, `DELETE /delete-destination/:id`. All four require an `Authorization: Bearer <jwt>` header (see [API authentication](#api-authentication-jwt)) — `GET /` stays open as a health probe. Run with `node index.js` (no dev script, no nodemon) — **restart it after editing `index.js`**. DB credentials in `wanderlust-s/.env` under `M_DB_URI`; shared JWT secret under `JWT_SECRET` (same value as this repo's `.env`). Must be running for destination data to load.
- **Local Next route handler `src/app/api/travel-packages/route.ts`** over MongoDB/mongoose. Exists and works, but **no UI component calls it yet**.

The backends write to **different MongoDB databases/collections** — never mix them:

| Writer | Database | Collection(s) |
| --- | --- | --- |
| Express (raw driver) | `wanderlust` | `destination` |
| Next `/api/travel-packages` (mongoose) | from `MONGODB_URI`/`MONGODB_DB` | `travel-packages` |
| better-auth (`src/lib/auth.ts`) | `wanderlust` (**hardcoded** — same DB name as Express, different collections) | better-auth-managed (`user`, `session`, …) |

`devlog.txt` in the repo root is a ~1.3MB scratch dev log tracked in git but churned constantly — not documentation; don't read it as a source of truth and don't commit its changes.

## Commands

- `npm run dev` — dev server (Turbopack) on http://localhost:3000
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript)
- Type checking: `npx tsc --noEmit` (there is **no** `typecheck` script)
- There is **no** test framework and no `test` script. Don't invent one; verify with lint + `npx tsc --noEmit` + `npm run build`.
- Only one dev server per project: a second `next dev` in this dir aborts with "Another next dev server is already running." Check `http://localhost:3000` before starting your own.
- No CI (`.github/` absent), no pre-commit hooks, no `opencode.json`.

### Verification baseline (Nov 2026)

- `npx tsc --noEmit` is clean; keep it that way.
- `npm run lint` has 0 errors and 0 warnings; keep it that way.
- `npm run build` passes.
- **Proxy matcher entries must all start with `/`** — a bare path (e.g. `"bookings"`) invalidates the whole config: dev server aborts, build fails (`source must start with / at matcher[N]`), and *no* route stays protected. This shipped as a bug once.
- If a crashed `next dev` leaves `.next/dev/types/routes.d.ts` defining `type LayoutRoutes = never`, standalone `npx tsc --noEmit` fails with `Type '"/"' is not assignable to type 'never'` — delete `.next/dev/` and re-run.

## Authentication (better-auth)

- `src/lib/auth.ts` — `betterAuth` with the mongo adapter (`@better-auth/mongo-adapter`, raw `mongodb` driver), email+password, Google social provider, and the **required `nextCookies()` plugin** (from `better-auth/next-js`; without it cookie clearing/sign-out breaks in Next route handlers).
- **Gotchas**:
  - Mongo connection string from `BETTER_AUTH_DB_URI` in `.env` (fallback `mongodb://localhost:27017` with a scheme guard in `auth.ts`), but the db name is **hardcoded** `wanderlust` — it ignores `MONGODB_URI`.
  - **Do not change the fallback to a non-mongo URL** — `new MongoClient("http://...")` throws `MongoParseError` at module evaluation, which runs during `next build` page-data collection (that's what broke the Vercel deploy) and would break local dev too.
  - Google provider reads `GOOGLE_DB_CLIENT_ID`/`GOOGLE_DB_SECRET` from `.env`. `BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` are auto-read by better-auth — don't add explicit config keys for them.
  - **Google login** works end-to-end only if `http://localhost:3000/api/auth/callback/google` (redirect URI) and `http://localhost:3000` (origin) are registered in Google Cloud Console.
- `src/app/api/auth/[...all]/route.ts` — catch-all via `toNextJsHandler(auth)`.
- `auth-client.ts` lives **inside** `src/app/api/auth/[...all]/`; exports **one** `createAuthClient()` as `authClient` and destructures `signIn`/`signUp`/`useSession`/`signOut` from that same instance — they must share one session cache (two instances = sign-out/rename leaves navbar/profile on a stale session). Import client helpers from there, not from a `lib/` path that doesn't exist.
- **Route protection (two layers)**: `src/proxy.ts` (Next 16 renamed the `middleware` convention to `proxy` — export the function as `proxy`, not `middleware`) is the edge layer: matcher `["/profile", "/destinations/:path+", "/add-destinations", "/bookings"]` — `/destinations` list stays public; `:path+` covers detail + edit. It uses `getSessionCookie(request)` from `better-auth/cookies` — **presence-only, no DB**: a forged/expired cookie passes it. The second layer is `requireSession(nextPath)` in `src/lib/require-session.ts` — server-side `auth.api.getSession({ headers })` with `.catch(() => null)` (fail-closed), called by the destination detail + edit pages before any data fetch; redirect to `/sign-in?next=…`. **Call it outside `<Suspense>`**: a `redirect()` thrown inside a streaming boundary still navigates the browser via the RSC payload but the HTTP status is already committed as 200 — outside it yields a real 307. **Do not replace `getSessionCookie` with a `cookie.name.startsWith("better-auth.session_token")` check**: behind https better-auth prefixes the cookie with `__Secure-`, so a bare-name check rejects valid production (Vercel) sessions and bounces logged-in users to `/sign-in` (this shipped as a real bug). On rejection both layers redirect to `/sign-in?next=<path>`; the sign-in page reads `?next=` (same-site paths only, `safeNextPath()` in `sign-in/page.tsx`) and returns there after login — keep all halves in sync. Client helpers `signIn`/`signUp`/`signOut`/`useSession` come from `auth-client.ts`.
- Auth pages all live in `(main)` with Navbar/Footer (sign-up: `signUp.email` + Google; sign-in: `signIn.email` with `rememberMe` + Google; profile: `useSession` + `useBookings` stats, Edit Profile Dialog via `authClient.updateUser({ name })`, Sign Out via `authClient.signOut()`). Shared `GoogleIcon` in `src/components/auth/google-icon.tsx` (lucide has no brand icons).

## API authentication (JWT)

Pages use session cookies (two layers above); **APIs use HS256 JWT bearer tokens** — a separate layer, don't mix them:

- **Shared secret**: `JWT_SECRET` in **both** this repo's `.env` and `wanderlust-s/.env` (identical value). Issuer claim is `wanderlust` on both sign and verify. Missing secret → fail-closed `503` everywhere (never an open endpoint).
- `src/lib/jwt.ts` — `signApiJwt(claims, ttl)` / `verifyApiJwt` / `verifyRequestJwt(request)` via `jose` (a direct dependency of both repos). Claims: `sub`, `typ: "user" | "service"`, optional `email`/`name`. **Lazy secret read** — never throw at module scope (breaks `next build` page-data collection like the auth fallback did).
- `src/app/api/token/route.ts` — `POST` exchanges the better-auth session cookie for a **15-minute** user JWT (`typ: "user"`, `sub: user.id`). Not under `/api/auth/` — that path is swallowed by better-auth's `[...all]` catch-all. 401 without a session, 503 without `JWT_SECRET`. POST-only so nothing preloads it.
- `src/lib/api-jwt.ts` — browser helper `getApiJwt()` (in-memory cache, refetches 30s before expiry, single in-flight request shared across callers) + `clearApiJwt()` (called by profile sign-out). Client mutations must send `Authorization: Bearer ${token}`: `add-travel-package-form.tsx` (POST), `EditDestinationForm.tsx` (PUT + DELETE). On token failure they toast "Sign in required" — don't let it fall through to the generic "server could not be reached" catch.
- **Server-side (SSR) fetches have no session** — `src/lib/destinations-api.ts` signs short-lived **service** JWTs (`sub: "service"`, 5m, fresh per request) and sends them as headers. This is why the public `/destinations` catalogue keeps working while raw `curl :8000` gets 401. Sign throws without `JWT_SECRET` (fail-closed → empty/error page).
- **`FALLBACK_DESTINATION_IMAGES` moved to `src/lib/fallback-images.ts`** — it must NOT live in `destinations-api.ts` anymore: client components import it, and destinations-api statically imports `jwt.ts`/`jose` (would drag jose into the browser bundle). Import the fallback from `fallback-images` in client code.
- `src/app/api/travel-packages/route.ts` — both handlers run `requireApiJwt(request)` after `connection()`: 503 (no secret), 401 (missing/invalid token), then the existing 400/422/503/201 logic. Verifying any valid JWT (user or service) is enough — no session/DB lookup.
- Express side (`../wanderlust-s/index.js`): `requireJwt` middleware registered with `app.use([paths], requireJwt)` **before** `express.json()` (so unauthenticated bodies never reach the parser) scoped to `/add-destination`, `/destinations`, `/update-destination`, `/delete-destination`. CORS preflight (OPTIONS) is answered by the earlier `cors()` middleware and never hits the gate. `jose` added to its package.json — **restart `node index.js` after edits**.
- **Limitation (by design)**: JWTs are stateless — a token issued before sign-out stays valid until its 15m `exp` (page access still dies immediately because pages check the session cookie, which sign-out clears). Keep the TTL short; don't add revocation lists unless asked.

## External Express API (:8000)

- **Two env vars point at the same API**: `DESTINATIONS_API_URL` for server-side fetches, `NEXT_PUBLIC_API_URL` for client components (client components only see `NEXT_PUBLIC_*`). **There is no `.env.example`** — real values live in gitignored `.env*` (local `.env` exists and sets both to `http://localhost:8000`). On Vercel, set `NEXT_PUBLIC_API_URL=https://wanderlust-s-p78j.onrender.com` (and optionally `DESTINATIONS_API_URL` to the same) in the dashboard — `.env` never deploys.
- `src/lib/destinations-api.ts` is the canonical server-side helper: `getDestinations()` / `getDestinationById()`. Reads `DESTINATIONS_API_URL ?? NEXT_PUBLIC_API_URL ?? "http://localhost:8000"` — without any set, Vercel SSR silently fetches `localhost:8000`, fails, and the catalogue renders empty (`.catch(() => [])` in `destinations/page.tsx` logs the error). Sends a service JWT on every fetch (see [API authentication](#api-authentication-jwt)) — Express answers 401 without it. Normalizes payload shapes (bare array, `{destinations|data|packages|results:[…]}`, or a single object). **No single-item endpoint** — `getDestinationById` fetches the whole list and finds by `_id`.
- **URL shape gotcha**: Express serves `GET /destinations` but mutations at the **root** (`POST /add-destination`, `PUT /update-destination/:id`, `DELETE /delete-destination/:id`). Client forms must build `${NEXT_PUBLIC_API_URL}/add-destination` — appending `/destinations` before the mutation path 404s (broken in commit `89ec52d`, fixed). All four endpoints also require `Authorization: Bearer <jwt>` — mutations get theirs from `getApiJwt()`.
- Record shape (`src/types/destination.ts`): `{ _id, destinationName, country, category, price, duration, departureDate, imageUrl, description, rating? }`.
- Seeded `imageUrl` values point at fake hosts → the `next/image` optimizer answers **500**, so `next/image` needs a client-side `onError` fallback. `FALLBACK_DESTINATION_IMAGES` (now in `src/lib/fallback-images.ts`) points at `public/images/destinations/imageN.png`; `DestinationCard` and `bookings-list` pick one by row index and swap on `onError`. Keep that pattern for any admin-entered image URL.
- Render free tier (wanderlust-s) sleeps after idle → first request can take 15–30s; a cold start may time out a serverless fetch. CORS in `wanderlust-s/index.js` allows only `https://wanderlust-c.vercel.app` and `http://localhost:3000`. **Restart `node index.js` after editing it** — a stale process keeps serving old routes/CORS.

## Routes & state

- **Route groups**: all pages live in `src/app/(main)/` — its layout provides `Navbar` + `<main>` + `Footer` for every route; the root layout holds only html/body + `Toaster`. (The `(auth)` group was removed so `/profile` gets Navbar/Footer too.) URLs are unaffected.
- Routes: `/` (landing: `Banner`, `WhyChooseUs`, `Testimonials`, `CallToAction`), `/destinations` (catalogue → `DestinationsExplorer` → `DestinationsGrid` client grid → `DestinationCard` with image fallback), `/destinations/[id]` (detail, `<Suspense>` + skeleton → `BookNowButton`), `/destinations/[id]/edit` (edit form: `PUT /update-destination/:id` + delete-confirm modal → `DELETE /delete-destination/:id`, both from the browser), `/bookings` (localStorage only — see below), `/add-destinations` (add form → `add-travel-package-form.tsx`, posts `/add-destination` from the browser), `/help` `/terms` `/privacy` (static pages on `info-page.tsx`). Global `src/app/error.tsx` and `src/app/not-found.tsx` cover failures for every route.
- **Bookings have no backend**: browser `localStorage` under `wanderlust.bookings`. `src/lib/bookings.ts` is the store (plain functions, SSR-safe via `isBrowser()`), `src/hooks/use-bookings.ts` wraps it with `useSyncExternalStore` + a manual `Set<() => void>` listener registry + `storage` event (cross-tab sync). Mutations must call `emitChange()` after `writeBookings()`.
- Navbar right side is session-aware (`useSession`): signed-in → Profile pill; signed-out → Sign In text link + brand Sign Up button; while pending it renders nothing. Main nav items are duplicated across `navbar.tsx` (`navLinks`) and `footer.tsx` (`quickLinks`) — keep those in sync when adding a route (footer also has Sign In/Sign Up text links that navbar replaces with session-aware buttons). The dead `/admin` links were removed from mobile-nav/footer.
- `Toaster` stays in the root layout so every route gets it — mount `Toaster` only once.
- Toasts: `import { toast } from "@/components/ui/toast"` then `toast.add({...})` (module-level base-ui `createToastManager()` — not a hook).

## Stack quirks

- **Tailwind v4, CSS-first**: no `tailwind.config.js`. Design tokens live in `src/app/globals.css` under `@theme inline` + `:root` / `.dark` variables. Add new colors/tokens there. `next.config.ts` registers the `@tailwindcss/turbopack` CSS loader — keep it if you touch the Turbopack rules.
- `next.config.ts` has `cacheComponents: false` and `partialPrefetching: false`. If re-enabled: an uncached `fetch`/`params` outside `<Suspense>` fails `npm run build` — wrap data access in `<Suspense>` or use `"use cache"`.
- **`reactCompiler: true`** — runs on every build. Keep component props/returns compiler-friendly (no mutation of props, no conditional hooks).
- **Typed routes**: `PageProps<"/route">` and `LayoutProps<"/">` are globally available (no import). `src/app/layout.tsx` uses `LayoutProps<"/">`; some pages still declare local `params: Promise<{id}>` types — both work.
- `next.config.ts` sets `images.remotePatterns` to `https/**` so admin-entered image URLs work with `next/image`.
- Next 16.4 bundles version-matched docs at `node_modules/next/dist/docs/` (see managed block). `next dev` rewrites the managed block in this file; keep it in your commits.

## UI components

- shadcn `base-nova` style on **@base-ui/react** (not Radix). `components.json` defines aliases: `@/components/ui`, `@/lib/utils`, `@/lib`, `@/hooks`, `@/components`.
- `src/components/ui/` only holds primitives the app uses (`badge`, `button`, `carousel`, `dialog`, `empty`, `field`, `input`, `label`, `select`, `separator`, `skeleton`, `textarea`, `toast`). Unused ones were deleted; re-add with the CLI instead of hand-writing.
- Add primitives with `npx shadcn@latest add <name>`; it writes into `src/components/ui` and overwrites local edits. Most of that folder is vendored shadcn output — read the existing file before hand-editing; match conventions: `data-slot` attributes, `cva` variants, `cn()` for merging.
- Base UI primitives use a `render` prop instead of Radix's `asChild`. Follow the pattern already in the file you're editing. When a `Button` renders a `<Link>` (an `<a>`, not a native button) via `render`, it must also set `nativeButton={false}` or base-ui logs a runtime warning.
- Class merging uses the **`cn` package** (`import { cn } from "cn"`), which replaces clsx + tailwind-merge. `src/lib/utils.ts` does not exist — don't add `clsx`/`tailwind-merge` dependencies; import `cn` from `"cn"` directly.
- `src/components/ui/carousel.tsx` (embla) exposes `Carousel`/`CarouselContent`/`CarouselItem`/`CarouselPrevious`/`CarouselNext`; `CarouselPrevious`/`CarouselNext` read context, so they must be rendered **inside** `<Carousel>` — override their default absolute positioning with `static` to place them in a header row (see `testimonials.tsx`).

## Styling, fonts & assets

- Fonts: Josefin Sans via `next/font/google` in `src/app/layout.tsx` — loaded with `variable: "--font-josefin-sans"` (not `className`), exposed as a CSS variable only. `globals.css` maps `--font-heading` → `--font-josefin-sans` (display headings) and `--font-sans` → `--font-ui` (system stack for UI text). Use `font-heading` for big display type, `font-sans`/default for UI text.
- Brand teal is `#15a1bf`, exposed as `brand` / `brand-dark` tokens in `globals.css` — use `bg-brand` / `text-brand` instead of hardcoding hex.
- Motion: `globals.css` defines `animate-rise-in` (0.6s ease-out fade+translateY, honors `prefers-reduced-motion`) — apply to page sections, with inline `animationDelay` for card staggers. `html` scrolls smooth. Keep hover transitions subtle (colors/shadows/transform only) — the UI design must not change.
- `public/images/` holds brand/hero art: `Wanderlast.png` = low-res teal wordmark (nav), `Wanderlast-1.png` = high-res white one (footer), `Banner.png`/`CTA.png` = hero/CTA photos, `destinations/image1-6.png` = image fallbacks. Lucide v1 dropped brand icons, so the footer's X/LinkedIn/Instagram glyphs are inline SVGs in `footer.tsx`.

## Database (MongoDB, local route handler)

- `mongoose` is installed (both `mongoose` and `mongodb` are in Next's default `serverExternalPackages` — no config needed).
- Env: `MONGODB_URI` (required) and optional `MONGODB_DB`. **There is no `.env.example`**; real values live in gitignored `.env*`. The local `.env` currently has **no `MONGODB_URI`** — without it the travel-packages API returns 503 (the UI never talks to MongoDB directly, so the rest of the app still works).
- `src/lib/mongodb.ts` — cached connection singleton (`globalThis` cache survives dev hot-reload); `connectToDatabase()` throws a clear error when `MONGODB_URI` is missing; `isMongoConfigured()` gates the API handlers.
- `src/models/travel-package.ts` — mongoose schema/model (`travel-packages` collection, `timestamps: true`); re-used via `mongoose.models.TravelPackage ?? mongoose.model(...)` to avoid dev re-registration errors.
- `src/lib/travel-package.ts` — shared categories + server-side validation (`parseTravelPackageInput`), used by both the client form and the API route. The edit form also uses its category list but keeps the record's legacy category selectable at the top of the options.
- `src/app/api/travel-packages/route.ts` — both handlers run `requireApiJwt(request)` after `connection()` (503 no `JWT_SECRET`, 401 bad/missing token) **before** the rest: `POST` creates a package (400 bad JSON, 422 validation, 503 DB not configured/unreachable, 201 created) and `GET` lists the 100 newest as `{ packages, total }`, filtered server-side via `?category=&minPrice=&maxPrice=&sort=` (`recommended` | `price-asc` | `price-desc` | `rating` | `name`; invalid params → 400). Parsing/filter building lives in `src/lib/travel-packages-query.ts`. Both handlers `await connection()` from `next/server` first.
