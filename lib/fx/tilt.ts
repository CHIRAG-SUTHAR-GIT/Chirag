import { $, $$, lerp, isReduced, isFine, isBrutal, type Cleanup } from './util';

/** Subtle 3D tilt on `[data-tilt]` cards (the featured work grid). Skipped
 * in brutalism, which stays flat and rigid on purpose. */
export function initTilt(): Cleanup {
  if (!isFine() || isReduced() || isBrutal()) return () => {};
  const cards = $$<HTMLElement>('[data-tilt]');
  if (!cards.length) return () => {};

  const teardowns: Cleanup[] = [];

  cards.forEach((card) => {
    const inner = $<HTMLElement>('.work-card__shot', card) ?? card;
    let rx = 0,
      ry = 0,
      tx = 0,
      ty = 0,
      raf = 0;

    const loop = () => {
      rx = lerp(rx, tx, 0.12);
      ry = lerp(ry, ty, 0.12);
      inner.style.transform = `perspective(1400px) rotateX(${ry}deg) rotateY(${rx}deg) translate3d(0,0,0)`;
      if (Math.abs(rx - tx) > 0.01 || Math.abs(ry - ty) > 0.01) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 5;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 4;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    teardowns.push(() => {
      cancelAnimationFrame(raf);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
      inner.style.transform = '';
    });
  });

  return () => teardowns.forEach((fn) => fn());
}
