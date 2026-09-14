'use client';

import { useState, type FormEvent } from 'react';
import { site } from '@/lib/data/site';

interface FormState {
  name: string;
  org: string;
  email: string;
  kind: string;
  budget: string;
  message: string;
}

const initial: FormState = {
  name: '',
  org: '',
  email: '',
  kind: 'Website',
  budget: 'Not sure yet',
  message: '',
};

function compose(f: FormState) {
  const lines = [
    `Name: ${f.name}`,
    f.org ? `Company: ${f.org}` : '',
    f.email ? `Email: ${f.email}` : '',
    f.kind ? `Project type: ${f.kind}` : '',
    f.budget ? `Budget: ${f.budget}` : '',
    '',
    f.message,
  ].filter(Boolean);
  return { subject: `Project enquiry${f.name ? ' — ' + f.name : ''}`, body: lines.join('\n') };
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState('no backend — this opens your email app or WhatsApp with the message already written.');

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const validate = () => {
    if (!form.name || !form.message) {
      setStatus('Please add your name and a short description of the project.');
      return false;
    }
    return true;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const { subject, body } = compose(form);
    setStatus('Opening your email app…');
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onWhatsApp = () => {
    if (!validate()) return;
    const { body } = compose(form);
    setStatus('Opening WhatsApp…');
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
  };

  return (
    <div className="term rv">
      <div className="term__bar">
        <span className="term__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="term__title">compose.sh — chirag@portfolio</span>
      </div>
      <form className="term__body" onSubmit={onSubmit} noValidate>
        <p className="term__line">
          <span className="term__prompt">$</span> new-brief <span className="term__flag">--to=chirag</span>
        </p>

        <div className="term__field">
          <label htmlFor="f-name">
            <span className="term__key">name</span>
            <span className="term__op">=</span>
          </label>
          <input id="f-name" name="name" type="text" autoComplete="name" required placeholder='"Your name"' {...field('name')} />
        </div>

        <div className="term__row">
          <div className="term__field">
            <label htmlFor="f-org">
              <span className="term__key">company</span>
              <span className="term__op">=</span>
            </label>
            <input id="f-org" name="org" type="text" autoComplete="organization" placeholder='"optional"' {...field('org')} />
          </div>
          <div className="term__field">
            <label htmlFor="f-email">
              <span className="term__key">email</span>
              <span className="term__op">=</span>
            </label>
            <input id="f-email" name="email" type="email" autoComplete="email" placeholder='"you@company.com"' {...field('email')} />
          </div>
        </div>

        <div className="term__row">
          <div className="term__field">
            <label htmlFor="f-kind">
              <span className="term__key">type</span>
              <span className="term__op">=</span>
            </label>
            <select id="f-kind" name="kind" {...field('kind')}>
              <option>Website</option>
              <option>Web platform with admin</option>
              <option>Data or analytics tool</option>
              <option>Automation</option>
              <option>Android app</option>
              <option>Something else</option>
            </select>
          </div>
          <div className="term__field">
            <label htmlFor="f-budget">
              <span className="term__key">budget</span>
              <span className="term__op">=</span>
            </label>
            <select id="f-budget" name="budget" {...field('budget')}>
              <option>Not sure yet</option>
              <option>Under ₹50,000</option>
              <option>₹50,000 – ₹1,50,000</option>
              <option>₹1,50,000 – ₹5,00,000</option>
              <option>Above ₹5,00,000</option>
            </select>
          </div>
        </div>

        <div className="term__field">
          <label htmlFor="f-msg">
            <span className="term__key">brief</span>
            <span className="term__op">=</span>
          </label>
          <textarea
            id="f-msg"
            name="message"
            required
            placeholder='"What the software has to do, who will use it, and when you need it."'
            {...field('message')}
          />
        </div>

        <div className="term__actions">
          <button className="term__run" type="submit">
            <span className="term__prompt">$</span> send <span className="term__flag">--via=email</span>
          </button>
          <button className="term__run term__run--ghost" type="button" onClick={onWhatsApp}>
            <span className="term__prompt">$</span> send <span className="term__flag">--via=whatsapp</span>
          </button>
        </div>
        <p className="term__out">{status}</p>
      </form>
    </div>
  );
}
