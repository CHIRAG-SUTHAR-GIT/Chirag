# Chirag Suthar — portfolio

Next.js 15 (App Router) + TypeScript, deployed on Node.js. Every page is
statically generated at build time except the GitHub stats API route, which
runs server-side with hourly revalidation.

## Stack

- **Next.js 15** / React 19 / TypeScript — App Router, `generateStaticParams`
  for the 15 case-study pages, the Metadata API for per-page SEO/OG tags.
- **`next/image`** — the work screenshots are served through Next's image
  optimizer (responsive sizes, modern formats, lazy loading) instead of
  hand-built WebP variants.
- **`next/font`** — Instrument Serif, Inter and JetBrains Mono are
  self-hosted at build time; no runtime request to Google Fonts.
- **A real Node.js API route** (`app/api/github/route.ts`) — proxies the
  GitHub stats shown in the hero widget server-side, cached for an hour, so
  visitor traffic never trips GitHub's unauthenticated rate limit the way a
  client-side fetch from every browser eventually would.
- Plain CSS (`app/globals.css`, `app/resume/resume.css`) — no Tailwind, no
  CSS-in-JS. The design system is bespoke and already fully worked out;
  utility classes wouldn't have made it faster to write or easier to read.
- The heavier interactive/visual pieces (custom cursor, the pointer glow,
  the ambient node-graph canvas, the live terminal snippets, the hero money-
  trail canvas, scroll reveals, card tilt, the pinned services scroll) are
  ported as small, cleanup-aware modules under `lib/fx/`, orchestrated by
  `components/SiteFx.tsx`. Genuinely page-independent effects (cursor, glow,
  the ambient canvas, the terminal feeds) start once and run for the whole
  session; effects that read page content (reveals, counters, the hero
  canvas, tilt, parallax) tear down and re-run on every route change.

## Structure

```
app/
  layout.tsx              root layout — fonts, header/footer, <SiteFx/>
  page.tsx                home
  work/page.tsx            archive with filters + pointer preview
  work/[slug]/page.tsx      one case study per project (SSG)
  services/, about/, resume/, contact/page.tsx
  api/github/route.ts      Node.js API route — GitHub stats, revalidated hourly
  sitemap.ts, robots.ts    Next's native file conventions
  globals.css              the whole design system

components/                Header, Footer, Cta, WorkCard, ProjectShot,
                            Artwork (generated SVG diagrams), GhCard,
                            WorkArchive, ContactForm, WhoamiCard, Faq, icons

lib/
  data/site.ts             profile, services, process, stack, FAQs
  data/projects.ts         every project — copy, metrics, features, stack
  fx/                       cursor.ts, glow.ts, forensic.ts, termfeed.ts,
                            reveal.ts, counters.ts, trail.ts, hscroll.ts,
                            tilt.ts, parallax.ts, preloader.ts — each
                            exports an init() that returns its own cleanup

public/
  assets/img/work/          project screenshots (WebP)
  assets/resume/            the downloadable résumé PDF
```

## Editing content

Everything text-based lives in `lib/data/site.ts` and `lib/data/projects.ts`
— typed, so a missing field is a build error, not a silent gap on the page.
Add a project by appending to the `projects` array in `data/projects.ts`;
set `featured: true` to put it on the home page. A project with no
screenshot (`cover.src: null`) gets one of the generated SVG diagrams in
`components/Artwork.tsx` — pick a `cover.diagram` from `flow`, `ledger`,
`automation`, `shield`, `roster`, `pivot`, `mobile` or `craft`.

Drop a new screenshot in `public/assets/img/work/` and reference its base
name (no extension) in a project's `cover.src` or `gallery` entries —
`next/image` handles the responsive sizing from there.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # production build + serve
npm run typecheck            # tsc --noEmit
```

## Deploying

This needs a Node.js runtime (for the API route and on-demand image
optimization) — it is **not** a static export, so it will not serve as-is
from GitHub Pages the way the previous version of this site did.

**Vercel** (recommended — this is the same platform the Veer Aluminium
project already runs on): connect the repository, no build command or
output directory overrides needed, it detects Next.js automatically.

**Any other Node.js host**: `npm run build` then `npm start` (reads `PORT`
from the environment). Update `site.url` in `lib/data/site.ts` to the real
domain and rebuild so canonical URLs, the sitemap and social tags follow it.

## Regenerating the résumé PDF

The PDF at `public/assets/resume/chirag-suthar-resume.pdf` is a print
capture of the `/resume` page, not maintained by hand. To refresh it after
editing résumé content:

```bash
npm install -D playwright && npx playwright install chromium
npm run build && npm start &
node scripts/gen-resume-pdf.mjs http://localhost:3000
```

## Notes

- Dark theme by default with a light-theme toggle; the choice persists in
  `localStorage` and is applied before hydration via a small inline script
  in the root layout, so there's no flash.
- `prefers-reduced-motion` is honoured throughout — the preloader, cursor,
  ambient canvas, terminal feeds, hero canvas, pinned scroll, tilt and
  reveal animations all stand down.
- The contact form has no backend by design: it composes the message and
  hands it to the visitor's own email client or WhatsApp. Nothing is stored
  and nothing needs hosting.
- Every project screenshot was captured from the running product, not a
  mockup.
- The preloader now plays once per session (cold start) rather than on
  every navigation, since Next's client-side routing doesn't reload the
  document the way the previous static site's full page loads did.
