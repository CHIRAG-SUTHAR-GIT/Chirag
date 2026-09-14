import { $$, clamp, isReduced, type Cleanup } from './util';

/** Animated count-up for `[data-count]` stat tiles. */
export function initCounters(): Cleanup {
  const els = $$<HTMLElement>('[data-count]');
  if (!els.length) return () => {};

  if (isReduced() || !('IntersectionObserver' in window)) {
    els.forEach((el) => (el.textContent = el.dataset.count ?? ''));
    return () => {};
  }

  const rafs = new Set<number>();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        io.unobserve(el);
        const target = parseFloat(el.dataset.count ?? '0');
        const dur = 1500;
        const t0 = performance.now();
        const step = (t: number) => {
          const p = clamp((t - t0) / dur, 0, 1);
          const e = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(target * e).toLocaleString('en-IN');
          if (p < 1) rafs.add(requestAnimationFrame(step));
        };
        rafs.add(requestAnimationFrame(step));
      });
    },
    { threshold: 0.4 }
  );
  els.forEach((el) => {
    el.textContent = '0';
    io.observe(el);
  });

  return () => {
    io.disconnect();
    rafs.forEach((id) => cancelAnimationFrame(id));
  };
}
