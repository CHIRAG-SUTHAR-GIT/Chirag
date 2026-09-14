import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter, JetBrains_Mono, Quicksand, Nunito_Sans, Archivo_Black, Space_Mono } from 'next/font/google';
import { site } from '@/lib/data/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Preloader } from '@/components/Preloader';
import { SiteFx } from '@/components/SiteFx';
import './globals.css';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// Two more complete type systems for the neumorphism and brutalism themes —
// see the `[data-theme="neu"]` / `[data-theme="brutal"]` token blocks in
// globals.css, which point --serif/--sans/--mono at these per theme.
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});
const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-nunito',
  display: 'swap',
});
const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo',
  display: 'swap',
});
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-spacemono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.name }],
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: site.url,
    locale: site.locale,
    images: [{ url: '/assets/img/og.png', width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.role}`,
    description: site.description,
    images: ['/assets/img/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const THEME_BOOT = `(function(){try{var t=localStorage.getItem('cs-theme');if(t==='neu'||t==='brutal'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  url: site.url,
  address: { '@type': 'PostalAddress', addressRegion: 'Gujarat', addressCountry: 'IN' },
  sameAs: [site.github, site.linkedin],
  knowsAbout: ['Python', 'Data analytics', 'Fraud analysis', 'Automation', 'Next.js', 'React', 'Android'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${quicksand.variable} ${nunito.variable} ${archivoBlack.variable} ${spaceMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        <Preloader />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="grain" aria-hidden="true" />
        <div className="glow" aria-hidden="true" />
        <div className="cur" aria-hidden="true">
          <span className="cur__label" />
        </div>
        <div className="cur-dot" aria-hidden="true" />
        {/* React renders this once and never touches its children again —
            lib/fx/forensic.ts and lib/fx/termfeed.ts own everything inside
            it imperatively. Keeping their DOM mutations off <body> itself
            avoids fighting React's own reconciliation of body's children
            across client-side navigations. */}
        <div id="fx-root" aria-hidden="true" />

        <Header />
        {children}
        <Footer />
        <SiteFx />
      </body>
    </html>
  );
}
