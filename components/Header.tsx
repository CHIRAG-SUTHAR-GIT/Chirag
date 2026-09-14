'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site, nav } from '@/lib/data/site';
import { IconGithub, IconMoon, IconWaves, IconSquare } from './icons';

const THEMES = ['dark', 'neu', 'brutal'] as const;
type ThemeName = (typeof THEMES)[number];
const THEME_META: Record<ThemeName, { label: string; color: string }> = {
  dark: { label: 'Forensic dark', color: '#06070a' },
  neu: { label: 'Neumorphism', color: '#e6e2da' },
  brutal: { label: 'Brutalism', color: '#f5f3ee' },
};

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [hide, setHide] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('dark');

  // Pick up whatever the pre-hydration boot script already applied so the
  // icon matches the live page instead of flashing to "dark" for a frame.
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'neu' || current === 'brutal' || current === 'dark') setTheme(current);
  }, []);

  const cycleTheme = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_META[next].color);
    try {
      localStorage.setItem('cs-theme', next);
    } catch {
      // private browsing / storage disabled — theme just won't persist
    }
    window.dispatchEvent(new CustomEvent('themechange'));
  };

  // Mirror menu state onto <body> so the existing CSS (mobile menu clip-path,
  // burger animation, scroll lock) keeps working untouched.
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
    if (open) setHide(false);
  }, [open]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 24);
      if (!document.body.classList.contains('menu-open')) setHide(y > last && y > 420);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close the menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`hdr${stuck ? ' stuck' : ''}${hide ? ' hide' : ''}`}>
        <div className="hdr__in">
          <Link className="brand" href="/" aria-label={`${site.name} — home`}>
            <span className="brand__mark">
              Chirag&nbsp;Suthar
              <span className="brand__dot" />
            </span>
            <span className="brand__sub">Developer</span>
          </Link>
          <nav className="nav" aria-label="Primary">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={pathname === n.href ? 'page' : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hdr__side">
            <a className="icon-btn" href={site.github} target="_blank" rel="noopener" aria-label="Open GitHub profile" data-cursor="GitHub">
              <IconGithub />
            </a>
            <button
              className="icon-btn theme-btn"
              type="button"
              aria-label={`Switch to ${THEME_META[THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]].label} theme`}
              title={`Theme: ${THEME_META[theme].label} — click to switch`}
              onClick={cycleTheme}
            >
              {theme === 'dark' && <IconMoon />}
              {theme === 'neu' && <IconWaves />}
              {theme === 'brutal' && <IconSquare />}
            </button>
            <Link className="btn btn--sm btn--solid hide-sm" href="/contact">
              Start a project
            </Link>
            <button className="burger" type="button" aria-label="Menu" aria-expanded={open} aria-controls="mmenu" onClick={() => setOpen((v) => !v)}>
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>

      <div className="mmenu" id="mmenu">
        <nav aria-label="Mobile">
          <ol>
            {[{ label: 'Home', href: '/' }, ...nav].map((n, i) => (
              <li key={n.href}>
                <Link href={n.href} onClick={close}>
                  <span className="mmenu__n">0{i + 1}</span>
                  {n.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mmenu__foot">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <a href={site.github} target="_blank" rel="noopener">
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
