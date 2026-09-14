import Link from 'next/link';
import { IconArrow } from '@/components/icons';

export default function NotFound() {
  return (
    <main id="main">
      <section className="phero" style={{ minHeight: '70svh', display: 'flex', alignItems: 'center' }}>
        <div className="wrap">
          <p className="eyebrow line-mask">
            <span>Error 404</span>
          </p>
          <h1 className="d1" style={{ marginTop: '1.2rem', maxWidth: '16ch' }}>
            <span className="line-mask">
              <span>This page has</span>
            </span>
            <span className="line-mask">
              <span className="it accent">no trail.</span>
            </span>
          </h1>
          <p className="lede rv rv-d2" style={{ marginTop: '1.75rem', maxWidth: '48ch' }}>
            The link is broken or the page has moved. The work is all still here.
          </p>
          <div className="cta__row rv rv-d3" style={{ justifyContent: 'flex-start', marginTop: '2rem' }}>
            <Link className="btn btn--solid" href="/">
              Back to home <IconArrow />
            </Link>
            <Link className="btn" href="/work">
              See the work <IconArrow />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
