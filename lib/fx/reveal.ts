import { $$, isReduced, type Cleanup } from './util';

/** Scroll-triggered reveal for `.rv` and `.line-mask` elements. Re-run on
 * every route change since each page mounts its own set of these. */
export function initReveal(): Cleanup {
  const els = $$('.rv, .line-mask');
  if (!els.length) return () => {};

  if (!('IntersectionObserver' in window) || isReduced()) {
    els.forEach((el) => el.classList.add('in'));
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  els.forEach((el) => io.observe(el));

  // Reveal anything already in view at mount (e.g. the very top of a
  // freshly-navigated page) without waiting for a scroll event.
  requestAnimationFrame(() => {
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.94) el.classList.add('in');
    });
  });

  return () => io.disconnect();
}
