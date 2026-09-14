import { isReduced, type Cleanup } from './util';

interface FNode {
  x: number;
  y: number;
  ph: number;
  r: number;
  sq: boolean;
}
interface FEdge {
  a: FNode;
  b: FNode;
}
interface FPacket {
  e: FEdge;
  t: number;
  sp: number;
}

/** The ambient, site-wide network canvas: a quiet mesh of nodes, drifting
 * packets and a slow scanning sweep, in the same visual language as the
 * case-study flow diagrams. Injects its own canvas element once; entirely
 * page-independent (viewport-sized, not content-sized), so it is set up
 * once for the app's life rather than per route. */
export function initForensic(): Cleanup {
  if (isReduced()) return () => {};

  const root = document.getElementById('fx-root');
  if (!root) return () => {};

  const cv = document.createElement('canvas');
  cv.className = 'fscan';
  cv.setAttribute('aria-hidden', 'true');
  root.appendChild(cv);
  const ctx = cv.getContext('2d', { alpha: true });
  if (!ctx) {
    cv.remove();
    return () => {};
  }

  let W = 0,
    H = 0,
    dpr = 1,
    nodes: FNode[] = [],
    edges: FEdge[] = [],
    packets: FPacket[] = [],
    raf = 0,
    running = true,
    sweep = -0.25;

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
  const onTheme = () => {
    col = palette();
  };
  window.addEventListener('themechange', onTheme);

  const spawn = () => {
    const e = edges[(Math.random() * edges.length) | 0];
    if (!e) return;
    packets.push({ e, t: Math.random(), sp: 0.0008 + Math.random() * 0.0014 });
  };

  const build = () => {
    dpr = Math.min(1.6, window.devicePixelRatio || 1);
    W = innerWidth;
    H = innerHeight;
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
        .forEach((x) => {
          if (x.d < cellDiag * 1.4) edges.push({ a: n, b: x.m });
        });
    });
    packets = [];
    const seed = Math.min(16, Math.round(edges.length * 0.55));
    for (let i = 0; i < seed; i++) spawn();
  };

  const draw = (time: number) => {
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
      if (p.t > 1) {
        p.t = 0;
        p.e = edges[(Math.random() * edges.length) | 0];
      }
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

  const start = () => {
    if (!running) {
      running = true;
      raf = requestAnimationFrame(draw);
    }
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  build();
  raf = requestAnimationFrame(draw);

  let rt: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(rt);
    rt = setTimeout(build, 250);
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  const spawnTimer = setInterval(() => {
    if (running && packets.length < 22) spawn();
  }, 3400);

  return () => {
    stop();
    clearTimeout(rt);
    clearInterval(spawnTimer);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('themechange', onTheme);
    cv.remove();
  };
}
