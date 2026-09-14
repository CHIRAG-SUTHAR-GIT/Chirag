import type { Metadata } from 'next';
import { projects } from '@/lib/data/projects';
import { WorkArchive } from '@/components/WorkArchive';
import { Cta } from '@/components/Cta';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Fifteen projects: fraud analysis platforms, automation bots, investigation tooling, client websites, quotation engines and an Android app in daily commercial use.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <>
      <main id="main">
        <section className="phero">
          <div className="wrap">
            <div className="phero__grid">
              <div>
                <p className="eyebrow line-mask">
                  <span>Archive</span>
                </p>
                <h1 className="d1" style={{ marginTop: '1.2rem' }}>
                  <span className="line-mask">
                    <span>The whole</span>
                  </span>
                  <span className="line-mask">
                    <span className="it accent">shelf.</span>
                  </span>
                </h1>
              </div>
              <p className="lede rv rv-d2">
                Everything worth showing, cyber and client work together. <span>{String(projects.length).padStart(2, '0')}</span> projects listed. On a
                desktop, hover a row to preview it.
              </p>
            </div>
          </div>
        </section>

        <section className="section--tight">
          <div className="wrap">
            <WorkArchive projects={projects} />
          </div>
        </section>
      </main>
      <Cta />
    </>
  );
}
