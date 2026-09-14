import { $, clamp, isReduced, type Cleanup } from './util';

/** Pinned horizontal scroll for the services section on the home page. */
export function initHScroll(): Cleanup {
  const sec = $<HTMLElement>('.hscroll');
  if (!sec) return () => {};
  const track = $<HTMLElement>('.hscroll__track', sec);
  const wrap = $<HTMLElement>('.wrap');
  if (!track) return () => {};

  const mq = window.matchMedia('(min-width: 821px)');
  let dist = 0;

  const onScroll = () => {
    if (!mq.matches || isReduced()) return;
    const r = sec.getBoundingClientRect();
    const p = clamp(-r.top / (sec.offsetHeight - window.innerHeight || 1), 0, 1);
    track.style.transform = `translate3d(${-p * dist}px,0,0)`;
  };

  const measure = () => {
    if (!mq.matches || isReduced()) {
      track.style.transform = '';
      sec.style.height = '';
      return;
    }
    const gut = parseFloat(getComputedStyle(wrap ?? document.body).paddingLeft) || 24;
    dist = Math.max(0, track.scrollWidth - window.innerWidth + gut);
    sec.style.height = window.innerHeight + dist + 'px';
    onScroll();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  mq.addEventListener?.('change', measure);
  measure();
  const settle = setTimeout(measure, 600);

  return () => {
    clearTimeout(settle);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', measure);
    mq.removeEventListener?.('change', measure);
    track.style.transform = '';
    sec.style.height = '';
  };
}
