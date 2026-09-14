'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The loading-bar screen shown once on a cold start. Unlike the old
 * vanilla-JS version, this never removes its own DOM node imperatively —
 * doing that to a node React still believes it owns corrupts React's
 * reconciliation the next time anything else in <body> re-renders (it
 * throws "insertBefore/removeChild: not a child of this node" on the very
 * next unrelated state change, anywhere in the tree). Instead this
 * component tracks its own `visible` state and lets React do the removal.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const barRef = useRef<HTMLElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let v = 0;
    let tickTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      document.body.classList.add('loaded');
      hideTimer = setTimeout(() => setVisible(false), 900);
    };

    const tick = () => {
      v = Math.min(100, v + Math.random() * 18 + 6);
      if (barRef.current) barRef.current.style.right = 100 - v + '%';
      if (pctRef.current) pctRef.current.textContent = String(Math.round(v)).padStart(3, '0') + '%';
      if (v < 100) tickTimer = setTimeout(tick, 90 + Math.random() * 90);
      else setTimeout(finish, 260);
    };

    const failsafe = setTimeout(finish, 3600); // never let the loader trap the page

    if (reduced) finish();
    else tickTimer = setTimeout(tick, 120);

    return () => {
      clearTimeout(tickTimer);
      clearTimeout(hideTimer);
      clearTimeout(failsafe);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pre" role="status" aria-live="polite">
      <div className="pre__inner">
        <div className="pre__name">Chirag Suthar</div>
        <div className="pre__bar">
          <i ref={barRef} />
        </div>
        <div className="pre__pct" ref={pctRef}>
          000%
        </div>
      </div>
    </div>
  );
}
