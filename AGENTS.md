<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Travel site ("Wanderlast"), Next.js 16.4 App Router + React 19 + Tailwind v4 + shadcn. There are **two separate backends** — don't confuse them:

- **External Express API at `http://localhost:8000`** — repo lives in the **sibling folder `../wanderlust-s`** (`C:\Projects\full-stack-projects\wanderlust-s`), not this tree. This is what the UI actually calls: `GET /destinations`, `POST /add-destination`, `PUT /update-destination/:id`, `DELETE /delete-destination/:id`. Run it with `node index.js` (no dev script, no nodemon) — **restart it after editing `index.js`**; its DB credentials are in `wanderlust-s/.env` under `M_DB_URI`. It must be running for anything to return data.
- **Local Next route handler `src/app/api/travel-packages/route.ts`** over MongoDB/mongoose. It exists and works, but **no UI component calls it yet**.

The backends write to **different MongoDB databases/collections** — never mix them:

| Writer | Database | Collection |
| --- | --- | --- |
| Express (raw driver) | `wanderlust` | `destination` |
| Next `/api/travel-packages` (mongoose) | from `MONGODB_URI`/`MONGODB_DB` | `travel-packages` |
| better-auth (`src/lib/auth.ts`) | `wanderlust-db` (**hardcoded**) | better-auth-managed |

`devlog.txt` in the repo root is a 1MB scratch dev log that is tracked in git but churned constantly — not documentation; don't read it as a source of truth and don't commit its changes.

## Commands

- `npm run dev` — dev server (Turbopack) on http://localhost:3000
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript)
- Type checking: `npx tsc --noEmit` (there is **no** `typecheck` script)
- There is **no** test framework installed and no `test` script. Don't invent one; verify with lint + `npx tsc --noEmit` + `npm run build`.
- Only one dev server per project: a second `next dev` in this dir aborts with "Another next dev server is already running." Check `http://localhost:3000` before starting your own.

### Verification baseline (Nov 2026)

- `npx tsc --noEmit` is clean; keep it that way.
- `npm run lint` has 0 errors and one pre-existing warning (unused `User` import in `navbar.tsx`). Don't add new warnings.
- `npm run build` passes.

## Authentication (better-auth)

- `src/lib/auth.ts` — `betterAuth` with the mongo adapter (`@better-auth/mongo-adapter`, raw `mongodb` driver), email+password enabled, Google social provider, and the **required `nextCookies()` plugin** (from `better-auth/next-js`; without it cookie clearing/sign-out breaks in Next route handlers).
- **Gotchas**:
  - Its Mongo connection string comes from `BETTER_AUTH_DB_URI` in `.env` (fallback `mongodb://localhost:27017`), but the db name is **hardcoded** `wanderlust-db` — it ignores `MONGODB_URI`. (In practice that URI points at an Atlas cluster.)
  - The Google provider reads `GOOGLE_DB_CLIENT_ID`/`GOOGLE_DB_SECRET` from `.env`. `BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` are auto-read by better-auth itself — don't add explicit config keys for them.
  - **Google login**: works end-to-end only if `http://localhost:3000/api/auth/callback/google` (redirect URI) and `http://localhost:3000` (origin) are registered in Google Cloud Console for that client — the server builds the redirect URL regardless.
- `src/app/api/auth/[...all]/route.ts` — catch-all handler via `toNextJsHandler(auth)`.
- `auth-client.ts` lives **inside the route folder** `src/app/api/auth/[...all]/`; exports `authClient` (baseURL hardcoded `http://localhost:3000`) and `signIn`/`signUp`/`useSession` from a second bare `createAuthClient()`. Import client helpers from there, not from a `lib/` path that doesn't exist.
- **Route protection**: `src/proxy.ts` (Next 16 renamed the `middleware` convention to `proxy` — the function must be exported as `proxy`, not `middleware`) guards `/profile` and `/destinations/:path+` (detail + edit; `/destinations` list stays public) by checking for a cookie named `better-auth.session_token*` and redirecting to `/sign-in` — presence-only check (better-auth's documented middleware pattern), no DB in proxy. Client helpers `signIn`/`signUp`/`signOut`/`useSession` come from `auth-client.ts`.
- Auth pages: all live in `(main)` with Navbar/Footer (sign-up: `signUp.email` + Google; sign-in: `signIn.email` with `rememberMe` + Google; profile: `useSession` + `useBookings` stats, Edit Profile Dialog via `authClient.updateUser({ name })`, Sign Out via `authClient.signOut()`). Shared `GoogleIcon` lives in `src/components/auth/google-icon.tsx` (lucide has no brand icons).

## External Express API (:8000)

- **Two env vars point at the same API** (both in `.env.example`): `DESTINATIONS_API_URL` for server-side fetches, `NEXT_PUBLIC_DESTINATIONS_API_URL` for client components — client components can only read `NEXT_PUBLIC_*`.
- `src/lib/destinations-api.ts` is the canonical server-side helper: `getDestinations()` and `getDestinationById()`. It normalizes payload shapes (bare array, `{destinations|data|packages|results:[…]}`, or a single object) and returns/throws plainly. There is no single-item endpoint — `getDestinationById` fetches the whole list and finds by `_id`.
- Record shape (`src/types/destination.ts`): `{ _id, destinationName, country, category, price, duration, departureDate, imageUrl, description, rating? }`.
- Seeded `imageUrl` values point at fake hosts → the `next/image` optimizer answers **500**, so `next/image` needs a client-side `onError` fallback. `FALLBACK_DESTINATION_IMAGES` (in `destinations-api.ts`) points at `public/images/destinations/imageN.png`; `DestinationCard` and `bookings-list` pick one by row index and swap on `onError`. Keep that pattern for any admin-entered image URL.

## Routes & state

- **Route groups**: all pages live in `src/app/(main)/` — its layout provides `Navbar` + `<main>` + `Footer` for every route; the root layout holds only html/body + `Toaster`. (The `(auth)` group was removed so `/profile` gets Navbar/Footer too.) URLs are unaffected.
- Routes: `/` (landing: `Banner`, `WhyChooseUs`, `Testimonials`, `CallToAction`), `/destinations` (catalogue → `DestinationsExplorer` → `DestinationsGrid` client grid with filter/sort → `DestinationCard` with image fallback), `/destinations/[id]` (detail, `<Suspense>` + skeleton → `BookNowButton`), `/destinations/[id]/edit` (edit form: `PUT /update-destination/:id` + delete-confirm modal → `DELETE /delete-destination/:id`, both from the browser), `/bookings` (client-side only — see below), `/add-destinations` (add form → `add-travel-package-form.tsx`, posts `/add-destination` from the browser), `/help` `/terms` `/privacy` (static pages built on `info-page.tsx`). Global `src/app/error.tsx` (client error boundary with reset) and `src/app/not-found.tsx` (404) cover failures for every route.
- **Bookings have no backend**: they live in browser `localStorage` under `wanderlust.bookings`. `src/lib/bookings.ts` is the store (plain functions, SSR-safe via `isBrowser()`), `src/hooks/use-bookings.ts` wraps it with `useSyncExternalStore` + a manual `Set<() => void>` listener registry + `storage` event (cross-tab sync). Mutations must call `emitChange()` after `writeBookings()`.
- Navbar right side is session-aware (`useSession`): signed-in → Profile pill (icon + name → `/profile`); signed-out → Sign In text link + brand Sign Up button. While the session is pending it renders nothing. The nav list is duplicated across `navbar.tsx` (`navLinks`) and `footer.tsx` — keep both in sync when adding a route (the dead `/admin` links were removed from mobile-nav/footer).
- The `(main)` layout provides Navbar/Footer; `Toaster` stays in the root layout so every route gets it — mount `Toaster` only once.
- Toasts: `import { toast } from "@/components/ui/toast"` then `toast.add({...})` (a module-level base-ui `createToastManager()` — not a hook).

## Stack quirks

- **Tailwind v4, CSS-first**: no `tailwind.config.js`. Design tokens live in `src/app/globals.css` under `@theme inline` + `:root` / `.dark` variables. Add new colors/tokens there, not in a config file. `next.config.ts` registers the `@tailwindcss/turbopack` CSS loader — keep it if you touch the Turbopack rules.
- `next.config.ts` has `cacheComponents: false` and `partialPrefetching: false`. If they are re-enabled: an uncached `fetch`/`params` outside a `<Suspense>` boundary fails `npm run build` — wrap data access in `<Suspense>` or use `"use cache"`.
- **`reactCompiler: true`** — the compiler runs on every build. Keep component props/returns compiler-friendly (no mutation of props, no conditional hooks).
- **Typed routes**: `PageProps<"/route">` and `LayoutProps<"/">` are globally available helpers (no import). `src/app/layout.tsx` uses `LayoutProps<"/">`; some pages (e.g. `destinations/[id]`) still declare local `params: Promise<{id}>` types — both work.
- `next.config.ts` sets `images.remotePatterns` to `https/**` so admin-entered image URLs work with `next/image`.
- Next 16.4 bundles version-matched docs at `node_modules/next/dist/docs/` (see the managed block above). `next dev` rewrites the managed block in this file; keep it in your commits.

## UI components

- shadcn `base-nova` style on **@base-ui/react** (not Radix). `components.json` defines aliases: `@/components/ui`, `@/lib/utils`, `@/lib`, `@/hooks`, `@/components`.
- `src/components/ui/` only holds the primitives the app actually uses (`badge`, `button`, `carousel`, `dialog`, `empty`, `field`, `input`, `label`, `select`, `separator`, `skeleton`, `textarea`, `toast`). Unused ones were deleted; re-add with the CLI instead of hand-writing one.
- Add primitives with the shadcn CLI (`npx shadcn@latest add <name>`); it writes into `src/components/ui` and will overwrite local edits to those files. Most of `src/components/ui/` is vendored shadcn output — read the existing file before hand-editing, and match its conventions: `data-slot` attributes, `cva` variants, `cn()` for merging.
- Base UI primitives use a `render` prop instead of Radix's `asChild`. Follow the pattern already in the file you're editing. When a `Button` renders a `<Link>` (an `<a>`, not a native button) via `render`, it must also set `nativeButton={false}` or base-ui logs a runtime warning.
- Class merging uses the **`cn` package** (`import { cn } from "cn"`), which replaces clsx + tailwind-merge. `src/lib/utils.ts` does not exist — don't add `clsx`/`tailwind-merge` dependencies, and import `cn` from `"cn"` directly.
- `src/components/ui/carousel.tsx` (embla) exposes `Carousel`/`CarouselContent`/`CarouselItem`/`CarouselPrevious`/`CarouselNext`; `CarouselPrevious`/`CarouselNext` read context, so they must be rendered **inside** `<Carousel>` — override their default absolute positioning with `static` to place them in a header row (see `testimonials.tsx`).

## Styling, fonts & assets

- Fonts: Josefin Sans via `next/font/google` in `src/app/layout.tsx` — loaded with `variable: "--font-josefin-sans"` (not `className`), so it is exposed as a CSS variable only. `globals.css` maps `--font-heading` → `--font-josefin-sans` (display headings) and `--font-sans` → `--font-ui` (system stack for UI text). Use `font-heading` for big display type, `font-sans`/default for UI text.
- Brand teal is `#15a1bf`, exposed as `brand` / `brand-dark` tokens in `globals.css` — use `bg-brand` / `text-brand` instead of hardcoding hex.
- Motion: `globals.css` defines an `animate-rise-in` utility (0.6s ease-out fade+translateY, honors `prefers-reduced-motion` globally) — apply it to page sections for entrance animation, with inline `animationDelay` for card staggers. `html` scrolls smooth. Keep hover transitions subtle (colors/shadows/transform only) — the UI design must not change.
- `public/images/` holds brand/hero art: `Wanderlast.png` = low-res teal wordmark (nav), `Wanderlast-1.png` = high-res white one (footer), `Banner.png`/`CTA.png` = hero/CTA photos, `destinations/image1-6.png` = image fallbacks. Lucide v1 dropped brand icons, so the footer's X/LinkedIn/Instagram glyphs are inline SVGs in `footer.tsx`.

## Database (MongoDB, local route handler)

- `mongoose` is installed (both `mongoose` and `mongodb` are in Next's default `serverExternalPackages`, so no config needed).
- Env: `MONGODB_URI` (required) and optional `MONGODB_DB` — see `.env.example`; real values live in gitignored `.env*` files (a local `.env` already exists).
- `src/lib/mongodb.ts` — cached connection singleton (`globalThis` cache survives dev hot-reload); `connectToDatabase()` throws a clear error when `MONGODB_URI` is missing.
- `src/models/travel-package.ts` — mongoose schema/model (`travel-packages` collection, `timestamps: true`); the model is re-used via `mongoose.models.TravelPackage ?? mongoose.model(...)` to avoid dev re-registration errors.
- `src/lib/travel-package.ts` — shared categories + server-side validation (`parseTravelPackageInput`), used by both the client form and the API route. The edit form also uses its category list but keeps the record's legacy category selectable at the top of the options.
- `src/app/api/travel-packages/route.ts` — `POST` creates a package (400 bad JSON, 422 validation, 503 DB not configured/unreachable, 201 created) and `GET` lists the 100 newest as `{ packages, total }`, filtered server-side via `?category=&minPrice=&maxPrice=&sort=` (`recommended` | `price-asc` | `price-desc` | `rating` | `name`; invalid params → 400). Parsing/filter building lives in `src/lib/travel-packages-query.ts`. Both handlers `await connection()` from `next/server` first.
- Without `MONGODB_URI` the API returns 503; the UI never talks to MongoDB directly.
