<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Travel landing site ("Wanderlust"), built with the Next.js 16.4 App Router. Frontend only — no API routes, no backend, no database, no auth.

## Commands

- `npm run dev` — dev server (Turbopack) on http://localhost:3000
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript)
- Type checking: `npx tsc --noEmit` (there is **no** `typecheck` script)
- There is **no** test framework installed and no `test` script. Don't invent one; verify with lint + `tsc --noEmit` + `npm run build`.

### Lint baseline

`npm run lint` currently fails with 2 pre-existing `react-hooks/set-state-in-effect` errors:
`src/hooks/use-mobile.ts:14` and `src/components/ui/carousel.tsx:98`. These are not your regressions — don't "fix" vendored shadcn components unless asked, but don't add new ones either.

## Stack quirks

- **Tailwind v4, CSS-first**: no `tailwind.config.js`. Design tokens live in `src/app/globals.css` under `@theme inline` + `:root` / `.dark` oklch variables. Add new colors/tokens there, not in a config file. `next.config.ts` registers the `@tailwindcss/turbopack` CSS loader — keep it if you touch the Turbopack rules.
- **`cacheComponents: true` + `partialPrefetching: true`** in `next.config.ts`:
  - Data fetching is dynamic by default; opt into caching per component/function with the `use cache` directive (plus `cacheLife` / `cacheTag`). PPR is on by default — `experimental.ppr` and `experimental_ppr` no longer exist.
  - Node runtime only: do not add a `runtime` segment export (`edge` is unsupported and will error).
  - `partialPrefetching` requires `cacheComponents`; never disable one without the other.
- **`reactCompiler: true`** — `babel-plugin-react-compiler` is installed and the compiler runs on every build. Keep component props/returns compiler-friendly (no mutation of props, no conditional hooks).
- **Typed routes**: `PageProps<"/route">` and `LayoutProps<"/">` are globally available helpers (no import). `src/app/layout.tsx` already uses `LayoutProps<"/">`.
- Next 16.4 bundles version-matched docs at `node_modules/next/dist/docs/` (see the managed block above). `next dev` rewrites the managed block in this file; keep it in your commits.

## UI components

- shadcn `base-nova` style on **@base-ui/react** (not Radix). `components.json` defines aliases: `@/components/ui`, `@/lib/utils`, `@/lib`, `@/hooks`, `@/components`.
- Add primitives with the shadcn CLI (`npx shadcn@latest add <name>`); it writes into `src/components/ui` and will overwrite local edits to those files. Most of `src/components/ui/` is vendored shadcn output — read the existing file before hand-editing, and match its conventions: `data-slot` attributes, `cva` variants, `cn()` for merging.
- Base UI primitives use a `render` prop instead of Radix's `asChild`. Follow the pattern already in the file you're editing.
- Class merging uses the **`cn` package** (`import { cn } from "cn"`), which replaces clsx + tailwind-merge. `src/lib/utils.ts` only re-exports it. Don't add `clsx`/`tailwind-merge` dependencies.
- Fonts: Josefin Sans via `next/font/google` in `src/app/layout.tsx` — it is loaded with `variable: "--font-josefin-sans"` (not `className`), so it is exposed as a CSS variable only. `globals.css` maps `--font-heading` → `--font-josefin-sans` (display headings) and `--font-sans` → `--font-ui` (system stack for UI text). Use `font-heading` for big display type, `font-sans`/default for UI text.

## Assets & tokens

- `public/images/` holds brand/hero art (`Wanderlast.png` = teal wordmark logo, `Banner.png` = hero photo, `CTA.png`, `destinations/`, …).
- Brand teal is `#15a1bf` (sampled from the logo) and is exposed as the `brand` / `brand-dark` color tokens in `globals.css` — use `bg-brand` / `text-brand` instead of hardcoding hex.
- The landing page is being built top-down: `src/components/navbar.tsx` (+ `mobile-nav.tsx` client island), `src/components/banner.tsx`, `src/components/why-choose-us.tsx`, `src/components/testimonials.tsx` (embla carousel), `src/components/call-to-action.tsx` and `src/components/footer.tsx` exist; the rest of the page is not built yet.
- `public/images/Wanderlast.png` is the low-res teal wordmark (nav, 162×24) and `Wanderlast-1.png` is the high-res white one (542×80) used in the footer. Lucide v1 dropped brand icons, so the footer's X/LinkedIn/Instagram glyphs are inline SVGs in `footer.tsx`.
- `src/components/ui/carousel.tsx` (embla) exposes `Carousel`/`CarouselContent`/`CarouselItem`/`CarouselPrevious`/`CarouselNext`; `CarouselPrevious`/`CarouselNext` read context, so they must be rendered **inside** `<Carousel>` — override their default absolute positioning with `static` to place them in a header row.

