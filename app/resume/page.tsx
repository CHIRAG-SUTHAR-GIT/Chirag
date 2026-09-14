import type { Metadata } from 'next';
import { site, hero, timeline, stats, stack } from '@/lib/data/site';
import { projects } from '@/lib/data/projects';
import { Cta } from '@/components/Cta';
import { IconArrow } from '@/components/icons';
import { PrintButton } from '@/components/PrintButton';
import './resume.css';

export const metadata: Metadata = {
  title: 'Résumé',
  description: `Downloadable résumé for ${site.name}, ${site.role}: experience, technical skills and selected projects.`,
  alternates: { canonical: '/resume' },
};

const topProjects = projects.filter((p) => p.featured).slice(0, 6);

export default function ResumePage() {
  return (
    <>
      <main id="main">
        <section className="phero">
          <div className="wrap">
            <div className="phero__grid">
              <div>
                <p className="eyebrow line-mask">
                  <span>Résumé</span>
                </p>
                <h1 className="d1" style={{ marginTop: '1.2rem' }}>
                  <span className="line-mask">
                    <span>One document,</span>
                  </span>
                  <span className="line-mask">
                    <span className="it accent">the short version.</span>
                  </span>
                </h1>
              </div>
              <p className="lede rv rv-d2">Everything below also lives on this site in more detail. This is the version you can save, print or forward.</p>
            </div>
            <div className="cta__row rv rv-d3" style={{ justifyContent: 'flex-start', marginTop: '2rem' }}>
              <a className="btn btn--solid" href={site.resumePdf} download data-cursor="Download">
                Download PDF <IconArrow />
              </a>
              <PrintButton />
            </div>
          </div>
        </section>

        <section className="section--tight resume-stage">
          <div className="wrap">
            <div className="sheet rv">
              <header className="sheet__head">
                <h2 className="sheet__name">{site.name}</h2>
                <p className="sheet__role">{site.role}</p>
                <ul className="sheet__contact">
                  <li>
                    <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                  </li>
                  <li>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </li>
                  <li>
                    <a href={site.github} target="_blank" rel="noopener">
                      {site.github.replace('https://', '')}
                    </a>
                  </li>
                  <li>
                    <a href={site.linkedin} target="_blank" rel="noopener">
                      linkedin.com/{site.linkedinHandle}
                    </a>
                  </li>
                  <li>{site.location}</li>
                </ul>
              </header>

              <div className="sheet__grid">
                <div className="sheet__main">
                  <section className="sheet__sec">
                    <h3>Profile</h3>
                    <p>{hero.intro}</p>
                  </section>

                  <section className="sheet__sec">
                    <h3>Experience</h3>
                    {timeline.map((t) => (
                      <div className="sheet__job" key={t.org}>
                        <p className="sheet__jobtitle">{t.org}</p>
                        <p className="sheet__jobrole">{t.role}</p>
                        <p className="sheet__jobdates">{t.period}</p>
                        <ul>
                          {t.points.map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>

                  <section className="sheet__sec">
                    <h3>Selected projects</h3>
                    {topProjects.map((p) => {
                      const live = p.links.find((l) => l.kind === 'live');
                      return (
                        <div className="sheet__proj" key={p.slug}>
                          <span className="sheet__pname">
                            {p.title}
                            <span className="sheet__ptag">{p.tag}</span>
                          </span>
                          <p className="sheet__pdesc">{p.summary}</p>
                          {live && (
                            <a className="sheet__plink" href={live.href} target="_blank" rel="noopener">
                              {live.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </a>
                          )}
                        </div>
                      );
                    })}
                    <p className="sheet__footnote">
                      Complete project archive at {site.url.replace('https://', '')} — {projects.length} projects in total.
                    </p>
                  </section>
                </div>

                <aside className="sheet__rail">
                  <section className="sheet__sec">
                    <h3>Highlights</h3>
                    {stats.slice(0, 2).map((s) => (
                      <div className="sheet__stat" key={s.label}>
                        <b>
                          {s.value}
                          {s.suffix}
                        </b>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </section>

                  <section className="sheet__sec">
                    <h3>Technical skills</h3>
                    {stack.map((g) => (
                      <div className="sheet__skill" key={g.group}>
                        <h4>{g.group}</h4>
                        <p>{g.items.join(', ')}</p>
                      </div>
                    ))}
                  </section>

                  <section className="sheet__sec">
                    <h3>Languages</h3>
                    <p>English, Hindi, Gujarati</p>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Cta />
    </>
  );
}
