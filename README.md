# Chirag Suthar — portfolio

A static portfolio site. Plain HTML, CSS and vanilla JavaScript on the front end;
the pages are generated once from a small data file so every project reads the
same way and nothing gets out of sync.

**No runtime dependencies. No framework. No bundler.** Open `index.html` and it runs.

---

## What is in here

```
index.html            home — hero, stats, selected work, services, process, stack
work.html             the full archive with filters and pointer previews
services.html         what I do, how engagements run, FAQs
about.html            track record, principles, languages
contact.html          brief form (email / WhatsApp), direct channels, FAQs
404.html
work/*.html           one case study per project (15)

assets/css/main.css   the whole design system
assets/js/main.js     preloader, cursor, reveals, counters, hero canvas,
                      pinned horizontal scroll, tilt, filters, form, transitions
assets/img/work/      project screenshots (WebP, two sizes each)
assets/img/og.png     social share image

data/site.mjs         profile, services, process, stack, principles, FAQs
data/projects.mjs     every project: copy, metrics, features, stack, links
tools/build.mjs       the generator that turns the data into the HTML above
```

## Editing content

1. Change the text in `data/site.mjs` or `data/projects.mjs`.
2. Run the build:

```bash
node tools/build.mjs      # or: npm run build
```

That rewrites the HTML files at the repository root and in `work/`. The generated
HTML is committed, so the site works on any host with no build step at deploy time.

### Adding a project

Append an object to `projects` in `data/projects.mjs`. The fields are documented at
the top of that file. Set `featured: true` to put it on the home page. A project with
no screenshot (`cover.src: null`) gets a generated SVG diagram instead — pick a
`cover.diagram` from `flow`, `ledger`, `automation`, `shield`, `roster`, `pivot`,
`mobile` or `craft`.

### Adding screenshots

Drop a wide screenshot in `assets/img/work/` as `<name>.webp` (1600×1000) plus a
`<name>@sm.webp` (900px wide) for the smaller srcset entry, then reference `<name>`
in the project's `cover.src` or a `gallery` entry. Long full-page shots are 1200px
wide with `long: true` so they render without a srcset.

## Running it locally

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000
```

## Deploying

**GitHub Pages** — push this branch, then in the repository settings set Pages to
deploy from that branch, root folder. `.nojekyll` is already committed so the
underscore-free asset paths are served as-is.

**Vercel / Netlify / Hostinger** — it is a static folder. No build command, no output
directory setting, upload or connect the repository and it serves.

After deploying, update `site.url` in `data/site.mjs` and rebuild, so the canonical
URLs, sitemap and social tags point at the real domain.

## Notes

- Fonts are Instrument Serif, Inter and JetBrains Mono, loaded from Google Fonts with
  system fallbacks.
- Dark theme by default with a light theme toggle; the choice is remembered in
  `localStorage` and applied before first paint, so there is no flash.
- `prefers-reduced-motion` is respected throughout: the preloader, cursor, hero canvas,
  pinned scroll, tilt and reveal animations all stand down.
- The contact form has no backend. It composes the message and hands it to the
  visitor's own email client or WhatsApp, so there is nothing to host and nothing
  stored.
- Every project screenshot was captured from the running product.

## Regenerating the social image

`assets/img/og.png` is a 1200×630 capture of the site's own hero. To refresh it,
serve the site locally and screenshot `index.html` at 1200×630 with the header and
scroll cue hidden.
