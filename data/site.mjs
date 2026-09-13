/**
 * Global site content. Everything the generator needs that is not a project.
 * Edit here, then run `npm run build` (or `node tools/build.mjs`).
 */

export const site = {
  url: 'https://chirag-suthar-git.github.io/Chirag',
  name: 'Chirag Suthar',
  role: 'Python & Full-Stack Developer',
  tagline: 'Data systems, automation and product engineering',
  location: 'Gujarat, India',
  locale: 'en_IN',
  themeColor: '#06070a',
  description:
    'Chirag Suthar builds forensic-grade data and automation systems for cyber crime investigation, and high-end websites, dashboards and mobile apps for businesses across India.',
  email: 'thechirag63@gmail.com',
  phone: '+91 93160 43563',
  phoneHref: '+919316043563',
  whatsapp: '919316043563',
  github: 'https://github.com/CHIRAG-SUTHAR-GIT',
  githubHandle: 'CHIRAG-SUTHAR-GIT',
  linkedin: 'https://www.linkedin.com/in/ch1rag',
  linkedinHandle: 'in/ch1rag',
  availability: 'Available for freelance and contract work',
};

export const nav = [
  { label: 'Work', href: 'work.html' },
  { label: 'Services', href: 'services.html' },
  { label: 'About', href: 'about.html' },
  { label: 'Contact', href: 'contact.html' },
];

export const hero = {
  eyebrow: 'Python · Data · Web · Mobile',
  lines: [
    'I build the software',
    'that traces stolen money',
    'and the products',
    'that win clients.',
  ],
  intro:
    'Python developer at the Cyber Centre of Excellence, Gujarat State. By day I build the analysis and automation tools investigating officers use to unpick large-scale financial fraud. The rest of the time I design and ship websites, dashboards and mobile apps for businesses that need software that actually earns its keep.',
};

export const stats = [
  { value: 75, suffix: '+', label: 'internal applications built for cyber crime analysis and automation' },
  { value: 33, suffix: '', label: 'districts of Gujarat covered by the district-wise matching engine' },
  { value: 12, suffix: '+', label: 'client websites, dashboards and apps running in production' },
  { value: 50, suffix: '', label: 'Excel or CSV files ingested in a single run, millions of rows deep' },
];

export const marquee = [
  'Python', 'pandas', 'Streamlit', 'FastAPI', 'Flask', 'Selenium', 'MySQL',
  'Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind', 'Prisma',
  'Java', 'Android', 'Power BI', 'ReportLab', 'RapidFuzz', 'OpenPyXL', 'Git',
];

export const services = [
  {
    n: '01',
    title: 'Data & fraud analytics',
    summary:
      'Pipelines that swallow messy, multi-source financial data and return something an investigator can act on the same afternoon.',
    points: [
      'Ingestion of 1–50 Excel/CSV files per run, 500 MB per file, millions of rows',
      'Fuzzy column detection so no two banks’ formats need the same header',
      'Validation, de-duplication, account normalisation and risk scoring',
      'Money-trail reconstruction across six or more layers of transfer',
      'Exports to Excel, CSV, PDF and audit logs, plus batched MySQL writes with SHA-256 checks',
    ],
  },
  {
    n: '02',
    title: 'Automation & internal tools',
    summary:
      'The repetitive work that quietly eats thousands of hours — filed, cross-checked and reported by a bot that never gets bored.',
    points: [
      'Browser and portal automation with Selenium, scheduled and verifiable',
      'Bulk retrieval, filing, cross-checking and status updates',
      'Report generation in Excel, CSV, PDF and DOCX from raw case data',
      'Role-based internal dashboards with approval flows and audit trails',
      'Attendance, work-log and staff systems with real-time status over WebSockets',
    ],
  },
  {
    n: '03',
    title: 'Websites that sell',
    summary:
      'Design-led marketing sites and product pages built for conversion, speed and search — not for a template gallery.',
    points: [
      'Next.js, React and TypeScript, or dependency-free static builds where that is faster',
      'Live pricing and quotation engines with instant PDF output',
      'Admin panels and CRMs so the client can run the site without calling me',
      'WhatsApp-first enquiry flows tuned for Indian buyers',
      'Core Web Vitals, structured data, sitemaps, PWA and image pipelines as standard',
    ],
  },
  {
    n: '04',
    title: 'Mobile & field apps',
    summary:
      'Android software for people who work standing up: delivery counts, payments and daily accounts that survive a lost phone.',
    points: [
      'Native Android in Java, built for low-end devices and patchy networks',
      'Per-business logins with server-side records, nothing lost on reinstall',
      'Automatic payment reminders and day-to-day account keeping',
      'In daily commercial use by tiffin providers in Gandhinagar',
    ],
  },
];

export const process = [
  {
    n: '01',
    title: 'Understand the actual job',
    body:
      'I sit with the data or the business before I write a line. Most briefs describe a feature; the real requirement is usually one step behind it. On the cyber side that means watching how an officer actually works a case. On client work it means finding out what a lead is worth.',
  },
  {
    n: '02',
    title: 'Prove the hard part first',
    body:
      'Whatever is most likely to fail gets built first — the parser against the ugliest file, the pricing formula against real quotations. If the difficult 20 per cent works, the rest is delivery.',
  },
  {
    n: '03',
    title: 'Build it so it can be handed over',
    body:
      'Modular code, sensible names, defensive validation, and an admin panel or a runbook so the software outlives my involvement. Tests where the cost of being wrong is high.',
  },
  {
    n: '04',
    title: 'Ship, watch, sharpen',
    body:
      'Deploy, sit with the first real users, and fix what the first week exposes. Every tool I have built for the cyber cell has been reshaped by what officers did with it in the first fortnight.',
  },
];

export const stack = [
  {
    group: 'Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL', 'HTML', 'CSS'],
  },
  {
    group: 'Data & analysis',
    items: ['pandas', 'NumPy', 'RapidFuzz', 'OpenPyXL', 'XlsxWriter', 'Matplotlib', 'Plotly', 'Altair', 'NetworkX', 'Power BI', 'Jupyter'],
  },
  {
    group: 'Backend & apps',
    items: ['Streamlit', 'Flask', 'FastAPI', 'SQLAlchemy', 'Socket.IO', 'MySQL', 'PostgreSQL', 'Prisma', 'Node.js', 'ReportLab', 'python-docx'],
  },
  {
    group: 'Frontend',
    items: ['Next.js', 'React', 'Tailwind CSS', 'GSAP', 'Lenis', 'Framer Motion', 'Recharts', 'Canvas & WebGL'],
  },
  {
    group: 'Automation & ops',
    items: ['Selenium', 'Scheduled jobs', 'PDF & Excel reporting', 'Git', 'Vercel', 'Hostinger', 'GitHub Actions', 'pytest', 'Hypothesis'],
  },
  {
    group: 'Mobile',
    items: ['Android (Java)', 'Server-backed sync', 'Play-ready builds'],
  },
];

export const principles = [
  {
    title: 'Correctness before polish',
    body:
      'When a report decides whether an officer freezes an account or a client quotes a price, a rounding error is not a cosmetic bug. Validation, checksums and reconciliation come first.',
  },
  {
    title: 'Data stays where it belongs',
    body:
      'Case work is processed in memory with session timeouts, credentials stay out of the repository, and nothing sensitive is parked on a server that does not need it.',
  },
  {
    title: 'Speed is a feature',
    body:
      'Vectorised pandas over loops, batched writes over row-by-row, WebP and lazy loading over hero videos. Software that makes people wait quietly stops being used.',
  },
  {
    title: 'Built to be handed over',
    body:
      'Every client system ships with an admin surface. Every internal tool ships with a document explaining what it does at three in the morning.',
  },
];

export const timeline = [
  {
    period: 'December 2025 — present',
    org: 'Cyber Centre of Excellence, Gujarat State',
    role: 'Data Analytics & Software Development',
    points: [
      'Built 75+ internal applications for cyber crime data analysis, reporting and workflow automation, in use by officers across Gujarat.',
      'Supported investigating officers in tracing large-scale financial fraud and in live fund-recovery work.',
      'Automated recurring NCRP and Samanvaya portal operations that previously consumed thousands of hours of manual entry.',
      'Wrote pipelines handling Excel and CSV files running into millions of rows, using vectorised pandas, fuzzy column detection and batched MySQL writes with checksum verification.',
      'Replaced manual compilation of investigation reports and case summaries with automatic Excel, CSV and PDF generation.',
    ],
  },
  {
    period: 'Ongoing, alongside',
    org: 'Independent client work',
    role: 'Design & Development',
    points: [
      'Websites, CRMs, quotation engines and Android apps for studios, manufacturers, travel agencies and food businesses.',
      'End-to-end delivery: positioning, design, build, deployment, and the admin tooling the client runs it with.',
      'Clients across Ahmedabad, Gandhinagar, Palanpur and beyond.',
    ],
  },
];

export const faqs = [
  {
    q: 'What does a project usually cost?',
    a: 'It depends entirely on scope, and I would rather quote honestly than publish a number that means nothing. A focused marketing site, a data tool, a full platform with an admin panel and a mobile app are three different conversations. Tell me what you need and you will get a written scope and a fixed price.',
  },
  {
    q: 'How long does it take?',
    a: 'A single-purpose website is typically two to three weeks. A site with a quotation engine, admin panel and content management is four to six. Data and automation systems depend on how clean the source data is — the first thing I do is look at a real file.',
  },
  {
    q: 'Do you work with existing code?',
    a: 'Yes. Rescues, rebuilds and extensions of an existing site or internal tool are a large part of what I do. I will tell you plainly whether it is cheaper to fix or to replace.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do. Source is handed over on delivery, deployed on infrastructure in your name, with documentation and an admin surface so you are never locked to me.',
  },
  {
    q: 'Can you work with sensitive data?',
    a: 'It is most of my day job. In-memory processing, session timeouts, checksum verification, credentials kept out of the repository, and no case data retained on a server that does not need it.',
  },
];
