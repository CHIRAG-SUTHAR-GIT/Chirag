import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { site } from '@/lib/data/site';
import { projects, getProject } from '@/lib/data/projects';
import { ProjectShot } from '@/components/ProjectShot';
import { Cta } from '@/components/Cta';
import { IconArrow, IconArrowRight, IconLock } from '@/components/icons';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.subtitle}`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} — ${p.subtitle}`, description: p.summary },
  };
}

function hostOf(href: string) {
  return href.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = projects.findIndex((p) => p.slug === slug);
  const p = projects[idx];
  if (!p) notFound();
  const next = projects[(idx + 1) % projects.length];

  const live = p.links.find((l) => l.kind === 'live');
  const code = p.links.find((l) => l.kind === 'code');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    headline: `${p.title} — ${p.subtitle}`,
    description: p.summary,
    author: { '@type': 'Person', name: site.name, url: site.url },
    dateCreated: p.year,
    url: `${site.url}/work/${p.slug}`,
    keywords: p.stack.join(', '),
  };

  return (
    <>
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <article>
          <section className="case-hero">
            <div className="wrap">
              <p className="eyebrow line-mask">
                <span>
                  <Link href="/work" style={{ color: 'inherit' }}>
                    Work
                  </Link>{' '}
                  — {p.category}
                </span>
              </p>
              <h1 className="d1" style={{ marginTop: '1.4rem' }}>
                <span className="line-mask">
                  <span>{p.title}</span>
                </span>
              </h1>
              <p className="lede case-hero__sub rv rv-d2">
                {p.subtitle}. {p.summary}
              </p>
              <div className="case-hero__meta rv rv-d3" style={{ marginTop: '1.75rem' }}>
                {live && (
                  <a className="pill pill--live" href={live.href} target="_blank" rel="noopener">
                    Live — {hostOf(live.href)}
                  </a>
                )}
                {code && (
                  <a className="pill" href={code.href} target="_blank" rel="noopener">
                    Source on GitHub
                  </a>
                )}
                {p.confidential && <span className="pill pill--lock">Restricted deployment</span>}
                <span className="pill">{p.year}</span>
              </div>

              <div className="case-shot rv rv-d3" data-para="18">
                <ProjectShot project={p} priority />
              </div>

              <dl className="case-facts rv">
                <div className="fact">
                  <dt>Client</dt>
                  <dd>{p.client}</dd>
                </div>
                <div className="fact">
                  <dt>Role</dt>
                  <dd>{p.role}</dd>
                </div>
                <div className="fact">
                  <dt>Stack</dt>
                  <dd>{p.tag}</dd>
                </div>
                <div className="fact">
                  <dt>Status</dt>
                  <dd>{p.confidential ? 'In service, restricted' : 'Live in production'}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="section">
            <div className="wrap">
              <div className="case-body">
                <div>
                  <p className="eyebrow rv">The problem</p>
                  <div className="prose rv rv-d1" style={{ marginTop: '1.25rem' }}>
                    <p>{p.problem}</p>
                  </div>
                </div>
                <div>
                  <p className="eyebrow rv">What I built</p>
                  <div className="prose rv rv-d1" style={{ marginTop: '1.25rem' }}>
                    <p>{p.approach}</p>
                  </div>
                </div>
              </div>

              {p.metrics.length > 0 && (
                <div className="metrics rv" style={{ marginTop: 'clamp(2.5rem,5vw,4rem)' }}>
                  {p.metrics.map((m) => (
                    <div className="metric" key={m.label}>
                      <b>{m.value}</b>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {p.confidential && (
                <div className="note rv" style={{ marginTop: 'clamp(2rem,4vw,3rem)' }}>
                  <IconLock />
                  <span>{p.confidential}</span>
                </div>
              )}
            </div>
          </section>

          <section className="section--tight">
            <div className="wrap">
              <p className="eyebrow rv">Inside it</p>
              <div className="feat-grid rv" style={{ marginTop: '1.5rem' }}>
                {p.features.map((f, i) => (
                  <div className="feat" key={f.title}>
                    <span className="feat__n">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {p.gallery.length > 0 && (
            <section className="section">
              <div className="wrap">
                <p className="eyebrow rv">Screens</p>
                <p className="lede rv rv-d1" style={{ marginTop: '1rem', maxWidth: '56ch' }}>
                  Captured from the running product, not from a mockup.
                </p>
                <div className="gal" style={{ marginTop: 'clamp(2rem,4vw,3rem)' }}>
                  {p.gallery.map((g) => (
                    <figure className={`rv${g.long ? ' gal--long' : ''}`} key={g.src + g.alt}>
                      <Image
                        src={`/assets/img/work/${g.src}.webp`}
                        alt={g.alt}
                        width={g.w}
                        height={g.h}
                        sizes={g.long ? undefined : '(max-width: 1000px) 100vw, 1400px'}
                      />
                      <figcaption>{g.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="section">
            <div className="wrap two-col">
              <div>
                <p className="eyebrow rv">Outcome</p>
                <ul className="checks rv rv-d1" style={{ marginTop: '1.5rem' }}>
                  {p.outcome.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
              <div className="rv rv-d1">
                <p className="eyebrow">Built with</p>
                <ul className="tags" style={{ marginTop: '1.5rem' }}>
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {p.links.length > 0 && (
                  <div className="cta__row" style={{ justifyContent: 'flex-start', marginTop: '2rem' }}>
                    {p.links.map((l) => (
                      <a key={l.href} className={`btn ${l.kind === 'live' ? 'btn--solid' : ''}`} href={l.href} target="_blank" rel="noopener">
                        {l.label} <IconArrow />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </article>

        <Link className="nextp" href={`/work/${next.slug}`} data-cursor="Next">
          <div className="wrap">
            <p className="eyebrow">Next project</p>
            <div className="nextp__t" style={{ marginTop: '1rem' }}>
              {next.title} <IconArrowRight />
            </div>
            <p className="lede" style={{ marginTop: '.75rem', maxWidth: '52ch' }}>
              {next.subtitle}
            </p>
          </div>
        </Link>
      </main>
      <Cta />
    </>
  );
}
