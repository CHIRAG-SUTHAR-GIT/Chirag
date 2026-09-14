/* =========================================================================
   Static site generator.
   Reads data/*.mjs, writes plain HTML to the repository root and /work.
   No dependencies. Run: node tools/build.mjs
   ========================================================================= */
import { writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, nav, hero, stats, marquee, services, process as steps, stack, principles, timeline, faqs } from '../data/site.mjs';
import { projects } from '../data/projects.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = (s = '') => esc(s).replace(/'/g, '&#39;');

/* ---------------------------------------------------------------- icons */
const I = {
  arrow: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 12L12 4M12 4H5.5M12 4v6.5"/></svg>',
  arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
  moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 13a9 9 0 11-10-10 7 7 0 0010 10z"/></svg>',
  sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="10.5" width="16" height="10.5" rx="2"/><path d="M8 10.5V7a4 4 0 018 0v3.5"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 00-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.72-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 016 0c2.29-1.56 3.3-1.24 3.3-1.24.65 1.66.24 2.88.12 3.18.77.84 1.23 1.92 1.23 3.24 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0012 .5z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.5 3.68 1.4 5.22L2 22l5.06-1.56a9.8 9.8 0 004.98 1.35h.01c5.43 0 9.84-4.4 9.84-9.84S17.47 2 12.04 2zm0 17.9a8.1 8.1 0 01-4.13-1.13l-.3-.18-3.05.94.94-2.97-.2-.31a8.07 8.07 0 01-1.24-4.31c0-4.47 3.63-8.1 8.1-8.1a8.1 8.1 0 018.09 8.1c0 4.47-3.64 8.1-8.1 8.1zm4.44-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3 7l9 6 9-6"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M12 11v5.5M12 7.6v.9"/></svg>',
};

/* -------------------------------------------------- generated cover art */
function artwork(kind, accent = '#ffb020', label = '') {
  const rnd = (seed) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x); };
  let inner = '';

  if (kind === 'flow') {
    const layers = 5;
    let nodes = [];
    for (let l = 0; l < layers; l++) {
      const c = l === 0 ? 1 : l === layers - 1 ? 4 : 3;
      for (let i = 0; i < c; i++) {
        nodes.push({ x: 90 + (l * 620) / (layers - 1), y: 250 + (c === 1 ? 0 : (i / (c - 1) - 0.5) * 300), l, i });
      }
    }
    let paths = '';
    nodes.filter((n) => n.l > 0).forEach((n, k) => {
      const prev = nodes.filter((p) => p.l === n.l - 1).sort((a, b) => Math.abs(a.y - n.y) - Math.abs(b.y - n.y))[0];
      if (!prev) return;
      const mx = (prev.x + n.x) / 2;
      paths += `<path d="M${prev.x} ${prev.y} C${mx} ${prev.y} ${mx} ${n.y} ${n.x} ${n.y}" fill="none" stroke="${accent}" stroke-opacity=".34" stroke-width="1.2"/>
      <circle r="3" fill="${accent}"><animateMotion dur="${(3 + rnd(k) * 3).toFixed(1)}s" repeatCount="indefinite" path="M${prev.x} ${prev.y} C${mx} ${prev.y} ${mx} ${n.y} ${n.x} ${n.y}"/><animate attributeName="opacity" values="0;1;1;0" dur="${(3 + rnd(k) * 3).toFixed(1)}s" repeatCount="indefinite"/></circle>`;
    });
    const dots = nodes
      .map((n, k) => {
        if (n.l === 0) return `<circle cx="${n.x}" cy="${n.y}" r="9" fill="${accent}"/><circle cx="${n.x}" cy="${n.y}" r="20" fill="${accent}" opacity=".14"><animate attributeName="r" values="16;30;16" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".2;0;.2" dur="4s" repeatCount="indefinite"/></circle>`;
        if (n.l === layers - 1) return `<circle cx="${n.x}" cy="${n.y}" r="6" fill="none" stroke="#5eead4" stroke-width="1.4"/><circle cx="${n.x}" cy="${n.y}" r="2.4" fill="#5eead4"/>`;
        if (rnd(k * 7) < 0.22) return `<rect x="${n.x - 6}" y="${n.y - 6}" width="12" height="12" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.2"/>`;
        return `<circle cx="${n.x}" cy="${n.y}" r="4.2" fill="currentColor" fill-opacity=".42"/>`;
      })
      .join('');
    inner = paths + dots;
  } else if (kind === 'ledger') {
    let rows = '';
    for (let i = 0; i < 11; i++) {
      const y = 92 + i * 32;
      const w = 150 + rnd(i) * 300;
      rows += `<rect x="90" y="${y}" width="${w}" height="7" rx="3.5" fill="currentColor" fill-opacity="${(0.09 + rnd(i * 3) * 0.13).toFixed(2)}"/>
      <rect x="560" y="${y}" width="${40 + rnd(i * 5) * 90}" height="7" rx="3.5" fill="${i % 4 === 0 ? accent : 'currentColor'}" fill-opacity="${i % 4 === 0 ? 0.85 : 0.16}"/>`;
    }
    inner = rows + `<rect x="90" y="60" width="620" height="1.2" fill="${accent}" fill-opacity=".6"/><rect x="90" y="452" width="620" height="1.2" fill="currentColor" fill-opacity=".2"/>`;
  } else if (kind === 'automation') {
    let g = '';
    for (let i = 0; i < 6; i++) {
      const x = 110 + i * 116;
      g += `<rect x="${x - 34}" y="216" width="68" height="68" rx="12" fill="none" stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
      <rect x="${x - 34}" y="216" width="68" height="68" rx="12" fill="${accent}" fill-opacity=".07"/>`;
      if (i < 5) g += `<path d="M${x + 40} 250h36" stroke="${accent}" stroke-opacity=".5" stroke-width="1.3"/><circle r="3.2" fill="${accent}"><animateMotion dur="${2.4 + i * 0.2}s" repeatCount="indefinite" path="M${x + 40} 250h36"/></circle>`;
      g += `<circle cx="${x}" cy="250" r="${5 + (i % 3)}" fill="${accent}" fill-opacity=".8"><animate attributeName="fill-opacity" values=".25;.9;.25" dur="2.6s" begin="${i * 0.32}s" repeatCount="indefinite"/></circle>`;
    }
    inner = g;
  } else if (kind === 'shield') {
    inner = `<path d="M400 120l150 58v128c0 96-66 158-150 186-84-28-150-90-150-186V178z" fill="none" stroke="${accent}" stroke-opacity=".55" stroke-width="1.6"/>
    <path d="M400 120l150 58v128c0 96-66 158-150 186-84-28-150-90-150-186V178z" fill="${accent}" fill-opacity=".05"/>
    <path d="M340 300l42 44 84-92" fill="none" stroke="${accent}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="200" stroke-dashoffset="200"><animate attributeName="stroke-dashoffset" values="200;0" dur="1.6s" begin="0.4s" fill="freeze"/></path>
    <circle cx="400" cy="290" r="180" fill="none" stroke="currentColor" stroke-opacity=".14" stroke-dasharray="3 9"><animateTransform attributeName="transform" type="rotate" from="0 400 290" to="360 400 290" dur="42s" repeatCount="indefinite"/></circle>`;
  } else if (kind === 'roster') {
    let g = '';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 9; c++) {
        const on = rnd(r * 9 + c) > 0.32;
        g += `<rect x="${120 + c * 64}" y="${140 + r * 56}" width="46" height="38" rx="7" fill="${on ? accent : 'currentColor'}" fill-opacity="${on ? (0.2 + rnd(r + c) * 0.6).toFixed(2) : 0.07}"/>`;
      }
    }
    inner = g + `<rect x="120" y="112" width="574" height="1" fill="currentColor" fill-opacity=".2"/>`;
  } else if (kind === 'pivot') {
    let g = '';
    for (let c = 0; c < 4; c++) {
      const h = 60 + rnd(c) * 210;
      g += `<rect x="${180 + c * 118}" y="${400 - h}" width="66" height="${h}" rx="6" fill="${accent}" fill-opacity="${(0.25 + c * 0.18).toFixed(2)}"><animate attributeName="height" values="0;${h}" dur="1.1s" begin="${c * 0.12}s" fill="freeze"/><animate attributeName="y" values="400;${400 - h}" dur="1.1s" begin="${c * 0.12}s" fill="freeze"/></rect>`;
    }
    inner = g + `<path d="M140 400h520" stroke="currentColor" stroke-opacity=".25"/><path d="M140 120v280" stroke="currentColor" stroke-opacity=".25"/>`;
  } else if (kind === 'mobile') {
    inner = `<rect x="322" y="96" width="156" height="308" rx="24" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="1.5"/>
    <rect x="334" y="118" width="132" height="264" rx="14" fill="${accent}" fill-opacity=".07"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="350" y="${140 + i * 38}" width="${60 + rnd(i) * 40}" height="8" rx="4" fill="currentColor" fill-opacity=".22"/><rect x="426" y="${140 + i * 38}" width="24" height="8" rx="4" fill="${accent}" fill-opacity=".7"/>`).join('')}
    <circle cx="400" cy="392" r="6" fill="currentColor" fill-opacity=".3"/>`;
  } else {
    // craft — concentric drafting arcs
    inner = Array.from({ length: 7 }, (_, i) =>
      `<circle cx="400" cy="260" r="${52 + i * 30}" fill="none" stroke="${i % 2 ? accent : 'currentColor'}" stroke-opacity="${i % 2 ? 0.3 : 0.14}" stroke-width="1.1"/>`
    ).join('') + `<path d="M180 260h440M400 60v400" stroke="currentColor" stroke-opacity=".12"/>`;
  }

  return `<div class="artwork" style="--art:${accent}">
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${attr(label || 'Abstract diagram')}">${inner}</svg>
    ${label ? `<span class="artwork__tag">${esc(label)}</span>` : ''}
  </div>`;
}

/* ------------------------------------------------------------ fragments */
const themeBoot = `<script>(function(){try{var t=localStorage.getItem('cs-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>`;

function head({ title, desc, path = '', og = 'assets/img/og.png', jsonld = '', extraCss = [] }) {
  const base = path.startsWith('work/') ? '../' : '';
  const url = `${site.url}/${path}`;
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(desc)}">
<meta name="author" content="${attr(site.name)}">
<meta name="theme-color" content="${site.themeColor}">
<link rel="canonical" href="${attr(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${attr(site.name)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:url" content="${attr(url)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:image" content="${site.url}/${base ? '' : ''}assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(site.name)} — ${attr(site.role)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${site.url}/assets/img/og.png">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(desc)}">
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}favicon.svg">
<link rel="manifest" href="${base}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/css/main.css">
${extraCss.map((href) => `<link rel="stylesheet" href="${base}${href}">`).join('\n')}
${themeBoot}
${jsonld ? `<script type="application/ld+json">${jsonld}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="grain" aria-hidden="true"></div>
<div class="glow" aria-hidden="true"></div>
<div class="curtain" aria-hidden="true"></div>
<div class="cur" aria-hidden="true"><span class="cur__label"></span></div>
<div class="cur-dot" aria-hidden="true"></div>`;
}

function preloader() {
  return `<div class="pre" role="status" aria-live="polite">
  <div class="pre__inner">
    <div class="pre__name">Chirag Suthar</div>
    <div class="pre__bar"><i></i></div>
    <div class="pre__pct">000%</div>
  </div>
</div>`;
}

function header(path = '') {
  const base = path.startsWith('work/') ? '../' : '';
  return `<header class="hdr">
  <div class="hdr__in">
    <a class="brand" href="${base}index.html" aria-label="${attr(site.name)} — home">
      <span class="brand__mark">Chirag&nbsp;Suthar<span class="brand__dot"></span></span>
      <span class="brand__sub">Developer</span>
    </a>
    <nav class="nav" aria-label="Primary">
      ${nav.map((n) => `<a href="${base}${n.href}">${esc(n.label)}</a>`).join('\n      ')}
    </nav>
    <div class="hdr__side">
      <a class="icon-btn" href="${site.github}" target="_blank" rel="noopener" aria-label="Open GitHub profile" data-cursor="GitHub">${I.github}</a>
      <button class="icon-btn theme-btn" data-theme-toggle type="button" aria-label="Switch colour theme">${I.moon}${I.sun}</button>
      <a class="btn btn--sm btn--solid hide-sm" href="${base}contact.html">Start a project</a>
      <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mmenu"><i></i><i></i></button>
    </div>
  </div>
</header>
<div class="mmenu" id="mmenu">
  <nav aria-label="Mobile">
    <ol>
      ${[{ label: 'Home', href: 'index.html' }, ...nav]
        .map((n, i) => `<li><a href="${base}${n.href}"><span class="mmenu__n">0${i + 1}</span>${esc(n.label)}</a></li>`)
        .join('\n      ')}
    </ol>
  </nav>
  <div class="mmenu__foot">
    <a href="mailto:${site.email}">${site.email}</a>
    <a href="tel:${site.phoneHref}">${site.phone}</a>
    <a href="${site.github}" target="_blank" rel="noopener">GitHub</a>
  </div>
</div>`;
}

function cta(path = '') {
  const base = path.startsWith('work/') ? '../' : '';
  return `<section class="cta">
  <div class="wrap">
    <h2 class="cta__big rv">Let's build<br>something <em>that works</em>.</h2>
    <p class="cta__sub rv rv-d1">Tell me what the software has to do and who has to use it. You will get a straight answer on scope, timeline and price — and if I am not the right person for it, I will say so.</p>
    <div class="cta__row rv rv-d2">
      <a class="btn btn--solid" href="${base}contact.html" data-cursor="Go">Start a project ${I.arrow}</a>
      <a class="btn" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">WhatsApp ${I.arrow}</a>
      <a class="btn" href="mailto:${site.email}">${site.email}</a>
    </div>
  </div>
</section>`;
}

function footer(path = '') {
  const base = path.startsWith('work/') ? '../' : '';
  const feat = projects.filter((p) => p.featured).slice(0, 5);
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr__grid">
      <div>
        <div class="ftr__name">Chirag Suthar</div>
        <p class="ftr__blurb">${esc(site.role)}. Data systems and automation for cyber crime investigation, and product work for businesses that need software that earns its keep.</p>
        <p class="ftr__blurb"><span class="avail" style="margin-top:1rem"><i></i>${esc(site.availability)}</span></p>
      </div>
      <div>
        <h3>Selected work</h3>
        <ul>${feat.map((p) => `<li><a href="${base}work/${p.slug}.html">${esc(p.title)}</a></li>`).join('')}
        <li><a href="${base}work.html">All projects</a></li></ul>
      </div>
      <div>
        <h3>Site</h3>
        <ul>${nav.map((n) => `<li><a href="${base}${n.href}">${esc(n.label)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Elsewhere</h3>
        <ul>
          <li><a href="mailto:${site.email}">${site.email}</a></li>
          <li><a href="tel:${site.phoneHref}">${site.phone}</a></li>
          <li><a href="${site.github}" target="_blank" rel="noopener">GitHub</a></li>
          <li><a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="ftr__bot">
      <span>&copy; <span data-year>2026</span> Chirag Suthar — ${esc(site.location)}</span>
      <span>Built from scratch. No page builder, no template.</span>
    </div>
  </div>
</footer>`;
}

function foot(path = '') {
  const base = path.startsWith('work/') ? '../' : '';
  return `<script src="${base}assets/js/main.js" defer></script>
</body>
</html>`;
}

/* ---------------------------------------------------------- card + shot */
function shot(p, base = '', { chromeUrl = true, lazy = true } = {}) {
  if (p.cover.src) {
    const url = (p.links.find((l) => l.kind === 'live') || {}).href;
    const host = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${p.slug}`;
    return `<div class="chrome">
      ${chromeUrl ? `<span class="chrome__dots"><i></i><i></i><i></i></span><span class="chrome__url">${esc(host)}</span>` : ''}
      <img src="${base}assets/img/work/${p.cover.src}.webp"
           srcset="${base}assets/img/work/${p.cover.src}@sm.webp 900w, ${base}assets/img/work/${p.cover.src}.webp 1600w"
           sizes="(max-width: 950px) 100vw, 60vw"
           width="${p.cover.w}" height="${p.cover.h}" alt="${attr(p.cover.alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}>
    </div>`;
  }
  return artwork(p.cover.diagram, p.accent, p.category);
}

function workCard(p, i, base = '') {
  const live = p.links.find((l) => l.kind === 'live');
  return `<article class="work-card rv" data-tilt>
  <a class="work-card__link" href="${base}work/${p.slug}.html" data-cursor="View">
    <div class="work-card__shot">${shot(p, base)}</div>
    <div class="work-card__body">
      <div>
        <h3 class="work-card__title">${esc(p.title)}</h3>
        <p class="work-card__sub">${esc(p.summary)}</p>
        <p class="work-card__tag">${esc(p.tag)}</p>
      </div>
      <div class="pills">
        ${live ? '<span class="pill pill--live">Live</span>' : ''}
        ${p.confidential ? `<span class="pill pill--lock">Restricted</span>` : ''}
        <span class="pill">${esc(p.category)}</span>
      </div>
    </div>
  </a>
</article>`;
}

/* -------------------------------------------------------------- GitHub card */
function ghCard() {
  return `<div class="ghcard rv rv-d3" data-ghcard data-gh-user="${attr(site.githubHandle)}">
    <div class="ghcard__top">
      <span class="ghcard__avatar ghcard__avatar--fallback" data-gh-avatar-fallback aria-hidden="true">CS</span>
      <img class="ghcard__avatar" data-gh-avatar width="40" height="40" alt="${attr(site.name)} on GitHub" loading="lazy" decoding="async" hidden>
      <div class="ghcard__id">
        <span class="ghcard__name">@${esc(site.githubHandle)}</span>
        <span class="ghcard__sub"><i></i>Live from GitHub</span>
      </div>
      <a class="ghcard__link" href="${site.github}" target="_blank" rel="noopener" aria-label="Open GitHub profile">${I.arrow}</a>
    </div>
    <div class="ghcard__stats">
      <div><b data-gh-repos>—</b><span>Repos</span></div>
      <div><b data-gh-followers>—</b><span>Followers</span></div>
      <div><b data-gh-stars>—</b><span>Stars</span></div>
    </div>
    <div class="ghcard__chartwrap">
      <img class="ghcard__chart" data-gh-chart alt="${attr(site.name)}’s GitHub contribution graph" loading="lazy" decoding="async">
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ home */
function pageIndex() {
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    url: site.url,
    address: { '@type': 'PostalAddress', addressRegion: 'Gujarat', addressCountry: 'IN' },
    sameAs: [site.github, site.linkedin],
    knowsAbout: ['Python', 'Data analytics', 'Fraud analysis', 'Automation', 'Next.js', 'React', 'Android'],
  });

  const feat = projects.filter((p) => p.featured);

  return `${head({
    title: `${site.name} — ${site.role} | ${site.tagline}`,
    desc: site.description,
    path: '',
    jsonld,
  })}
${preloader()}
${header()}
<main id="main">

  <section class="hero">
    <canvas class="hero__canvas" aria-hidden="true"></canvas>
    <div class="hero__veil" aria-hidden="true"></div>
    <div class="hero__in wrap">
      <div class="hero__grid">
        <div>
          <p class="eyebrow line-mask"><span>${esc(hero.eyebrow)}</span></p>
          <h1 class="d1">
            ${hero.lines
              .map((l, i) => `<span class="line-mask"><span>${i === 1 ? `<em>${esc(l)}</em>` : esc(l)}</span></span>`)
              .join('\n            ')}
          </h1>
        </div>
        <div class="hero__meta">
          <span class="avail rv rv-d2"><i></i>${esc(site.availability)}</span>
          <p class="hero__intro rv rv-d2">${esc(hero.intro)}</p>
          ${ghCard()}
          <div class="hero__cta rv rv-d4">
            <a class="btn btn--solid" href="work.html" data-cursor="View">See the work ${I.arrow}</a>
            <a class="btn" href="contact.html">Start a project</a>
          </div>
        </div>
      </div>
    </div>
    <div class="hero__scroll" aria-hidden="true"><span>Scroll</span><i></i></div>
  </section>

  <div class="mq" aria-hidden="true">
    <div class="mq__track">
      ${marquee.map((m) => `<span class="mq__item">${esc(m)}</span>`).join('')}
    </div>
  </div>

  <section class="section--tight">
    <div class="stats">
      ${stats
        .map(
          (s) => `<div class="stat rv">
        <div class="stat__v"><span data-count="${s.value}">${s.value}</span>${s.suffix ? `<sup>${esc(s.suffix)}</sup>` : ''}</div>
        <p class="stat__l">${esc(s.label)}</p>
      </div>`
        )
        .join('\n      ')}
    </div>
  </section>

  <section class="section" id="work">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Selected work</p>
          <h2 class="d2 rv rv-d1" style="margin-top:1.1rem">Systems in daily use,<br><span class="it accent">not concepts.</span></h2>
        </div>
        <p class="lede rv rv-d2">Every screenshot below was captured from the real product. Where a project runs on live case data, there is a diagram instead of a demo and a straight explanation of why.</p>
      </div>
      <div class="work-grid">
        ${feat.map((p, i) => workCard(p, i)).join('\n        ')}
      </div>
      <p style="margin-top:clamp(2.5rem,5vw,4rem)" class="rv">
        <a class="tlink" href="work.html">See all ${projects.length} projects ${I.arrow}</a>
      </p>
    </div>
  </section>

  <section class="section hscroll" id="services">
    <div class="hscroll__sticky">
      <div style="width:100%">
        <div class="wrap" style="padding-bottom:clamp(1.5rem,3vw,2.5rem)">
          <p class="eyebrow rv">What I do</p>
          <h2 class="d3 rv rv-d1" style="margin-top:0.9rem;max-width:22ch">Four kinds of work, one standard of finish.</h2>
        </div>
        <div class="hscroll__track">
          ${services
            .map(
              (s) => `<article class="svc rv">
            <span class="svc__n">${esc(s.n)}</span>
            <h3 class="svc__t">${esc(s.title)}</h3>
            <p class="svc__s">${esc(s.summary)}</p>
            <ul>${s.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
          </article>`
            )
            .join('\n          ')}
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">How I work</p>
          <h2 class="d2 rv rv-d1" style="margin-top:1.1rem">Four steps, <span class="it accent">no theatre.</span></h2>
        </div>
        <p class="lede rv rv-d2">Most projects fail in the gap between what was asked for and what was needed. This is how I close it.</p>
      </div>
      <div class="steps">
        ${steps
          .map(
            (s) => `<article class="step rv">
          <div class="step__n">${esc(s.n)}</div>
          <h3 class="step__t">${esc(s.title)}</h3>
          <p class="step__b">${esc(s.body)}</p>
        </article>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Stack</p>
          <h2 class="d2 rv rv-d1" style="margin-top:1.1rem">Tools I reach for.</h2>
        </div>
        <p class="lede rv rv-d2">Chosen per problem, not per fashion. A static page beats a framework when a framework buys nothing.</p>
      </div>
      <div class="stack-grid rv">
        ${stack
          .map(
            (g) => `<div class="stack-cell">
          <h3>${esc(g.group)}</h3>
          <ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>

</main>
${cta()}
${footer()}
${foot()}`;
}

/* --------------------------------------------------------------- work.html */
function pageWork() {
  const tagFor = (c) =>
    ({
      'Data platform': 'data',
      'Investigation tooling': 'data',
      'Public service': 'data',
      'Reporting tool': 'data',
      'Automation': 'automation',
      'Internal tool': 'automation',
      'Website & CRM': 'web',
      'Web platform': 'web',
      'Website': 'web',
      'Android app': 'mobile',
    }[c] || 'other');
  const filters = [
    { k: 'all', l: 'All work' },
    { k: 'cyber', l: 'Cyber & data' },
    { k: 'client', l: 'Client work' },
    { k: 'web', l: 'Websites & platforms' },
    { k: 'data', l: 'Data & analysis' },
    { k: 'automation', l: 'Automation & tools' },
    { k: 'mobile', l: 'Mobile' },
  ];

  return `${head({
    title: `Work — ${site.name}`,
    desc: 'Fifteen projects: fraud analysis platforms, automation bots, investigation tooling, client websites, quotation engines and an Android app in daily commercial use.',
    path: 'work.html',
  })}
${header()}
<main id="main">
  <section class="phero">
    <div class="wrap">
      <div class="phero__grid">
        <div>
          <p class="eyebrow line-mask"><span>Archive</span></p>
          <h1 class="d1" style="margin-top:1.2rem">
            <span class="line-mask"><span>The whole</span></span>
            <span class="line-mask"><span class="it accent">shelf.</span></span>
          </h1>
        </div>
        <p class="lede rv rv-d2">Everything worth showing, cyber and client work together. <span data-arch-count>${String(projects.length).padStart(2, '0')}</span> projects listed. On a desktop, hover a row to preview it.</p>
      </div>
    </div>
  </section>

  <section class="section--tight">
    <div class="wrap">
      <div class="filters">
        ${filters
          .map((f) => `<button class="filter" data-filter="${f.k}" aria-pressed="${f.k === 'all'}" type="button">${esc(f.l)}</button>`)
          .join('\n        ')}
      </div>

      <div class="arch" data-archive>
        ${projects
          .map(
            (p, i) => `<a class="arch__row" href="work/${p.slug}.html" data-tags="${attr(p.group + ' ' + tagFor(p.category))}"${p.cover.src ? ` data-peek="assets/img/work/${p.cover.src}@sm.webp"` : ''} data-cursor="Open">
          <span class="arch__n">${String(i + 1).padStart(2, '0')}</span>
          <span>
            <span class="arch__t">${esc(p.title)}</span>
            <span class="arch__m" style="display:block;margin-top:.35rem">${esc(p.client)}</span>
          </span>
          <span class="arch__s">${esc(p.subtitle)}</span>
          <span class="arch__m">${esc(p.tag)}</span>
          <span class="arch__go">${I.arrow}</span>
        </a>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>

  <div class="peek" aria-hidden="true"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" width="340" height="212"></div>
</main>
${cta()}
${footer()}
${foot()}`;
}

/* ----------------------------------------------------------- services.html */
function pageServices() {
  return `${head({
    title: `Services — ${site.name}`,
    desc: 'Data and fraud analytics, automation and internal tools, websites that sell, and Android field apps. What each engagement includes, and how it is priced.',
    path: 'services.html',
  })}
${header()}
<main id="main">
  <section class="phero">
    <div class="wrap">
      <div class="phero__grid">
        <div>
          <p class="eyebrow line-mask"><span>Services</span></p>
          <h1 class="d1" style="margin-top:1.2rem">
            <span class="line-mask"><span>Software that</span></span>
            <span class="line-mask"><span class="it accent">pays for itself.</span></span>
          </h1>
        </div>
        <p class="lede rv rv-d2">Four kinds of work. Each one scoped in writing, priced fixed, handed over with the source and an admin surface so you are never locked to me.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="steps">
        ${services
          .map(
            (s) => `<article class="step rv">
          <div class="step__n">${esc(s.n)}</div>
          <div>
            <h2 class="step__t">${esc(s.title)}</h2>
            <p class="step__b" style="margin-top:.7rem">${esc(s.summary)}</p>
          </div>
          <ul class="checks">${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        </article>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Engagement</p>
          <h2 class="d2 rv rv-d1" style="margin-top:1.1rem">How it runs.</h2>
        </div>
        <p class="lede rv rv-d2">No retainers you cannot leave, no invoices you did not expect.</p>
      </div>
      <div class="pcards rv">
        <div class="pcard"><h3>Fixed scope, fixed price</h3><p>You get a written scope and a number before anything starts. If the scope changes, the number changes in writing first.</p></div>
        <div class="pcard"><h3>Milestone payments</h3><p>Typically an advance, a payment at a working build, and the balance at handover. No large sum sitting against nothing.</p></div>
        <div class="pcard"><h3>Full handover</h3><p>Source code, deployment in your name, credentials, documentation and an admin panel. Yours to take anywhere.</p></div>
        <div class="pcard"><h3>Support after launch</h3><p>Thirty days of fixes included on every build. Longer arrangements available, monthly and cancellable.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Questions</p>
          <h2 class="d2 rv rv-d1" style="margin-top:1.1rem">Answered straight.</h2>
        </div>
      </div>
      <div class="faq">
        ${faqs
          .map(
            (f, i) => `<div class="faq__item">
          <button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-${i}">${esc(f.q)}<i aria-hidden="true"></i></button>
          <div class="faq__a" id="faq-${i}" aria-hidden="true"><div><p>${esc(f.a)}</p></div></div>
        </div>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>
</main>
${cta()}
${footer()}
${foot()}`;
}

/* -------------------------------------------------------------- about.html */
function pageAbout() {
  return `${head({
    title: `About — ${site.name}`,
    desc: 'Python developer at the Cyber Centre of Excellence, Gujarat State. How I work, what I care about, and what I have shipped.',
    path: 'about.html',
  })}
${header()}
<main id="main">
  <section class="phero">
    <div class="wrap">
      <div class="phero__grid">
        <div>
          <p class="eyebrow line-mask"><span>About</span></p>
          <h1 class="d1" style="margin-top:1.2rem">
            <span class="line-mask"><span>I build tools</span></span>
            <span class="line-mask"><span>for people with</span></span>
            <span class="line-mask"><span class="it accent">real deadlines.</span></span>
          </h1>
        </div>
        <div class="rv rv-d2" style="display:grid;gap:1.25rem">
          <p class="lede">Most of my week is spent inside cyber crime data: bank statements by the million rows, complaint exports, portal work that used to be done by hand. The rest goes to businesses who need a website, a dashboard or an app that actually moves their numbers.</p>
          <p class="lede">The two halves teach each other. Investigation work makes you paranoid about correctness. Client work makes you honest about deadlines.</p>
          <div class="cta__row" style="justify-content:flex-start">
            <a class="btn btn--solid" href="resume.html" data-cursor="Résumé">View résumé ${I.arrow}</a>
            <a class="btn" href="${site.resumePdf}" download>Download PDF ${I.arrow}</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section--tight">
    <div class="wrap">
      <div class="stats" style="border-radius:0">
        ${stats
          .map(
            (s) => `<div class="stat rv">
          <div class="stat__v"><span data-count="${s.value}">${s.value}</span>${s.suffix ? `<sup>${esc(s.suffix)}</sup>` : ''}</div>
          <p class="stat__l">${esc(s.label)}</p>
        </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Track record</p>
          <h2 class="d2 rv rv-d1" style="margin-top:1.1rem">Where the work has been done.</h2>
        </div>
      </div>
      <div class="tl">
        ${timeline
          .map(
            (t) => `<article class="tl__item rv">
          <div>
            <div class="tl__when">${esc(t.period)}</div>
            <h3 class="tl__org">${esc(t.org)}</h3>
            <div class="tl__role">${esc(t.role)}</div>
          </div>
          <ul class="tl__pts">${t.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        </article>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Principles</p>
          <h2 class="d2 rv rv-d1" style="margin-top:1.1rem">What I will not trade away.</h2>
        </div>
      </div>
      <div class="pcards rv">
        ${principles.map((p) => `<div class="pcard"><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap two-col">
      <div>
        <p class="eyebrow rv">Working languages</p>
        <h2 class="d3 rv rv-d1" style="margin-top:1rem">English, Hindi, Gujarati.</h2>
        <p class="lede rv rv-d2" style="margin-top:1.25rem">Client conversations, officer walkthroughs and documentation, in whichever of the three is easiest for the person on the other side.</p>
      </div>
      <div class="rv rv-d2">
        <div class="stack-grid">
          ${stack
            .slice(0, 4)
            .map((g) => `<div class="stack-cell"><h3>${esc(g.group)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`)
            .join('')}
        </div>
      </div>
    </div>
  </section>
</main>
${cta()}
${footer()}
${foot()}`;
}

/* ------------------------------------------------------------ contact.html */
function pageContact() {
  return `${head({
    title: `Contact — ${site.name}`,
    desc: `Start a project with Chirag Suthar. Email ${site.email}, call ${site.phone}, or send the brief straight to WhatsApp.`,
    path: 'contact.html',
  })}
${header()}
<main id="main">
  <section class="phero">
    <div class="wrap">
      <div class="phero__grid">
        <div>
          <p class="eyebrow line-mask"><span>Contact</span></p>
          <h1 class="d1" style="margin-top:1.2rem">
            <span class="line-mask"><span>Tell me what</span></span>
            <span class="line-mask"><span>it has to <span class="it accent">do.</span></span></span>
          </h1>
        </div>
        <p class="lede rv rv-d2">A sentence about the problem is enough to start. I reply to everything within a day, and I will tell you honestly if the project is not a fit for me.</p>
      </div>
    </div>
  </section>

  <section class="section--tight">
    <div class="wrap two-col">
      <div class="term rv">
        <div class="term__bar">
          <span class="term__dots"><i></i><i></i><i></i></span>
          <span class="term__title">compose.sh — chirag@portfolio</span>
        </div>
        <form class="term__body" data-contact-form data-email="${attr(site.email)}" data-wa="${attr(site.whatsapp)}" novalidate>
          <p class="term__line"><span class="term__prompt">$</span> new-brief <span class="term__flag">--to=chirag</span></p>

          <div class="term__field">
            <label for="f-name"><span class="term__key">name</span><span class="term__op">=</span></label>
            <input id="f-name" name="name" type="text" autocomplete="name" required placeholder="&quot;Your name&quot;">
          </div>

          <div class="term__row">
            <div class="term__field">
              <label for="f-org"><span class="term__key">company</span><span class="term__op">=</span></label>
              <input id="f-org" name="org" type="text" autocomplete="organization" placeholder="&quot;optional&quot;">
            </div>
            <div class="term__field">
              <label for="f-email"><span class="term__key">email</span><span class="term__op">=</span></label>
              <input id="f-email" name="email" type="email" autocomplete="email" placeholder="&quot;you@company.com&quot;">
            </div>
          </div>

          <div class="term__row">
            <div class="term__field">
              <label for="f-kind"><span class="term__key">type</span><span class="term__op">=</span></label>
              <select id="f-kind" name="kind">
                <option>Website</option>
                <option>Web platform with admin</option>
                <option>Data or analytics tool</option>
                <option>Automation</option>
                <option>Android app</option>
                <option>Something else</option>
              </select>
            </div>
            <div class="term__field">
              <label for="f-budget"><span class="term__key">budget</span><span class="term__op">=</span></label>
              <select id="f-budget" name="budget">
                <option>Not sure yet</option>
                <option>Under ₹50,000</option>
                <option>₹50,000 – ₹1,50,000</option>
                <option>₹1,50,000 – ₹5,00,000</option>
                <option>Above ₹5,00,000</option>
              </select>
            </div>
          </div>

          <div class="term__field">
            <label for="f-msg"><span class="term__key">brief</span><span class="term__op">=</span></label>
            <textarea id="f-msg" name="message" required placeholder="&quot;What the software has to do, who will use it, and when you need it.&quot;"></textarea>
          </div>

          <div class="term__actions">
            <button class="term__run" type="submit"><span class="term__prompt">$</span> send <span class="term__flag">--via=email</span></button>
            <button class="term__run term__run--ghost" type="button" data-wa-send><span class="term__prompt">$</span> send <span class="term__flag">--via=whatsapp</span></button>
          </div>
          <p class="term__out" data-form-status>no backend — this opens your email app or WhatsApp with the message already written.</p>
        </form>
      </div>

      <div class="rv rv-d1" style="display:grid;gap:1.5rem;align-content:start">
        <div class="term">
          <div class="term__bar">
            <span class="term__dots"><i></i><i></i><i></i></span>
            <span class="term__title">whoami.json</span>
          </div>
          <div class="term__body term__body--out">
            <p class="term__line"><span class="term__prompt">$</span> cat whoami.json</p>
            <pre class="term__json">{
  <span class="term__jk">"name"</span>: <span class="term__jv">"${esc(site.name)}"</span>,
  <span class="term__jk">"role"</span>: <span class="term__jv">"${esc(site.role)}"</span>,
  <span class="term__jk">"location"</span>: <span class="term__jv">"${esc(site.location)}"</span>,
  <span class="term__jk">"email"</span>: <span class="term__jv">"<a href="mailto:${site.email}">${esc(site.email)}</a>"</span>,
  <span class="term__jk">"phone"</span>: <span class="term__jv">"<a href="tel:${site.phoneHref}">${esc(site.phone)}</a>"</span>,
  <span class="term__jk">"whatsapp"</span>: <span class="term__jv">"<a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${esc(site.phone)}</a>"</span>,
  <span class="term__jk">"github"</span>: <span class="term__jv">"<a href="${site.github}" target="_blank" rel="noopener">${esc(site.githubHandle)}</a>"</span>,
  <span class="term__jk">"linkedin"</span>: <span class="term__jv">"<a href="${site.linkedin}" target="_blank" rel="noopener">${esc(site.linkedinHandle)}</a>"</span>,
  <span class="term__jk">"status"</span>: <span class="term__jv">"${esc(site.availability)}"</span>
}</pre>
          </div>
        </div>

        <div class="note">${I.info}<span>Based in ${esc(site.location)}, working with clients anywhere. Comfortable in English, Hindi and Gujarati.</span></div>

        <div>
          <p class="eyebrow">Before you write</p>
          <ul class="checks" style="margin-top:1rem">
            <li>What the software has to do, in one or two sentences.</li>
            <li>Who will use it, and roughly how many of them.</li>
            <li>Anything that already exists — a site, a spreadsheet, an app.</li>
            <li>When you need it live, and whether that date is fixed.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Questions</p>
          <h2 class="d2 rv rv-d1" style="margin-top:1.1rem">Answered straight.</h2>
        </div>
      </div>
      <div class="faq">
        ${faqs
          .map(
            (f, i) => `<div class="faq__item">
          <button class="faq__q" type="button" aria-expanded="false" aria-controls="cfaq-${i}">${esc(f.q)}<i aria-hidden="true"></i></button>
          <div class="faq__a" id="cfaq-${i}" aria-hidden="true"><div><p>${esc(f.a)}</p></div></div>
        </div>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>
</main>
${footer()}
${foot()}`;
}

/* --------------------------------------------------------- case study page */
function pageCase(p, idx) {
  const base = '../';
  const next = projects[(idx + 1) % projects.length];
  const live = p.links.find((l) => l.kind === 'live');
  const code = p.links.find((l) => l.kind === 'code');
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    headline: `${p.title} — ${p.subtitle}`,
    description: p.summary,
    author: { '@type': 'Person', name: site.name, url: site.url },
    dateCreated: p.year,
    url: `${site.url}/work/${p.slug}.html`,
    keywords: p.stack.join(', '),
  });

  return `${head({
    title: `${p.title} — ${p.subtitle} | ${site.name}`,
    desc: p.summary,
    path: `work/${p.slug}.html`,
    jsonld,
  })}
${header('work/')}
<main id="main">
  <article>
    <section class="case-hero">
      <div class="wrap">
        <p class="eyebrow line-mask"><span><a href="${base}work.html" style="color:inherit">Work</a> — ${esc(p.category)}</span></p>
        <h1 class="d1" style="margin-top:1.4rem">
          <span class="line-mask"><span>${esc(p.title)}</span></span>
        </h1>
        <p class="lede case-hero__sub rv rv-d2">${esc(p.subtitle)}. ${esc(p.summary)}</p>
        <div class="case-hero__meta rv rv-d3" style="margin-top:1.75rem">
          ${live ? `<a class="pill pill--live" href="${attr(live.href)}" target="_blank" rel="noopener">Live — ${esc(live.href.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>` : ''}
          ${code ? `<a class="pill" href="${attr(code.href)}" target="_blank" rel="noopener">Source on GitHub</a>` : ''}
          ${p.confidential ? `<span class="pill pill--lock">Restricted deployment</span>` : ''}
          <span class="pill">${esc(p.year)}</span>
        </div>

        <div class="case-shot rv rv-d3" data-para="18">${shot(p, base, { lazy: false })}</div>

        <dl class="case-facts rv">
          <div class="fact"><dt>Client</dt><dd>${esc(p.client)}</dd></div>
          <div class="fact"><dt>Role</dt><dd>${esc(p.role)}</dd></div>
          <div class="fact"><dt>Stack</dt><dd>${esc(p.tag)}</dd></div>
          <div class="fact"><dt>Status</dt><dd>${p.confidential ? 'In service, restricted' : 'Live in production'}</dd></div>
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="case-body">
          <div>
            <p class="eyebrow rv">The problem</p>
            <div class="prose rv rv-d1" style="margin-top:1.25rem"><p>${esc(p.problem)}</p></div>
          </div>
          <div>
            <p class="eyebrow rv">What I built</p>
            <div class="prose rv rv-d1" style="margin-top:1.25rem"><p>${esc(p.approach)}</p></div>
          </div>
        </div>

        ${
          p.metrics && p.metrics.length
            ? `<div class="metrics rv" style="margin-top:clamp(2.5rem,5vw,4rem)">
          ${p.metrics.map((m) => `<div class="metric"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join('')}
        </div>`
            : ''
        }

        ${
          p.confidential
            ? `<div class="note rv" style="margin-top:clamp(2rem,4vw,3rem)">${I.lock}<span>${esc(p.confidential)}</span></div>`
            : ''
        }
      </div>
    </section>

    <section class="section--tight">
      <div class="wrap">
        <p class="eyebrow rv">Inside it</p>
        <div class="feat-grid rv" style="margin-top:1.5rem">
          ${p.features
            .map(
              (f, i) => `<div class="feat">
            <span class="feat__n">${String(i + 1).padStart(2, '0')}</span>
            <h3>${esc(f.title)}</h3>
            <p>${esc(f.body)}</p>
          </div>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>

    ${
      p.gallery && p.gallery.length
        ? `<section class="section">
      <div class="wrap">
        <p class="eyebrow rv">Screens</p>
        <p class="lede rv rv-d1" style="margin-top:1rem;max-width:56ch">Captured from the running product, not from a mockup.</p>
        <div class="gal" style="margin-top:clamp(2rem,4vw,3rem)">
          ${p.gallery
            .map(
              (g) => `<figure class="rv${g.long ? ' gal--long' : ''}">
            <img src="${base}assets/img/work/${g.src}.webp"${g.long ? '' : ` srcset="${base}assets/img/work/${g.src}@sm.webp 900w, ${base}assets/img/work/${g.src}.webp 1600w" sizes="(max-width: 1000px) 100vw, 1400px"`} width="${g.w}" height="${g.h}" alt="${attr(g.alt)}" loading="lazy" decoding="async">
            <figcaption>${esc(g.caption)}</figcaption>
          </figure>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>`
        : ''
    }

    <section class="section">
      <div class="wrap two-col">
        <div>
          <p class="eyebrow rv">Outcome</p>
          <ul class="checks rv rv-d1" style="margin-top:1.5rem">
            ${p.outcome.map((o) => `<li>${esc(o)}</li>`).join('')}
          </ul>
        </div>
        <div class="rv rv-d1">
          <p class="eyebrow">Built with</p>
          <ul class="tags" style="margin-top:1.5rem">${p.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
          ${
            p.links.length
              ? `<div class="cta__row" style="justify-content:flex-start;margin-top:2rem">
            ${p.links.map((l) => `<a class="btn ${l.kind === 'live' ? 'btn--solid' : ''}" href="${attr(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ${I.arrow}</a>`).join('')}
          </div>`
              : ''
          }
        </div>
      </div>
    </section>
  </article>

  <a class="nextp" href="${base}work/${next.slug}.html" data-cursor="Next">
    <div class="wrap">
      <p class="eyebrow">Next project</p>
      <div class="nextp__t" style="margin-top:1rem">${esc(next.title)} ${I.arrowR}</div>
      <p class="lede" style="margin-top:.75rem;max-width:52ch">${esc(next.subtitle)}</p>
    </div>
  </a>
</main>
${cta('work/')}
${footer('work/')}
${foot('work/')}`;
}

/* ------------------------------------------------------------- resume.html */
function resumeProjectBlock(p) {
  const live = p.links.find((l) => l.kind === 'live');
  return `<div class="sheet__proj">
        <span class="sheet__pname">${esc(p.title)}<span class="sheet__ptag">${esc(p.tag)}</span></span>
        <p class="sheet__pdesc">${esc(p.summary)}</p>
        ${live ? `<a class="sheet__plink" href="${attr(live.href)}" target="_blank" rel="noopener">${esc(live.href.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>` : ''}
      </div>`;
}

function resumeJobBlock(t) {
  return `<div class="sheet__job">
        <p class="sheet__jobtitle">${esc(t.org)}</p>
        <p class="sheet__jobrole">${esc(t.role)}</p>
        <p class="sheet__jobdates">${esc(t.period)}</p>
        <ul>${t.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      </div>`;
}

function pageResume() {
  const topProjects = projects.filter((p) => p.featured).slice(0, 6);
  return `${head({
    title: `Résumé — ${site.name}`,
    desc: `Downloadable résumé for ${site.name}, ${site.role}: experience, technical skills and selected projects.`,
    path: 'resume.html',
    extraCss: ['assets/css/resume.css'],
  })}
${header()}
<main id="main">
  <section class="phero">
    <div class="wrap">
      <div class="phero__grid">
        <div>
          <p class="eyebrow line-mask"><span>Résumé</span></p>
          <h1 class="d1" style="margin-top:1.2rem">
            <span class="line-mask"><span>One document,</span></span>
            <span class="line-mask"><span class="it accent">the short version.</span></span>
          </h1>
        </div>
        <p class="lede rv rv-d2">Everything below also lives on this site in more detail. This is the version you can save, print or forward.</p>
      </div>
      <div class="cta__row rv rv-d3" style="justify-content:flex-start;margin-top:2rem">
        <a class="btn btn--solid" href="${site.resumePdf}" download data-cursor="Download">Download PDF ${I.arrow}</a>
        <button class="btn" type="button" data-print>Print this page</button>
      </div>
    </div>
  </section>

  <section class="section--tight resume-stage">
    <div class="wrap">
      <div class="sheet rv">
        <header class="sheet__head">
          <h2 class="sheet__name">${esc(site.name)}</h2>
          <p class="sheet__role">${esc(site.role)}</p>
          <ul class="sheet__contact">
            <li><a href="tel:${site.phoneHref}">${esc(site.phone)}</a></li>
            <li><a href="mailto:${site.email}">${esc(site.email)}</a></li>
            <li><a href="${site.github}" target="_blank" rel="noopener">${esc(site.github.replace('https://', ''))}</a></li>
            <li><a href="${site.linkedin}" target="_blank" rel="noopener">linkedin.com/${esc(site.linkedinHandle)}</a></li>
            <li>${esc(site.location)}</li>
          </ul>
        </header>

        <div class="sheet__grid">
          <div class="sheet__main">
            <section class="sheet__sec">
              <h3>Profile</h3>
              <p>${esc(hero.intro)}</p>
            </section>

            <section class="sheet__sec">
              <h3>Experience</h3>
              ${timeline.map(resumeJobBlock).join('\n              ')}
            </section>

            <section class="sheet__sec">
              <h3>Selected projects</h3>
              ${topProjects.map(resumeProjectBlock).join('\n              ')}
              <p class="sheet__footnote">Complete project archive at ${site.url.replace('https://', '')} — ${projects.length} projects in total.</p>
            </section>
          </div>

          <aside class="sheet__rail">
            <section class="sheet__sec">
              <h3>Highlights</h3>
              ${stats
                .slice(0, 2)
                .map((s) => `<div class="sheet__stat"><b>${esc(String(s.value))}${esc(s.suffix)}</b><span>${esc(s.label)}</span></div>`)
                .join('\n              ')}
            </section>

            <section class="sheet__sec">
              <h3>Technical skills</h3>
              ${stack
                .map((g) => `<div class="sheet__skill"><h4>${esc(g.group)}</h4><p>${g.items.map((i) => esc(i)).join(', ')}</p></div>`)
                .join('\n              ')}
            </section>

            <section class="sheet__sec">
              <h3>Languages</h3>
              <p>English, Hindi, Gujarati</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  </section>
</main>
${cta()}
${footer()}
${foot()}`;
}

function page404() {
  return `${head({ title: `Page not found — ${site.name}`, desc: 'That page does not exist.', path: '404.html' })}
${header()}
<main id="main">
  <section class="phero" style="min-height:70svh;display:flex;align-items:center">
    <div class="wrap">
      <p class="eyebrow line-mask"><span>Error 404</span></p>
      <h1 class="d1" style="margin-top:1.2rem;max-width:16ch">
        <span class="line-mask"><span>This page has</span></span>
        <span class="line-mask"><span class="it accent">no trail.</span></span>
      </h1>
      <p class="lede rv rv-d2" style="margin-top:1.75rem;max-width:48ch">The link is broken or the page has moved. The work is all still here.</p>
      <div class="cta__row rv rv-d3" style="justify-content:flex-start;margin-top:2rem">
        <a class="btn btn--solid" href="index.html">Back to home ${I.arrow}</a>
        <a class="btn" href="work.html">See the work ${I.arrow}</a>
      </div>
    </div>
  </section>
</main>
${footer()}
${foot()}`;
}

/* ------------------------------------------------------------- extra files */
function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#06070a"/>
  <path d="M14 44c0-14 8-24 20-24 6 0 10 3 12 7" fill="none" stroke="#ffb020" stroke-width="5" stroke-linecap="round"/>
  <circle cx="46" cy="44" r="5" fill="#ffb020"/>
</svg>`;
}

function manifest() {
  return JSON.stringify(
    {
      name: `${site.name} — ${site.role}`,
      short_name: 'Chirag Suthar',
      description: site.description,
      start_url: './index.html',
      display: 'standalone',
      background_color: '#06070a',
      theme_color: '#06070a',
      icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
    },
    null,
    2
  );
}

function sitemap() {
  const pages = ['', 'work.html', 'services.html', 'about.html', 'resume.html', 'contact.html', ...projects.map((p) => `work/${p.slug}.html`)];
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/1999/sitemaps/schema/0.9">
${pages
  .map(
    (p) => `  <url><loc>${site.url}/${p}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${p === '' ? '1.0' : p.startsWith('work/') ? '0.7' : '0.8'}</priority></url>`
  )
  .join('\n')}
</urlset>`;
}

function robots() {
  return `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;
}

/* -------------------------------------------------------------------- run */
function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return rel;
}

const written = [];
// clear stale case-study pages
if (existsSync(join(ROOT, 'work'))) {
  readdirSync(join(ROOT, 'work'))
    .filter((f) => f.endsWith('.html'))
    .forEach((f) => unlinkSync(join(ROOT, 'work', f)));
}

written.push(write('index.html', pageIndex()));
written.push(write('work.html', pageWork()));
written.push(write('services.html', pageServices()));
written.push(write('about.html', pageAbout()));
written.push(write('resume.html', pageResume()));
written.push(write('contact.html', pageContact()));
written.push(write('404.html', page404()));
projects.forEach((p, i) => written.push(write(`work/${p.slug}.html`, pageCase(p, i))));
written.push(write('favicon.svg', favicon()));
written.push(write('site.webmanifest', manifest()));
written.push(write('sitemap.xml', sitemap()));
written.push(write('robots.txt', robots()));
written.push(write('.nojekyll', ''));

console.log(`built ${written.length} files`);
written.forEach((f) => console.log('  ' + f));
