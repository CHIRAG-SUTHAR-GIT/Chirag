import Link from 'next/link';
import type { Metadata } from 'next';
import { site, stats, timeline, principles, stack } from '@/lib/data/site';
import { Cta } from '@/components/Cta';
import { IconArrow } from '@/components/icons';

export const metadata: Metadata = {
  title: 'About',
  description: 'Python developer at the Cyber Centre of Excellence, Gujarat State. How I work, what I care about, and what I have shipped.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <main id="main">
        <section className="phero">
          <div className="wrap">
            <div className="phero__grid">
              <div>
                <p className="eyebrow line-mask">
                  <span>About</span>
                </p>
                <h1 className="d1" style={{ marginTop: '1.2rem' }}>
                  <span className="line-mask">
                    <span>I build tools</span>
                  </span>
                  <span className="line-mask">
                    <span>for people with</span>
                  </span>
                  <span className="line-mask">
                    <span className="it accent">real deadlines.</span>
                  </span>
                </h1>
              </div>
              <div className="rv rv-d2" style={{ display: 'grid', gap: '1.25rem' }}>
                <p className="lede">
                  Most of my week is spent inside cyber crime data: bank statements by the million rows, complaint exports, portal work that used to be
                  done by hand. The rest goes to businesses who need a website, a dashboard or an app that actually moves their numbers.
                </p>
                <p className="lede">The two halves teach each other. Investigation work makes you paranoid about correctness. Client work makes you honest about deadlines.</p>
                <div className="cta__row" style={{ justifyContent: 'flex-start' }}>
                  <Link className="btn btn--solid" href="/resume" data-cursor="Résumé">
                    View résumé <IconArrow />
                  </Link>
                  <a className="btn" href={site.resumePdf} download>
                    Download PDF <IconArrow />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section--tight">
          <div className="wrap">
            <div className="stats" style={{ borderRadius: 0 }}>
              {stats.map((s) => (
                <div className="stat rv" key={s.label}>
                  <div className="stat__v">
                    <span data-count={s.value}>{s.value}</span>
                    {s.suffix && <sup>{s.suffix}</sup>}
                  </div>
                  <p className="stat__l">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow rv">Track record</p>
                <h2 className="d2 rv rv-d1" style={{ marginTop: '1.1rem' }}>
                  Where the work has been done.
                </h2>
              </div>
            </div>
            <div className="tl">
              {timeline.map((t) => (
                <article className="tl__item rv" key={t.org}>
                  <div>
                    <div className="tl__when">{t.period}</div>
                    <h3 className="tl__org">{t.org}</h3>
                    <div className="tl__role">{t.role}</div>
                  </div>
                  <ul className="tl__pts">
                    {t.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow rv">Principles</p>
                <h2 className="d2 rv rv-d1" style={{ marginTop: '1.1rem' }}>
                  What I will not trade away.
                </h2>
              </div>
            </div>
            <div className="pcards rv">
              {principles.map((p) => (
                <div className="pcard" key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap two-col">
            <div>
              <p className="eyebrow rv">Working languages</p>
              <h2 className="d3 rv rv-d1" style={{ marginTop: '1rem' }}>
                English, Hindi, Gujarati.
              </h2>
              <p className="lede rv rv-d2" style={{ marginTop: '1.25rem' }}>
                Client conversations, officer walkthroughs and documentation, in whichever of the three is easiest for the person on the other side.
              </p>
            </div>
            <div className="rv rv-d2">
              <div className="stack-grid">
                {stack.map((g) => (
                  <div className="stack-cell" key={g.group}>
                    <h3>{g.group}</h3>
                    <ul>
                      {g.items.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Cta />
    </>
  );
}
