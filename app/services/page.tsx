import type { Metadata } from 'next';
import { services, faqs } from '@/lib/data/site';
import { FaqList } from '@/components/Faq';
import { Cta } from '@/components/Cta';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Data and fraud analytics, automation and internal tools, websites that sell, and Android field apps. What each engagement includes, and how it is priced.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <main id="main">
        <section className="phero">
          <div className="wrap">
            <div className="phero__grid">
              <div>
                <p className="eyebrow line-mask">
                  <span>Services</span>
                </p>
                <h1 className="d1" style={{ marginTop: '1.2rem' }}>
                  <span className="line-mask">
                    <span>Software that</span>
                  </span>
                  <span className="line-mask">
                    <span className="it accent">pays for itself.</span>
                  </span>
                </h1>
              </div>
              <p className="lede rv rv-d2">
                Four kinds of work. Each one scoped in writing, priced fixed, handed over with the source and an admin surface so you are never locked to
                me.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="steps">
              {services.map((s) => (
                <article className="step rv" key={s.n}>
                  <div className="step__n">{s.n}</div>
                  <div>
                    <h2 className="step__t">{s.title}</h2>
                    <p className="step__b" style={{ marginTop: '.7rem' }}>
                      {s.summary}
                    </p>
                  </div>
                  <ul className="checks">
                    {s.points.map((pt) => (
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
                <p className="eyebrow rv">Engagement</p>
                <h2 className="d2 rv rv-d1" style={{ marginTop: '1.1rem' }}>
                  How it runs.
                </h2>
              </div>
              <p className="lede rv rv-d2">No retainers you cannot leave, no invoices you did not expect.</p>
            </div>
            <div className="pcards rv">
              <div className="pcard">
                <h3>Fixed scope, fixed price</h3>
                <p>You get a written scope and a number before anything starts. If the scope changes, the number changes in writing first.</p>
              </div>
              <div className="pcard">
                <h3>Milestone payments</h3>
                <p>Typically an advance, a payment at a working build, and the balance at handover. No large sum sitting against nothing.</p>
              </div>
              <div className="pcard">
                <h3>Full handover</h3>
                <p>Source code, deployment in your name, credentials, documentation and an admin panel. Yours to take anywhere.</p>
              </div>
              <div className="pcard">
                <h3>Support after launch</h3>
                <p>Thirty days of fixes included on every build. Longer arrangements available, monthly and cancellable.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow rv">Questions</p>
                <h2 className="d2 rv rv-d1" style={{ marginTop: '1.1rem' }}>
                  Answered straight.
                </h2>
              </div>
            </div>
            <FaqList items={faqs} idPrefix="faq" />
          </div>
        </section>
      </main>
      <Cta />
    </>
  );
}
