import Link from 'next/link';
import { site } from '@/lib/data/site';
import { IconArrow } from './icons';

export function Cta() {
  return (
    <section className="cta">
      <div className="wrap">
        <h2 className="cta__big rv">
          Let&apos;s build
          <br />
          something <em>that works</em>.
        </h2>
        <p className="cta__sub rv rv-d1">
          Tell me what the software has to do and who has to use it. You will get a straight answer on scope, timeline and price — and if I am not the
          right person for it, I will say so.
        </p>
        <div className="cta__row rv rv-d2">
          <Link className="btn btn--solid" href="/contact" data-cursor="Go">
            Start a project <IconArrow />
          </Link>
          <a className="btn" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">
            WhatsApp <IconArrow />
          </a>
          <a className="btn" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
