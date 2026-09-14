import { $, lerp, isReduced, isFine, type Cleanup } from './util';

/** The soft pointer-following radial glow behind the page. Global. */
export function initGlow(): Cleanup {
  const el = $<HTMLDivElement>('.glow');
  if (!el || !isFine() || isReduced()) return () => {};

  let x = innerWidth * 0.7,
    y = innerHeight * 0.3,
    cx = x,
    cy = y,
    raf = 0,
    alive = true;

  const onMove = (e: MouseEvent) => {
    x = e.clientX;
    y = e.clientY;
    document.body.classList.add('glow-on');
  };
  const loop = () => {
    if (!alive) return;
    cx = lerp(cx, x, 0.045);
    cy = lerp(cy, y, 0.045);
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  document.addEventListener('mousemove', onMove, { passive: true });

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    document.removeEventListener('mousemove', onMove);
  };
}
