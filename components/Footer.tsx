import Link from 'next/link';
import { site, nav } from '@/lib/data/site';
import { featured } from '@/lib/data/projects';

export function Footer() {
  const top = featured.slice(0, 5);
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__grid">
          <div>
            <div className="ftr__name">Chirag Suthar</div>
            <p className="ftr__blurb">
              {site.role}. Data systems and automation for cyber crime investigation, and product work for businesses that need software that earns its
              keep.
            </p>
            <p className="ftr__blurb">
              <span className="avail" style={{ marginTop: '1rem' }}>
                <i />
                {site.availability}
              </span>
            </p>
          </div>
          <div>
            <h3>Selected work</h3>
            <ul>
              {top.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/work">All projects</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Site</h3>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Elsewhere</h3>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              </li>
              <li>
                <a href={site.github} target="_blank" rel="noopener">
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.linkedin} target="_blank" rel="noopener">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="ftr__bot">
          <span>&copy; {new Date().getFullYear()} Chirag Suthar — {site.location}</span>
          <span>Built with Next.js. No page builder, no template.</span>
        </div>
      </div>
    </footer>
  );
}
