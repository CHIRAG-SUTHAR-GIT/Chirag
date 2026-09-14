'use client';

import { useEffect } from 'react';
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
 *    canvas, the terminal feeds) start once here and never restart.
 *  - effects that read the CURRENT page's DOM (reveal targets, counters,
 *    the hero canvas, the pinned services scroll, card tilt, parallax)
 *    re-run on every route change, each tearing down its previous
 *    listeners/observers/rAF loops first.
 */
export function SiteFx() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups = [initCursor(), initGlow(), initForensic(), initTermFeed()];
    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cleanups = [initReveal(), initCounters(), initTrail(), initHScroll(), initTilt(), initParallax()];
    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
