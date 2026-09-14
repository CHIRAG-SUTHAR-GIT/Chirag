import { $$, isReduced, isBrutal, type Cleanup } from './util';

/** Light scroll parallax for `[data-para]` elements (the case-study cover
 * shot). Skipped in brutalism, which stays flat and rigid on purpose. */
export function initParallax(): Cleanup {
  const els = $$<HTMLElement>('[data-para]');
  if (!els.length || isReduced() || isBrutal()) return () => {};

  const onScroll = () => {
    const vh = innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      const amt = parseFloat(el.dataset.para ?? '14') || 14;
      el.style.transform = `translate3d(0, ${(-p * amt).toFixed(2)}px, 0)`;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    els.forEach((el) => (el.style.transform = ''));
  };
}
