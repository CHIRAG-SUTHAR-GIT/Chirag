import type { Metadata } from 'next';
import { site, faqs } from '@/lib/data/site';
import { ContactForm } from '@/components/ContactForm';
import { WhoamiCard } from '@/components/WhoamiCard';
import { FaqList } from '@/components/Faq';
import { IconInfo } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Start a project with Chirag Suthar. Email ${site.email}, call ${site.phone}, or send the brief straight to WhatsApp.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main id="main">
      <section className="phero">
        <div className="wrap">
          <div className="phero__grid">
            <div>
              <p className="eyebrow line-mask">
                <span>Contact</span>
              </p>
              <h1 className="d1" style={{ marginTop: '1.2rem' }}>
                <span className="line-mask">
                  <span>Tell me what</span>
                </span>
                <span className="line-mask">
                  <span>
                    it has to <span className="it accent">do.</span>
                  </span>
                </span>
              </h1>
            </div>
            <p className="lede rv rv-d2">
              A sentence about the problem is enough to start. I reply to everything within a day, and I will tell you honestly if the project is not a
              fit for me.
            </p>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap two-col">
          <ContactForm />

          <div className="rv rv-d1" style={{ display: 'grid', gap: '1.5rem', alignContent: 'start' }}>
            <WhoamiCard />
            <div className="note">
              <IconInfo />
              <span>Based in {site.location}, working with clients anywhere. Comfortable in English, Hindi and Gujarati.</span>
            </div>
            <div>
              <p className="eyebrow">Before you write</p>
              <ul className="checks" style={{ marginTop: '1rem' }}>
                <li>What the software has to do, in one or two sentences.</li>
                <li>Who will use it, and roughly how many of them.</li>
                <li>Anything that already exists — a site, a spreadsheet, an app.</li>
                <li>When you need it live, and whether that date is fixed.</li>
              </ul>
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
          <FaqList items={faqs} idPrefix="cfaq" />
        </div>
      </section>
    </main>
  );
}
