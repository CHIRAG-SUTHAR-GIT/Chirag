/**
 * Inline SVG icons as React components. Small, tree-shakeable, no icon
 * font or library — matches the site's "no unnecessary dependency" style.
 */

export function IconArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 12L12 4M12 4H5.5M12 4v6.5" />
    </svg>
  );
}

export function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={`moon ${className ?? ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M21 13a9 9 0 11-10-10 7 7 0 0010 10z" />
    </svg>
  );
}

export function IconSun({ className }: { className?: string }) {
  return (
    <svg className={`sun ${className ?? ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
    </svg>
  );
}

export function IconWaves({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M2.5 9c1.4-1.8 3.3-1.8 4.7 0s3.3 1.8 4.7 0 3.3-1.8 4.7 0 3.3 1.8 4.7 0" />
      <path d="M2.5 15.5c1.4-1.8 3.3-1.8 4.7 0s3.3 1.8 4.7 0 3.3-1.8 4.7 0 3.3 1.8 4.7 0" />
    </svg>
  );
}

export function IconSquare({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <rect x="4.2" y="4.2" width="15.6" height="15.6" />
    </svg>
  );
}

export function IconLock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 018 0v3.5" />
    </svg>
  );
}

export function IconGithub({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 00-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.72-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 016 0c2.29-1.56 3.3-1.24 3.3-1.24.65 1.66.24 2.88.12 3.18.77.84 1.23 1.92 1.23 3.24 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0012 .5z" />
    </svg>
  );
}

export function IconInfo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 11v5.5M12 7.6v.9" />
    </svg>
  );
}
