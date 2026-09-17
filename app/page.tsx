import Link from 'next/link';
import type { Metadata } from 'next';
import { site, hero, stats, marquee, services, process as processSteps, stack } from '@/lib/data/site';
import { featured, projects } from '@/lib/data/projects';
import { WorkCard, ArrowLink } from '@/components/WorkCard';
import { GhCard } from '@/components/GhCard';
import { Marquee } from '@/components/Marquee';
import { Cta } from '@/components/Cta';
import { IconArrow } from '@/components/icons';

export const metadata: Metadata = {
  title: `${site.name} — ${site.role} | ${site.tagline}`,
  description: site.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
    <main id="main">
      <section className="hero">
        <canvas className="hero__canvas" aria-hidden="true" />
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__in wrap">
          <div className="hero__grid">
            <div>
              <p className="eyebrow line-mask">
                <span>{hero.eyebrow}</span>
              </p>
              <h1 className="d1">
                {hero.lines.map((l, i) => (
                  <span className="line-mask" key={l}>
                    <span>{i === 1 ? <em>{l}</em> : l}</span>
                  </span>
                ))}
              </h1>
            </div>
            <div className="hero__meta">
              <span className="avail rv rv-d2">
                <i />
                {site.availability}
              </span>
              <p className="hero__intro rv rv-d2">{hero.intro}</p>
              <GhCard />
              <div className="hero__cta rv rv-d4">
                <Link className="btn btn--solid" href="/work" data-cursor="View">
                  See the work <IconArrow />
                </Link>
                <Link className="btn" href="/contact">
                  Start a project
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="hero__scroll" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </section>

      <Marquee items={marquee} />

      <section className="section--tight">
        <div className="stats">
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
      </section>

      <section className="section" id="work">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow rv">Selected work</p>
              <h2 className="d2 rv rv-d1" style={{ marginTop: '1.1rem' }}>
                Systems in daily use,
                <br />
                <span className="it accent">not concepts.</span>
              </h2>
            </div>
            <p className="lede rv rv-d2">
              Each cover below is generated, not a screenshot — most of what I build runs on live case data with nothing to show publicly. The
              outcomes and links underneath are real.
            </p>
          </div>
          <div className="work-grid">
            {featured.map((p) => (
              <WorkCard project={p} key={p.slug} />
            ))}
          </div>
          <p style={{ marginTop: 'clamp(2.5rem,5vw,4rem)' }} className="rv">
            <ArrowLink href="/work">See all {projects.length} projects</ArrowLink>
          </p>
        </div>
      </section>

      <section className="section hscroll" id="services">
        <div className="hscroll__sticky">
          <div style={{ width: '100%' }}>
            <div className="wrap" style={{ paddingBottom: 'clamp(1.5rem,3vw,2.5rem)' }}>
              <p className="eyebrow rv">What I do</p>
              <h2 className="d3 rv rv-d1" style={{ marginTop: '0.9rem', maxWidth: '22ch' }}>
                Four kinds of work, one standard of finish.
              </h2>
            </div>
            <div className="hscroll__track">
              {services.map((s) => (
                <article className="svc rv" key={s.n}>
                  <span className="svc__n">{s.n}</span>
                  <h3 className="svc__t">{s.title}</h3>
                  <p className="svc__s">{s.summary}</p>
                  <ul>
                    {s.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow rv">How I work</p>
              <h2 className="d2 rv rv-d1" style={{ marginTop: '1.1rem' }}>
                Four steps, <span className="it accent">no theatre.</span>
              </h2>
            </div>
            <p className="lede rv rv-d2">Most projects fail in the gap between what was asked for and what was needed. This is how I close it.</p>
          </div>
          <div className="steps">
            {processSteps.map((s) => (
              <article className="step rv" key={s.n}>
                <div className="step__n">{s.n}</div>
                <h3 className="step__t">{s.title}</h3>
                <p className="step__b">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow rv">Stack</p>
              <h2 className="d2 rv rv-d1" style={{ marginTop: '1.1rem' }}>
                Tools I reach for.
              </h2>
            </div>
            <p className="lede rv rv-d2">Chosen per problem, not per fashion. A static page beats a framework when a framework buys nothing.</p>
          </div>
          <div className="stack-grid rv">
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
      </section>

    </main>
    <Cta />
    </>
  );
}
