<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Travel landing site ("Wanderlast"), Next.js 16.4 App Router + React 19 + Tailwind v4 + shadcn. There are **two separate backends** — don't confuse them:

- **External Express API at `http://localhost:8000`** (separate repo, not in this tree). This is what the UI actually calls.
- **Local Next route handler `src/app/api/travel-packages/route.ts`** over MongoDB/mongoose. It exists and works, but **no UI component calls it yet**.

## Commands

- `npm run dev` — dev server (Turbopack) on http://localhost:3000
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript)
- Type checking: `npx tsc --noEmit` (there is **no** `typecheck` script)
- There is **no** test framework installed and no `test` script. Don't invent one; verify with lint + `tsc --noEmit` + `npm run build`.
- Only one dev server per project: a second `next dev` in this dir aborts with "Another next dev server is already running." Check `http://localhost:3000` before starting your own.

### Lint baseline

`npm run lint` currently fails with 1 pre-existing `react-hooks/set-state-in-effect` error:
`src/components/ui/carousel.tsx:98` (vendored embla wrapper). It is not your regression — don't "fix" vendored shadcn components unless asked, but don't add new ones either.

## Stack quirks

- **Tailwind v4, CSS-first**: no `tailwind.config.js`. Design tokens live in `src/app/globals.css` under `@theme inline` + `:root` / `.dark` oklch variables. Add new colors/tokens there, not in a config file. `next.config.ts` registers the `@tailwindcss/turbopack` CSS loader — keep it if you touch the Turbopack rules.
- **`cacheComponents: true` + `partialPrefetching: true`** in `next.config.ts`:
  - **An uncached `fetch`/`cookies()`/`headers()`/`params` outside a `<Suspense>` boundary fails `npm run build`** with "Next.js encountered uncached or runtime data during prerendering". Fix by wrapping the data access in `<Suspense fallback={…}>`, or caching it with `"use cache"` (+ `cacheLife`/`cacheTag`), or `export const instant = false` to allow a blocking route. PPR is on by default — `experimental.ppr`/`experimental_ppr` no longer exist.
  - Route handlers must `await connection()` before touching the DB so they are never prerendered.
  - Node runtime only: do not add a `runtime` segment export (`edge` is unsupported and will error).
  - `partialPrefetching` requires `cacheComponents`; never disable one without the other.
- **`reactCompiler: true`** — `babel-plugin-react-compiler` is installed and the compiler runs on every build. Keep component props/returns compiler-friendly (no mutation of props, no conditional hooks).
- **Typed routes**: `PageProps<"/route">` and `LayoutProps<"/">` are globally available helpers (no import). `src/app/layout.tsx` already uses `LayoutProps<"/">`.
- `next.config.ts` sets `images.remotePatterns` to `https/**` so admin-entered image URLs work with `next/image`. That is permissive (the optimizer will fetch any https host) — narrow it to real CDNs if the app goes public.
- Next 16.4 bundles version-matched docs at `node_modules/next/dist/docs/` (see the managed block above). `next dev` rewrites the managed block in this file; keep it in your commits.

## External Express API (:8000)

- `src/lib/destinations-api.ts` — server-side `GET {DESTINATIONS_API_URL ?? "http://localhost:8000"}/destinations` (`cache: "no-store"`). Normalizes the payload: bare array, `{destinations|data|packages|results:[…]}`, or a single object. `getDestinationItems()` returns a `{ ok: true, items }` / `{ ok: false, message }` union — never throw inside a component (the `react-hooks/error-boundaries` lint rule rejects JSX in `try/catch`).
- Record shape: `{ _id, destinationName, country, category, price, duration, departureDate, imageUrl, description }`.
- `src/components/add-travel-package-form.tsx` posts to `{NEXT_PUBLIC_DESTINATIONS_API_URL ?? "http://localhost:8000"}/add-destination` **from the browser** (not via a route handler) — client components can only read `NEXT_PUBLIC_*` env vars, the server fetch reads the non-public one. Both are in `.env.example`.
- Seeded `imageUrl` values point at fake hosts → the `next/image` optimizer answers **500**, so `next/image` needs a client-side `onError` fallback (rows fall back to `public/images/destinations/imageN.png`). Keep that pattern for any admin-entered image URL.
- The Express backend is not in this repo — it must be running on :8000 for the form and `/destinations` to return data.

## UI components

- shadcn `base-nova` style on **@base-ui/react** (not Radix). `components.json` defines aliases: `@/components/ui`, `@/lib/utils`, `@/lib`, `@/hooks`, `@/components`.
- `src/components/ui/` only holds the primitives the app actually uses (`badge`, `button`, `carousel`, `dialog`, `empty`, `field`, `input`, `label`, `select`, `separator`, `skeleton`, `textarea`, `toast`). Unused ones were deleted; re-add with the CLI instead of hand-writing one.
- Add primitives with the shadcn CLI (`npx shadcn@latest add <name>`); it writes into `src/components/ui` and will overwrite local edits to those files. Most of `src/components/ui/` is vendored shadcn output — read the existing file before hand-editing, and match its conventions: `data-slot` attributes, `cva` variants, `cn()` for merging.
- Base UI primitives use a `render` prop instead of Radix's `asChild`. Follow the pattern already in the file you're editing.
- Class merging uses the **`cn` package** (`import { cn } from "cn"`), which replaces clsx + tailwind-merge. `src/lib/utils.ts` was deleted — don't add `clsx`/`tailwind-merge` dependencies, and import `cn` from `"cn"` directly.
- Fonts: Josefin Sans via `next/font/google` in `src/app/layout.tsx` — it is loaded with `variable: "--font-josefin-sans"` (not `className`), so it is exposed as a CSS variable only. `globals.css` maps `--font-heading` → `--font-josefin-sans` (display headings) and `--font-sans` → `--font-ui` (system stack for UI text). Use `font-heading` for big display type, `font-sans`/default for UI text.

## Assets, tokens & routes

- `public/images/` holds brand/hero art (`Wanderlast.png` = teal wordmark logo, `Banner.png` = hero photo, `CTA.png`, `destinations/image1-6.png` = image fallbacks, …).
- Brand teal is `#15a1bf` (sampled from the logo) and is exposed as the `brand` / `brand-dark` color tokens in `globals.css` — use `bg-brand` / `text-brand` instead of hardcoding hex.
- The landing page is being built top-down: `src/components/navbar.tsx` (+ `mobile-nav.tsx` client island), `banner.tsx`, `why-choose-us.tsx`, `testimonials.tsx` (embla carousel), `call-to-action.tsx` and `footer.tsx` exist; the rest of the page is not built yet.
- `public/images/Wanderlast.png` is the low-res teal wordmark (nav, 162×24) and `Wanderlast-1.png` is the high-res white one (542×80) used in the footer. Lucide v1 dropped brand icons, so the footer's X/LinkedIn/Instagram glyphs are inline SVGs in `footer.tsx`.
- Routes: `/` (landing page), `/add-destinations` (the "Add New Travel Package" form → `src/components/add-travel-package-form.tsx`, client component using shadcn `Field`/`Input`/`Select`/`Textarea` + the base-ui toast manager), `/destinations` (catalogue → `src/app/destinations/page.tsx` = heading + `<Suspense>` shell → async `DestinationsSection` that fetches via `getDestinationItems()` → `src/components/destination-list.tsx`, client component holding the row list, the Cancel action and the details `Dialog`), `/admin` (intentionally empty placeholder). `Navbar`/`Footer`/`Toaster` live in the root layout, so every route gets them — mount `Toaster` only once.
- The navbar links to `/bookings`, which does not exist yet — that route is the next thing to build.- `src/components/ui/carousel.tsx` (embla) exposes `Carousel`/`CarouselContent`/`CarouselItem`/`CarouselPrevious`/`CarouselNext`; `CarouselPrevious`/`CarouselNext` read context, so they must be rendered **inside** `<Carousel>` — override their default absolute positioning with `static` to place them in a header row.

## Database (MongoDB, local route handler)

- `mongoose` is installed (both `mongoose` and `mongodb` are in Next's default `serverExternalPackages`, so no `serverExternalPackages` config is needed).
- Env: `MONGODB_URI` (required) and optional `MONGODB_DB` — see `.env.example`; put real values in `.env.local` (gitignored).
- `src/lib/mongodb.ts` — cached connection singleton (`globalThis` cache survives dev hot-reload); `connectToDatabase()` throws a clear error when `MONGODB_URI` is missing.
- `src/models/travel-package.ts` — mongoose schema/model (`travel-packages` collection, `timestamps: true`); the model is re-used via `mongoose.models.TravelPackage ?? mongoose.model(...)` to avoid dev re-registration errors.
- `src/lib/travel-package.ts` — shared categories + server-side validation (`parseTravelPackageInput`), used by both the client form and the API route.
- `src/app/api/travel-packages/route.ts` — `POST` creates a package (400 bad JSON, 422 validation, 503 DB not configured/unreachable, 201 created) and `GET` lists the 100 newest, filtered server-side via `?category=&minPrice=&maxPrice=&sort=` (`recommended` | `price-asc` | `price-desc` | `rating` | `name`; invalid params → 400). Parsing/filter building lives in `src/lib/travel-packages-query.ts`; shared option lists live in `src/lib/travel-package.ts`. Both handlers call `await connection()` first so `cacheComponents` never prerenders them at build time.
- Without `MONGODB_URI` the API returns 503; the UI never talks to MongoDB directly.
