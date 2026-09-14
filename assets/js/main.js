/* =========================================================================
   Chirag Suthar — portfolio
   Vanilla JS. No libraries, no build step.
   ========================================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ------------------------------------------------------------------ *
   * Theme
   * ------------------------------------------------------------------ */
  const Theme = {
    key: 'cs-theme',
    init() {
      let saved = null;
      try { saved = localStorage.getItem(this.key); } catch (e) { /* private mode */ }
      if (saved === 'light' || saved === 'dark') this.set(saved, false);
      $$('[data-theme-toggle]').forEach((b) =>
        b.addEventListener('click', () => {
          const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
          this.set(next, true);
        })
      );
    },
    set(v, persist) {
      document.documentElement.setAttribute('data-theme', v);
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', v === 'light' ? '#f6f5f2' : '#06070a');
      if (persist) { try { localStorage.setItem(this.key, v); } catch (e) { /* ignore */ } }
      window.dispatchEvent(new CustomEvent('themechange'));
    },
  };

  /* ------------------------------------------------------------------ *
   * Preloader
   * ------------------------------------------------------------------ */
  const Pre = {
    init() {
      const pre = $('.pre');
      if (!pre) { document.body.classList.add('loaded'); return; }
      const bar = $('.pre__bar i', pre);
      const pct = $('.pre__pct', pre);
      let v = 0;
      const tick = () => {
        v = Math.min(100, v + Math.random() * 18 + 6);
        if (bar) bar.style.right = 100 - v + '%';
        if (pct) pct.textContent = String(Math.round(v)).padStart(3, '0') + '%';
        if (v < 100) setTimeout(tick, 90 + Math.random() * 90);
        else setTimeout(done, 260);
      };
      const done = () => {
        document.body.classList.add('loaded');
        setTimeout(() => pre.remove(), 900);
        Reveal.kick();
      };
      if (reduced) { done(); return; }
      setTimeout(tick, 120);
      // never let the loader trap the page
      setTimeout(() => { if (!document.body.classList.contains('loaded')) done(); }, 3600);
    },
  };

  /* ------------------------------------------------------------------ *
   * Cursor
   * ------------------------------------------------------------------ */
  const Cursor = {
    init() {
      if (!fine || reduced) return;
      const ring = $('.cur');
      const dot = $('.cur-dot');
      const label = $('.cur__label');
      if (!ring || !dot) return;
      let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      document.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        document.body.classList.add('cursor-on');
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }, { passive: true });
      document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
      const loop = () => {
        rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        requestAnimationFrame(loop);
      };
      loop();
      const hot = 'a, button, [data-cursor], input, textarea, select, summary';
      document.addEventListener('mouseover', (e) => {
        const t = e.target.closest(hot);
        if (!t) return;
        document.body.classList.add('cursor-hot');
        if (label) label.textContent = t.dataset.cursor || '';
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hot)) {
          document.body.classList.remove('cursor-hot');
          if (label) label.textContent = '';
        }
      });
    },
  };

  /* ------------------------------------------------------------------ *
   * Pointer glow
   * ------------------------------------------------------------------ */
  const Glow = {
    init() {
      const el = $('.glow');
      if (!el || !fine || reduced) return;
      let x = innerWidth * 0.7, y = innerHeight * 0.3, cx = x, cy = y;
      document.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; document.body.classList.add('glow-on'); }, { passive: true });
      const loop = () => {
        cx = lerp(cx, x, 0.045); cy = lerp(cy, y, 0.045);
        el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      };
      loop();
    },
  };

  /* ------------------------------------------------------------------ *
   * Header
   * ------------------------------------------------------------------ */
  const Header = {
    init() {
      const hdr = $('.hdr');
      if (!hdr) return;
      let last = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        hdr.classList.toggle('stuck', y > 24);
        if (!document.body.classList.contains('menu-open')) {
          hdr.classList.toggle('hide', y > last && y > 420);
        }
        last = y;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      const burger = $('.burger');
      if (burger) {
        burger.addEventListener('click', () => {
          const open = document.body.classList.toggle('menu-open');
          document.body.classList.toggle('is-locked', open);
          burger.setAttribute('aria-expanded', String(open));
          hdr.classList.remove('hide');
        });
        $$('.mmenu a').forEach((a) =>
          a.addEventListener('click', () => {
            document.body.classList.remove('menu-open', 'is-locked');
            burger.setAttribute('aria-expanded', 'false');
          })
        );
      }
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) burger?.click();
      });
    },
  };

  /* ------------------------------------------------------------------ *
   * Reveal on scroll
   * ------------------------------------------------------------------ */
  const Reveal = {
    io: null,
    init() {
      const els = $$('.rv, .line-mask');
      if (!('IntersectionObserver' in window) || reduced) {
        els.forEach((el) => el.classList.add('in'));
        return;
      }
      this.io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            en.target.classList.add('in');
            this.io.unobserve(en.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      els.forEach((el) => this.io.observe(el));
    },
    kick() {
      // reveal anything already in view once the loader clears
      $$('.rv, .line-mask').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight * 0.94) el.classList.add('in');
      });
    },
  };

  /* ------------------------------------------------------------------ *
   * Counters
   * ------------------------------------------------------------------ */
  const Counters = {
    init() {
      const els = $$('[data-count]');
      if (!els.length) return;
      if (reduced || !('IntersectionObserver' in window)) {
        els.forEach((el) => (el.textContent = el.dataset.count));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target;
            io.unobserve(el);
            const target = parseFloat(el.dataset.count);
            const dur = 1500;
            const t0 = performance.now();
            const step = (t) => {
              const p = clamp((t - t0) / dur, 0, 1);
              const e = 1 - Math.pow(1 - p, 4);
              el.textContent = Math.round(target * e).toLocaleString('en-IN');
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.4 }
      );
      els.forEach((el) => { el.textContent = '0'; io.observe(el); });
    },
  };

  /* ------------------------------------------------------------------ *
   * Hero canvas — a money trail moving through layered accounts
   * ------------------------------------------------------------------ */
  const Trail = {
    init() {
      const cv = $('.hero__canvas');
      if (!cv) return;
      const ctx = cv.getContext('2d', { alpha: true });
      if (!ctx) return;

      let W = 0, H = 0, dpr = 1, nodes = [], edges = [], packets = [], raf = 0, running = true;
      let px = 0.5, py = 0.5, cpx = 0.5, cpy = 0.5;

      const palette = () => {
        const cs = getComputedStyle(document.documentElement);
        const light = document.documentElement.getAttribute('data-theme') === 'light';
        return {
          accent: cs.getPropertyValue('--accent').trim() || '#ffb020',
          teal: cs.getPropertyValue('--accent-2').trim() || '#5eead4',
          line: light ? 'rgba(10,14,20,0.16)' : 'rgba(255,255,255,0.12)',
          node: light ? 'rgba(10,14,20,0.5)' : 'rgba(255,255,255,0.55)',
          light,
        };
      };
      let col = palette();
      window.addEventListener('themechange', () => { col = palette(); });

      const build = () => {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = cv.clientWidth; H = cv.clientHeight;
        cv.width = Math.floor(W * dpr);
        cv.height = Math.floor(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const layers = W < 760 ? 4 : 6;
        const perLayer = W < 760 ? 3 : 4;
        nodes = []; edges = []; packets = [];

        const x0 = W * (W < 900 ? 0.1 : 0.42);
        const x1 = W * 0.96;
        for (let l = 0; l < layers; l++) {
          const count = l === 0 ? 1 : Math.max(2, Math.round(perLayer - Math.abs(l - layers / 2) * 0.6));
          for (let i = 0; i < count; i++) {
            const x = x0 + ((x1 - x0) * l) / (layers - 1);
            const spread = H * 0.62;
            const y = H * 0.5 + (count === 1 ? 0 : (i / (count - 1) - 0.5) * spread) + (Math.random() - 0.5) * H * 0.06;
            nodes.push({
              x, y, l, i,
              r: l === 0 ? 5.5 : 2.2 + Math.random() * 2.2,
              ph: Math.random() * Math.PI * 2,
              amp: 3 + Math.random() * 7,
              kind: l === 0 ? 'src' : l === layers - 1 ? 'out' : Math.random() < 0.14 ? 'frozen' : 'mid',
            });
          }
        }
        nodes.forEach((n) => {
          if (n.l === 0) return;
          const prev = nodes.filter((p) => p.l === n.l - 1);
          const picks = prev.sort((a, b) => Math.abs(a.y - n.y) - Math.abs(b.y - n.y)).slice(0, n.l === 1 ? 1 : 1 + (Math.random() < 0.45 ? 1 : 0));
          picks.forEach((p) => edges.push({ a: p, b: n }));
        });
        for (let i = 0; i < (W < 760 ? 10 : 20); i++) spawn(Math.random());
      };

      const spawn = (t) => {
        const e = edges[(Math.random() * edges.length) | 0];
        if (!e) return;
        packets.push({ e, t: t || 0, sp: 0.0022 + Math.random() * 0.0042, s: 1.1 + Math.random() * 1.5 });
      };

      const pos = (n, time) => ({
        x: n.x + Math.sin(time * 0.00035 + n.ph) * n.amp * 0.6 + (cpx - 0.5) * (18 + n.l * 5),
        y: n.y + Math.cos(time * 0.0004 + n.ph) * n.amp + (cpy - 0.5) * (14 + n.l * 4),
      });

      const draw = (time) => {
        ctx.clearRect(0, 0, W, H);
        cpx = lerp(cpx, px, 0.05); cpy = lerp(cpy, py, 0.05);

        // edges
        ctx.lineWidth = 1;
        edges.forEach((e) => {
          const a = pos(e.a, time), b = pos(e.b, time);
          const mx = (a.x + b.x) / 2;
          ctx.strokeStyle = col.line;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.bezierCurveTo(mx, a.y, mx, b.y, b.x, b.y);
          ctx.stroke();
        });

        // packets
        packets.forEach((p) => {
          p.t += p.sp;
          if (p.t > 1) { p.t = 0; p.e = edges[(Math.random() * edges.length) | 0]; }
          if (!p.e) return;
          const a = pos(p.e.a, time), b = pos(p.e.b, time);
          const mx = (a.x + b.x) / 2;
          const t = p.t, u = 1 - t;
          const x = u * u * u * a.x + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * b.x;
          const y = u * u * u * a.y + 3 * u * u * t * a.y + 3 * u * t * t * b.y + t * t * t * b.y;
          const fade = Math.sin(Math.PI * t);
          ctx.globalAlpha = 0.25 + fade * 0.75;
          ctx.fillStyle = col.accent;
          ctx.beginPath();
          ctx.arc(x, y, p.s, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.1 + fade * 0.16;
          ctx.beginPath();
          ctx.arc(x, y, p.s * 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        // nodes
        nodes.forEach((n) => {
          const p = pos(n, time);
          const pulse = 0.65 + Math.sin(time * 0.0016 + n.ph) * 0.35;
          if (n.kind === 'src') {
            ctx.fillStyle = col.accent;
            ctx.globalAlpha = 0.14 * pulse;
            ctx.beginPath(); ctx.arc(p.x, p.y, n.r * 6, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
            ctx.beginPath(); ctx.arc(p.x, p.y, n.r, 0, Math.PI * 2); ctx.fill();
          } else if (n.kind === 'out') {
            ctx.strokeStyle = col.teal;
            ctx.globalAlpha = 0.85;
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(p.x, p.y, n.r + 2.5, 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.fillStyle = col.teal;
            ctx.beginPath(); ctx.arc(p.x, p.y, n.r * 0.7, 0, Math.PI * 2); ctx.fill();
          } else if (n.kind === 'frozen') {
            ctx.strokeStyle = col.node;
            ctx.globalAlpha = 0.5;
            ctx.lineWidth = 1;
            const s = n.r + 2;
            ctx.strokeRect(p.x - s, p.y - s, s * 2, s * 2);
            ctx.globalAlpha = 1;
          } else {
            ctx.fillStyle = col.node;
            ctx.globalAlpha = 0.35 + pulse * 0.3;
            ctx.beginPath(); ctx.arc(p.x, p.y, n.r, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
          }
        });

        raf = requestAnimationFrame(draw);
      };

      const start = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };
      const stop = () => { running = false; cancelAnimationFrame(raf); };

      build();
      if (reduced) { draw(0); stop(); }
      else raf = requestAnimationFrame(draw);

      let rt;
      window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 220); });
      if (fine && !reduced) {
        window.addEventListener('mousemove', (e) => { px = e.clientX / innerWidth; py = e.clientY / innerHeight; }, { passive: true });
      }
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
      if ('IntersectionObserver' in window && !reduced) {
        new IntersectionObserver((en) => (en[0].isIntersecting ? start() : stop()), { threshold: 0 }).observe(cv);
      }
      // occasional new packet so the trail never settles into a loop
      if (!reduced) setInterval(() => { if (running && packets.length < 34) spawn(0); }, 2600);
    },
  };

  /* ------------------------------------------------------------------ *
   * Ambient forensic network — a quiet, site-wide backdrop in the same
   * visual language as the case-study flow diagrams: nodes, edges,
   * drifting packets, and a slow scanning sweep. Injected at runtime so
   * every page gets it without touching every template.
   * ------------------------------------------------------------------ */
  const Forensic = {
    init() {
      if (reduced) return;
      const cv = document.createElement('canvas');
      cv.className = 'fscan';
      cv.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(cv, document.body.firstChild);
      const ctx = cv.getContext('2d', { alpha: true });
      if (!ctx) return;

      let W = 0, H = 0, dpr = 1, nodes = [], edges = [], packets = [], raf = 0, running = true, sweep = -0.25;

      const palette = () => {
        const cs = getComputedStyle(document.documentElement);
        const light = document.documentElement.getAttribute('data-theme') === 'light';
        return {
          accent: cs.getPropertyValue('--accent').trim() || '#ffb020',
          teal: cs.getPropertyValue('--accent-2').trim() || '#5eead4',
          line: light ? 'rgba(10,14,20,0.55)' : 'rgba(255,255,255,0.55)',
        };
      };
      let col = palette();
      window.addEventListener('themechange', () => { col = palette(); });

      const build = () => {
        dpr = Math.min(1.6, window.devicePixelRatio || 1);
        W = innerWidth; H = innerHeight;
        cv.width = Math.floor(W * dpr);
        cv.height = Math.floor(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const cols = W < 760 ? 5 : 9;
        const rows = W < 760 ? 7 : 5;
        nodes = [];
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            if (Math.random() < 0.44) continue;
            nodes.push({
              x: (c + 0.5 + (Math.random() - 0.5) * 0.6) * (W / cols),
              y: (r + 0.5 + (Math.random() - 0.5) * 0.6) * (H / rows),
              ph: Math.random() * Math.PI * 2,
              r: 1.2 + Math.random() * 1.5,
              sq: Math.random() < 0.16,
            });
          }
        }
        const cellDiag = (W / cols) ** 2 + (H / rows) ** 2;
        edges = [];
        nodes.forEach((n, i) => {
          nodes
            .map((m, j) => ({ m, j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
            .filter((x) => x.j !== i)
            .sort((a, b) => a.d - b.d)
            .slice(0, 1)
            .forEach((x) => { if (x.d < cellDiag * 1.4) edges.push({ a: n, b: x.m }); });
        });
        packets = [];
        const seed = Math.min(16, Math.round(edges.length * 0.55));
        for (let i = 0; i < seed; i++) spawn();
      };

      const spawn = () => {
        const e = edges[(Math.random() * edges.length) | 0];
        if (!e) return;
        packets.push({ e, t: Math.random(), sp: 0.0008 + Math.random() * 0.0014 });
      };

      const draw = (time) => {
        ctx.clearRect(0, 0, W, H);

        ctx.lineWidth = 1;
        ctx.strokeStyle = col.line;
        ctx.globalAlpha = 0.16;
        edges.forEach((e) => {
          ctx.beginPath();
          ctx.moveTo(e.a.x, e.a.y);
          ctx.lineTo(e.b.x, e.b.y);
          ctx.stroke();
        });

        nodes.forEach((n) => {
          const pulse = 0.5 + Math.sin(time * 0.0009 + n.ph) * 0.5;
          ctx.globalAlpha = 0.12 + pulse * 0.16;
          if (n.sq) {
            const s = n.r + 1.4;
            ctx.strokeStyle = col.line;
            ctx.lineWidth = 1;
            ctx.strokeRect(n.x - s, n.y - s, s * 2, s * 2);
          } else {
            ctx.fillStyle = col.line;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        packets.forEach((p) => {
          p.t += p.sp;
          if (p.t > 1) { p.t = 0; p.e = edges[(Math.random() * edges.length) | 0]; }
          if (!p.e) return;
          const x = p.e.a.x + (p.e.b.x - p.e.a.x) * p.t;
          const y = p.e.a.y + (p.e.b.y - p.e.a.y) * p.t;
          const fade = Math.sin(Math.PI * p.t);
          ctx.fillStyle = col.accent;
          ctx.globalAlpha = 0.18 + fade * 0.42;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // forensic scan sweep — a thin band moving slowly down the viewport
        sweep += 0.00022;
        if (sweep > 1.3) sweep = -0.3;
        const sy = sweep * H;
        const grad = ctx.createLinearGradient(0, sy - 70, 0, sy + 70);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, col.teal);
        grad.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = grad;
        ctx.fillRect(0, sy - 70, W, 140);
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = col.teal;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(W, sy);
        ctx.stroke();

        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(draw);
      };

      const start = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };
      const stop = () => { running = false; cancelAnimationFrame(raf); };

      build();
      raf = requestAnimationFrame(draw);

      let rt;
      window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 250); });
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
      setInterval(() => { if (running && packets.length < 22) spawn(); }, 3400);
    },
  };

  /* ------------------------------------------------------------------ *
   * Ambient terminal feeds — a couple of fixed, low-opacity panels that
   * quietly type out real command-line snippets drawn from the actual
   * kind of work on this site: tailing an ingest log, walking a case
   * folder, checking a pipeline's processes. Two independent loops so
   * they never sync up.
   * ------------------------------------------------------------------ */
  const TermFeed = {
    snippets: [
      ['$ sudo tail -f /var/log/ncrp_ingest.log', '[ok] 41,208 rows normalised', '[ok] fuzzy match: account_no (94%)', '[ok] batch commit -> mysql (sha256 ok)'],
      ['$ tree -L 2 ./cases/2026-09', '├── bank_statements/', '│   ├── hdfc_txn.xlsx', '│   └── sbi_txn.xlsx', '├── ack_numbers.csv', '└── risk_report.pdf'],
      ['$ ps aux | grep fraud_pipeline', 'chirag 14021  0.3  python3 -m src.pipeline', 'chirag 14022  0.1  python3 -m src.aggregator'],
      ['$ sudo systemctl status cyber-analytics', '● active (running) since 09:14 IST', '  Tasks: 6    Memory: 340.2M'],
      ['$ git log --oneline -3', 'a3f9e21 fix: account normalisation edge case', 'c88d012 feat: district-wise split engine', '7e10bda chore: bump rapidfuzz'],
      ['$ find ./cases -name "*.xlsx" | wc -l', '47', '$ du -sh ./cases/2026-09', '2.3G'],
      ['$ sudo -u cyberadmin python3 verify.py', 'checksum OK  — 3,204 records', 'ledger balance reconciled'],
      ['$ df -h /data', 'Filesystem   Used  Avail  Use%', '/dev/sda1    62G   180G   26%'],
    ],
    sleep(ms) { return new Promise((r) => setTimeout(r, ms)); },
    async run(feed, state) {
      let last = -1;
      while (!state.stopped) {
        let idx = (Math.random() * this.snippets.length) | 0;
        if (idx === last) idx = (idx + 1) % this.snippets.length;
        last = idx;
        const lines = this.snippets[idx];
        const done = [];
        for (const line of lines) {
          for (let i = 1; i <= line.length; i++) {
            if (state.stopped) return;
            feed.text.data = done.concat(line.slice(0, i)).join('\n');
            await this.sleep(13 + Math.random() * 20);
          }
          done.push(line);
          feed.text.data = done.join('\n');
          await this.sleep(140 + Math.random() * 120);
        }
        await this.sleep(3400 + Math.random() * 1400);
        // fade the panel, clear, then start the next snippet
        feed.el.style.opacity = '0';
        await this.sleep(500);
        feed.text.data = '';
        feed.el.style.removeProperty('opacity');
        await this.sleep(300 + Math.random() * 500);
      }
    },
    makeFeed(anchorClass) {
      const el = document.createElement('div');
      el.className = 'term-feed ' + anchorClass;
      el.style.transition = 'opacity 0.5s ease';
      el.setAttribute('aria-hidden', 'true');
      const pre = document.createElement('pre');
      const text = document.createTextNode('');
      const caret = document.createElement('span');
      caret.className = 'term-feed__caret';
      pre.appendChild(text);
      pre.appendChild(caret);
      el.appendChild(pre);
      document.body.insertBefore(el, document.body.firstChild);
      return { el, text };
    },
    init() {
      if (reduced) return;
      if (matchMedia('(max-width: 1220px), (max-height: 720px)').matches) return;
      const state = { stopped: false };
      const feedTL = this.makeFeed('term-feed--tl');
      const feedBR = this.makeFeed('term-feed--br');
      // stagger the two loops so they never type in lockstep
      this.run(feedTL, state);
      setTimeout(() => this.run(feedBR, state), 1800);
    },
  };

  /* ------------------------------------------------------------------ *
   * GitHub card — live stats fetched client-side for the hero widget.
   * Degrades quietly: avatar and link always work, numbers show em-dashes
   * if the API is unreachable, the contribution chart removes itself on
   * a failed load.
   * ------------------------------------------------------------------ */
  const GitHubCard = {
    init() {
      const el = $('[data-ghcard]');
      if (!el) return;
      const user = el.dataset.ghUser;
      if (!user) return;

      const avatar = $('[data-gh-avatar]', el);
      const fallback = $('[data-gh-avatar-fallback]', el);
      if (avatar) {
        avatar.addEventListener('load', () => { avatar.hidden = false; if (fallback) fallback.hidden = true; }, { once: true });
        avatar.addEventListener('error', () => { avatar.hidden = true; if (fallback) fallback.hidden = false; }, { once: true });
        avatar.src = `https://github.com/${user}.png?size=96`;
      }

      const chart = $('[data-gh-chart]', el);
      if (chart) {
        chart.src = `https://ghchart.rshah.org/ffb020/${user}`;
        chart.addEventListener('error', () => { chart.closest('.ghcard__chartwrap')?.remove(); }, { once: true });
      }

      fetch(`https://api.github.com/users/${user}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!d) return;
          const repos = $('[data-gh-repos]', el);
          if (repos && typeof d.public_repos === 'number') repos.textContent = d.public_repos.toLocaleString('en-IN');
          const followers = $('[data-gh-followers]', el);
          if (followers && typeof d.followers === 'number') followers.textContent = d.followers.toLocaleString('en-IN');
        })
        .catch(() => {});

      fetch(`https://api.github.com/users/${user}/repos?per_page=100`)
        .then((r) => (r.ok ? r.json() : null))
        .then((list) => {
          if (!Array.isArray(list)) return;
          const stars = list.reduce((s, r) => s + (r.stargazers_count || 0), 0);
          const el2 = $('[data-gh-stars]', el);
          if (el2) el2.textContent = stars.toLocaleString('en-IN');
        })
        .catch(() => {});
    },
  };

  /* ------------------------------------------------------------------ *
   * Horizontal pinned services
   * ------------------------------------------------------------------ */
  const HScroll = {
    init() {
      const sec = $('.hscroll');
      if (!sec) return;
      const track = $('.hscroll__track', sec);
      const sticky = $('.hscroll__sticky', sec);
      if (!track || !sticky) return;
      const mq = window.matchMedia('(min-width: 821px)');

      let dist = 0;
      const measure = () => {
        if (!mq.matches || reduced) { track.style.transform = ''; sec.style.height = ''; return; }
        const gut = parseFloat(getComputedStyle($('.wrap') || document.body).paddingLeft) || 24;
        dist = Math.max(0, track.scrollWidth - window.innerWidth + gut);
        sec.style.height = window.innerHeight + dist + 'px';
        onScroll();
      };
      const onScroll = () => {
        if (!mq.matches || reduced) return;
        const r = sec.getBoundingClientRect();
        const p = clamp(-r.top / (sec.offsetHeight - window.innerHeight || 1), 0, 1);
        track.style.transform = `translate3d(${-p * dist}px,0,0)`;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', measure);
      mq.addEventListener?.('change', measure);
      measure();
      setTimeout(measure, 600);
    },
  };

  /* ------------------------------------------------------------------ *
   * Card tilt + parallax images
   * ------------------------------------------------------------------ */
  const Tilt = {
    init() {
      if (!fine || reduced) return;
      $$('[data-tilt]').forEach((card) => {
        const inner = $('.work-card__shot', card) || card;
        let rx = 0, ry = 0, tx = 0, ty = 0, raf = null;
        const loop = () => {
          rx = lerp(rx, tx, 0.12); ry = lerp(ry, ty, 0.12);
          inner.style.transform = `perspective(1400px) rotateX(${ry}deg) rotateY(${rx}deg) translate3d(0,0,0)`;
          if (Math.abs(rx - tx) > 0.01 || Math.abs(ry - ty) > 0.01) raf = requestAnimationFrame(loop);
          else raf = null;
        };
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          tx = ((e.clientX - r.left) / r.width - 0.5) * 5;
          ty = -((e.clientY - r.top) / r.height - 0.5) * 4;
          if (!raf) raf = requestAnimationFrame(loop);
        });
        card.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
      });
    },
  };

  const Parallax = {
    init() {
      const els = $$('[data-para]');
      if (!els.length || reduced) return;
      const onScroll = () => {
        const vh = innerHeight;
        els.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          const p = (r.top + r.height / 2 - vh / 2) / vh;
          const amt = parseFloat(el.dataset.para) || 14;
          el.style.transform = `translate3d(0, ${(-p * amt).toFixed(2)}px, 0)`;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    },
  };

  /* ------------------------------------------------------------------ *
   * Archive: filters + pointer preview
   * ------------------------------------------------------------------ */
  const Archive = {
    init() {
      const list = $('[data-archive]');
      if (!list) return;
      const rows = $$('[data-tags]', list);
      const count = $('[data-arch-count]');
      $$('[data-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const f = btn.dataset.filter;
          $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
          let n = 0;
          rows.forEach((r) => {
            const show = f === 'all' || (r.dataset.tags || '').split(' ').includes(f);
            r.classList.toggle('out', !show);
            if (show) n++;
          });
          if (count) count.textContent = String(n).padStart(2, '0');
        });
      });

      const peek = $('.peek');
      if (!peek || !fine || reduced) return;
      const img = $('img', peek);
      let x = 0, y = 0, cx = 0, cy = 0, on = false;
      rows.forEach((r) => {
        const src = r.dataset.peek;
        if (!src) return;
        r.addEventListener('mouseenter', () => { img.src = src; on = true; peek.classList.add('on'); });
        r.addEventListener('mouseleave', () => { on = false; peek.classList.remove('on'); });
      });
      document.addEventListener('mousemove', (e) => { x = e.clientX + 190; y = e.clientY; }, { passive: true });
      const loop = () => {
        if (on) {
          cx = lerp(cx || x, x, 0.14); cy = lerp(cy || y, y, 0.14);
          peek.style.left = clamp(cx, 200, innerWidth - 200) + 'px';
          peek.style.top = clamp(cy, 140, innerHeight - 140) + 'px';
        }
        requestAnimationFrame(loop);
      };
      loop();
    },
  };

  /* ------------------------------------------------------------------ *
   * FAQ
   * ------------------------------------------------------------------ */
  const Faq = {
    init() {
      $$('.faq__item').forEach((item) => {
        const btn = $('.faq__q', item);
        const panel = $('.faq__a', item);
        if (!btn || !panel) return;
        btn.addEventListener('click', () => {
          const open = item.classList.toggle('open');
          btn.setAttribute('aria-expanded', String(open));
          panel.setAttribute('aria-hidden', String(!open));
        });
      });
    },
  };

  /* ------------------------------------------------------------------ *
   * Contact form — composes an email or a WhatsApp message, no backend
   * ------------------------------------------------------------------ */
  const Contact = {
    init() {
      const form = $('[data-contact-form]');
      if (!form) return;
      const status = $('[data-form-status]', form);
      const compose = () => {
        const d = new FormData(form);
        const name = (d.get('name') || '').toString().trim();
        const org = (d.get('org') || '').toString().trim();
        const kind = (d.get('kind') || '').toString().trim();
        const budget = (d.get('budget') || '').toString().trim();
        const msg = (d.get('message') || '').toString().trim();
        const email = (d.get('email') || '').toString().trim();
        const lines = [
          `Name: ${name}`,
          org ? `Company: ${org}` : '',
          email ? `Email: ${email}` : '',
          kind ? `Project type: ${kind}` : '',
          budget ? `Budget: ${budget}` : '',
          '',
          msg,
        ].filter(Boolean);
        return { subject: `Project enquiry${name ? ' — ' + name : ''}`, body: lines.join('\n'), name, msg };
      };
      const validate = ({ name, msg }) => {
        if (!name || !msg) {
          if (status) status.textContent = 'Please add your name and a short description of the project.';
          return false;
        }
        return true;
      };
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const c = compose();
        if (!validate(c)) return;
        if (status) status.textContent = 'Opening your email app…';
        window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.body)}`;
      });
      const wa = $('[data-wa-send]', form);
      if (wa) {
        wa.addEventListener('click', () => {
          const c = compose();
          if (!validate(c)) return;
          if (status) status.textContent = 'Opening WhatsApp…';
          window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(c.body)}`, '_blank', 'noopener');
        });
      }
    },
  };

  /* ------------------------------------------------------------------ *
   * Copy to clipboard
   * ------------------------------------------------------------------ */
  const Copy = {
    init() {
      $$('[data-copy]').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          const v = btn.dataset.copy;
          try {
            await navigator.clipboard.writeText(v);
            const old = btn.dataset.label || btn.textContent;
            btn.dataset.label = old;
            btn.textContent = 'Copied';
            setTimeout(() => (btn.textContent = old), 1600);
          } catch (err) {
            window.location.href = btn.dataset.fallback || `mailto:${v}`;
          }
        });
      });
    },
  };

  /* ------------------------------------------------------------------ *
   * Page transition
   * ------------------------------------------------------------------ */
  const Trans = {
    init() {
      if (reduced) return;
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        document.body.classList.add('leaving');
        setTimeout(() => (window.location.href = href), 430);
      });
      window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('leaving'); });
    },
  };

  /* ------------------------------------------------------------------ *
   * Marquee: duplicate content so the loop is seamless
   * ------------------------------------------------------------------ */
  const Marquee = {
    init() {
      $$('.mq__track').forEach((t) => {
        t.innerHTML += t.innerHTML;
      });
    },
  };

  /* ------------------------------------------------------------------ *
   * Active nav
   * ------------------------------------------------------------------ */
  const ActiveNav = {
    init() {
      const path = location.pathname.split('/').pop() || 'index.html';
      $$('.nav a, .mmenu a').forEach((a) => {
        const href = (a.getAttribute('href') || '').split('/').pop();
        if (href && href === path) a.setAttribute('aria-current', 'page');
      });
    },
  };

  /* ------------------------------------------------------------------ *
   * Year
   * ------------------------------------------------------------------ */
  const Year = { init() { $$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear())); } };

  /* ------------------------------------------------------------------ *
   * Print trigger (résumé page)
   * ------------------------------------------------------------------ */
  const PrintBtn = { init() { $$('[data-print]').forEach((b) => b.addEventListener('click', () => window.print())); } };

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  const boot = () => {
    Theme.init();
    Marquee.init();
    Pre.init();
    Cursor.init();
    Glow.init();
    Forensic.init();
    TermFeed.init();
    Header.init();
    Reveal.init();
    Counters.init();
    Trail.init();
    GitHubCard.init();
    HScroll.init();
    Tilt.init();
    Parallax.init();
    Archive.init();
    Faq.init();
    Contact.init();
    Copy.init();
    PrintBtn.init();
    Trans.init();
    ActiveNav.init();
    Year.init();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
