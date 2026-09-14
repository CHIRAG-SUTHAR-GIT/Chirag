import { $, isReduced, isFine, type Cleanup } from './util';

type NodeKind = 'src' | 'out' | 'frozen' | 'mid';
interface TNode {
  x: number;
  y: number;
  l: number;
  i: number;
  r: number;
  ph: number;
  amp: number;
  kind: NodeKind;
}
interface TEdge {
  a: TNode;
  b: TNode;
}
interface TPacket {
  e: TEdge;
  t: number;
  sp: number;
  s: number;
}

/** The hero canvas: a money trail moving through layered accounts. Only
 * present on the home page, so this is re-run on every route change and
 * simply no-ops (with an empty cleanup) when `.hero__canvas` isn't there. */
export function initTrail(): Cleanup {
  const cv = $<HTMLCanvasElement>('.hero__canvas');
  if (!cv) return () => {};
  const ctx = cv.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  let W = 0,
    H = 0,
    dpr = 1,
    nodes: TNode[] = [],
    edges: TEdge[] = [],
    packets: TPacket[] = [],
    raf = 0,
    running = true;
  let px = 0.5,
    py = 0.5,
    cpx = 0.5,
    cpy = 0.5;

  const palette = () => {
    const cs = getComputedStyle(document.documentElement);
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      accent: cs.getPropertyValue('--accent').trim() || '#ffb020',
      teal: cs.getPropertyValue('--accent-2').trim() || '#5eead4',
      line: light ? 'rgba(10,14,20,0.16)' : 'rgba(255,255,255,0.12)',
      node: light ? 'rgba(10,14,20,0.5)' : 'rgba(255,255,255,0.55)',
    };
  };
  let col = palette();
  const onTheme = () => (col = palette());
  window.addEventListener('themechange', onTheme);

  const spawn = (t?: number) => {
    const e = edges[(Math.random() * edges.length) | 0];
    if (!e) return;
    packets.push({ e, t: t || 0, sp: 0.0022 + Math.random() * 0.0042, s: 1.1 + Math.random() * 1.5 });
  };

  const build = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.clientWidth;
    H = cv.clientHeight;
    cv.width = Math.floor(W * dpr);
    cv.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const layers = W < 760 ? 4 : 6;
    const perLayer = W < 760 ? 3 : 4;
    nodes = [];
    edges = [];
    packets = [];

    const x0 = W * (W < 900 ? 0.1 : 0.42);
    const x1 = W * 0.96;
    for (let l = 0; l < layers; l++) {
      const count = l === 0 ? 1 : Math.max(2, Math.round(perLayer - Math.abs(l - layers / 2) * 0.6));
      for (let i = 0; i < count; i++) {
        const x = x0 + ((x1 - x0) * l) / (layers - 1);
        const spread = H * 0.62;
        const y = H * 0.5 + (count === 1 ? 0 : (i / (count - 1) - 0.5) * spread) + (Math.random() - 0.5) * H * 0.06;
        nodes.push({
          x,
          y,
          l,
          i,
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

  const pos = (n: TNode, time: number) => ({
    x: n.x + Math.sin(time * 0.00035 + n.ph) * n.amp * 0.6 + (cpx - 0.5) * (18 + n.l * 5),
    y: n.y + Math.cos(time * 0.0004 + n.ph) * n.amp + (cpy - 0.5) * (14 + n.l * 4),
  });

  const draw = (time: number) => {
    ctx.clearRect(0, 0, W, H);
    cpx += (px - cpx) * 0.05;
    cpy += (py - cpy) * 0.05;

    ctx.lineWidth = 1;
    edges.forEach((e) => {
      const a = pos(e.a, time),
        b = pos(e.b, time);
      const mx = (a.x + b.x) / 2;
      ctx.strokeStyle = col.line;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.bezierCurveTo(mx, a.y, mx, b.y, b.x, b.y);
      ctx.stroke();
    });

    packets.forEach((p) => {
      p.t += p.sp;
      if (p.t > 1) {
        p.t = 0;
        p.e = edges[(Math.random() * edges.length) | 0];
      }
      if (!p.e) return;
      const a = pos(p.e.a, time),
        b = pos(p.e.b, time);
      const mx = (a.x + b.x) / 2;
      const t = p.t,
        u = 1 - t;
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

    nodes.forEach((n) => {
      const p = pos(n, time);
      const pulse = 0.65 + Math.sin(time * 0.0016 + n.ph) * 0.35;
      if (n.kind === 'src') {
        ctx.fillStyle = col.accent;
        ctx.globalAlpha = 0.14 * pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (n.kind === 'out') {
        ctx.strokeStyle = col.teal;
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.r + 2.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = col.teal;
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
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
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });

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
  if (isReduced()) {
    draw(0);
    stop();
  } else {
    raf = requestAnimationFrame(draw);
  }

  let rt: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(rt);
    rt = setTimeout(build, 220);
  };
  window.addEventListener('resize', onResize);

  const onMove = (e: MouseEvent) => {
    px = e.clientX / innerWidth;
    py = e.clientY / innerHeight;
  };
  if (isFine() && !isReduced()) window.addEventListener('mousemove', onMove, { passive: true });

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  let io: IntersectionObserver | undefined;
  if ('IntersectionObserver' in window && !isReduced()) {
    io = new IntersectionObserver((en) => (en[0].isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(cv);
  }

  const spawnTimer = setInterval(() => {
    if (running && packets.length < 34) spawn();
  }, 2600);

  return () => {
    stop();
    clearTimeout(rt);
    clearInterval(spawnTimer);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('themechange', onTheme);
    document.removeEventListener('visibilitychange', onVisibility);
    io?.disconnect();
  };
}
