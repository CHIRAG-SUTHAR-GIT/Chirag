import { $, lerp, isReduced, isFine, type Cleanup } from './util';

/** Custom ring-and-dot cursor that grows and labels itself over interactive
 * elements. Global, page-independent — set up once for the app's life. */
export function initCursor(): Cleanup {
  if (!isFine() || isReduced()) return () => {};
  const ring = $<HTMLDivElement>('.cur');
  const dot = $<HTMLDivElement>('.cur-dot');
  const label = $<HTMLSpanElement>('.cur__label');
  if (!ring || !dot) return () => {};

  let mx = innerWidth / 2,
    my = innerHeight / 2,
    rx = mx,
    ry = my,
    raf = 0,
    alive = true;

  const onMove = (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
    document.body.classList.add('cursor-on');
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
  };
  const onLeave = () => document.body.classList.remove('cursor-on');

  const hotSel = 'a, button, [data-cursor], input, textarea, select, summary';
  const onOver = (e: MouseEvent) => {
    const t = (e.target as Element)?.closest?.(hotSel);
    if (!t) return;
    document.body.classList.add('cursor-hot');
    if (label) label.textContent = (t as HTMLElement).dataset.cursor || '';
  };
  const onOut = (e: MouseEvent) => {
    if ((e.target as Element)?.closest?.(hotSel)) {
      document.body.classList.remove('cursor-hot');
      if (label) label.textContent = '';
    }
  };

  const loop = () => {
    if (!alive) return;
    rx = lerp(rx, mx, 0.16);
    ry = lerp(ry, my, 0.16);
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseleave', onLeave);
    document.removeEventListener('mouseover', onOver);
    document.removeEventListener('mouseout', onOut);
    document.body.classList.remove('cursor-on', 'cursor-hot');
  };
}
