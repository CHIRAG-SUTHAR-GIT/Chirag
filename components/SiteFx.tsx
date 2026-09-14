'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { initCursor } from '@/lib/fx/cursor';
import { initGlow } from '@/lib/fx/glow';
import { initForensic } from '@/lib/fx/forensic';
import { initTermFeed } from '@/lib/fx/termfeed';
import { initReveal } from '@/lib/fx/reveal';
import { initCounters } from '@/lib/fx/counters';
import { initTrail } from '@/lib/fx/trail';
import { initHScroll } from '@/lib/fx/hscroll';
import { initTilt } from '@/lib/fx/tilt';
import { initParallax } from '@/lib/fx/parallax';

/**
 * Mounts once in the root layout and stays alive for the whole session —
 * Next.js client-side navigation doesn't remount it, so:
 *
 *  - truly global, content-independent effects (cursor, glow, the ambient
 *    canvas, the terminal feeds) are the "forensic dark" theme's signature
 *    atmosphere, so they run only while that theme is active — starting
 *    and stopping live as the theme is cycled, not just on first mount.
 *  - effects that read the CURRENT page's DOM (reveal targets, counters,
 *    the hero canvas, the pinned services scroll, card tilt, parallax)
 *    re-run on every route change, each tearing down its previous
 *    listeners/observers/rAF loops first.
 */
export function SiteFx() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    const onTheme = () => setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    window.addEventListener('themechange', onTheme);
    return () => window.removeEventListener('themechange', onTheme);
  }, []);

  useEffect(() => {
    if (theme !== 'dark') return;
    const cleanups = [initCursor(), initGlow(), initForensic(), initTermFeed()];
    return () => cleanups.forEach((fn) => fn());
  }, [theme]);

  useEffect(() => {
    const cleanups = [initReveal(), initCounters(), initTrail(), initHScroll(), initTilt(), initParallax()];
    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
