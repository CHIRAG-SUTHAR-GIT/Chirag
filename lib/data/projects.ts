/**
 * Project archive.
 *
 * Every screenshot in `public/assets/img/work/` was captured from the real
 * thing: the client sites and the Next.js build were served locally from
 * their own source and photographed at 3200x2000, the Streamlit tools were
 * run locally and photographed the same way. Nothing here is a mockup.
 */

export type ProjectGroup = 'cyber' | 'client';
export type LinkKind = 'live' | 'code';
export type DiagramKind = 'flow' | 'ledger' | 'automation' | 'shield' | 'roster' | 'pivot' | 'mobile' | 'craft';

export interface ProjectLink {
  label: string;
  href: string;
  kind: LinkKind;
}

export interface ProjectImage {
  src: string;
  alt: string;
  w: number;
  h: number;
  caption?: string;
  long?: boolean;
}

export interface ProjectCover {
  src: string | null;
  alt: string;
  w: number;
  h: number;
  chrome: 'browser' | 'diagram';
  diagram?: DiagramKind;
}

export interface ProjectFeature {
  title: string;
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  group: ProjectGroup;
  category: string;
  year: string;
  role: string;
  tag: string;
  featured: boolean;
  accent: string;
  summary: string;
  metrics: { value: string; label: string }[];
  cover: ProjectCover;
  mobile?: ProjectImage;
  gallery: ProjectImage[];
  links: ProjectLink[];
  confidential?: string;
  stack: string[];
  problem: string;
  approach: string;
  features: ProjectFeature[];
  outcome: string[];
}

const D = { w: 1600, h: 1000 };
const M = { w: 620, h: 1342 };

export const projects: Project[] = [
  /* ------------------------------------------------------------------ *
   * CYBER CRIME & DATA
   * ------------------------------------------------------------------ */
  {
    slug: 'datalens-fraud-analysis',
    title: 'DataLens',
    subtitle: 'Fraud analysis & reporting platform for the cyber cell',
    client: 'Cyber Centre of Excellence, Gujarat State',
    group: 'cyber',
    category: 'Data platform',
    year: '2026',
    role: 'Sole developer — architecture, data engineering, UI',
    tag: 'Python · Streamlit · pandas · MySQL',
    featured: true,
    accent: '#ffb020',
    summary:
      'A 53-module analysis suite that turns fifty raw bank statements into a ranked, court-ready picture of where the money went. Built for investigating officers, in daily use across Gujarat.',
    metrics: [
      { value: '53', label: 'analysis modules' },
      { value: '36k+', label: 'lines of Python' },
      { value: '50', label: 'files per run' },
      { value: '33', label: 'districts matched' },
    ],
    cover: { src: 'detalenc', alt: 'DataLens for Cyber Cell — the upload and module sidebar of the fraud analysis tool', ...D, chrome: 'browser', diagram: 'pivot' },
    gallery: [{ src: 'detalenc', alt: 'The DataLens upload screen with the module sidebar', caption: 'The working surface: every analysis module one click away, and an ingest that takes fifty files at a time.', ...D }],
    links: [
      { label: 'Live app', href: 'https://dailyreport-v2.streamlit.app/', kind: 'live' },
      { label: 'Source', href: 'https://github.com/CHIRAG-SUTHAR-GIT/daily_report', kind: 'code' },
    ],
    stack: ['Python', 'Streamlit', 'pandas', 'NumPy', 'RapidFuzz', 'OpenPyXL', 'ReportLab', 'python-docx', 'MySQL', 'pytest', 'Hypothesis'],
    problem:
      'A cyber fraud complaint arrives as a pile of spreadsheets: one per bank, each with its own column names, its own idea of what a date looks like, and tens of thousands of rows. An officer needs to know which account took the money, how much of it is disputed, which acknowledgement numbers attach to it, and which district the suspect sits in. Doing that by hand takes days, and a single mis-typed account number can lose a case.',
    approach:
      'DataLens ingests up to fifty Excel or CSV files in one run and resolves each file’s columns by fuzzy match rather than by fixed template, so a new bank format costs nobody an afternoon. Records are cleaned, validated and normalised, then aggregated by the fraudster’s account number with every acknowledgement number, disputed amount and a computed risk score attached. Around that core sit fifty-odd purpose-built modules — district splitting, call-notice merging, transaction matching, pivot builders, an e-FIR report writer, a CSV repair tool — each one built because an officer asked for it.',
    features: [
      { title: 'Fuzzy column detection', body: 'RapidFuzz resolves headers at an 80 per cent confidence threshold across the many ways a bank writes “account number”, with confidence scores shown and a manual override for anything ambiguous.' },
      { title: 'Vectorised processing', body: 'Cleaning, currency parsing, account normalisation and validation run as vectorised pandas operations, so files running into millions of rows finish in seconds rather than minutes.' },
      { title: 'Aggregation and risk scoring', body: 'Every transaction is grouped by fraudster account with distinct ACK collection, totals, disputed totals and a risk score derived from transaction count and value.' },
      { title: 'District-wise matching', body: 'Victim and suspect records are matched across all 33 districts of Gujarat, with a dedicated split engine for daily district reports.' },
      { title: 'Reporting in four formats', body: 'Excel, CSV, PDF and audit-log exports, with coloured headers and layouts built to match what the department already files.' },
      { title: 'Verified database writes', body: 'Batched MySQL imports with SHA-256 integrity checks, plus a built-in database viewer for reconciling what actually landed.' },
      { title: 'Data that does not linger', body: 'All processing happens in memory behind a session timeout. No case data is written to the server.' },
    ],
    outcome: [
      'Consolidation work that took days of manual spreadsheet handling is completed in a single pass.',
      'Used by investigating officers across Gujarat as the standard tool for daily fraud reporting.',
      'Every derived report — district splits, suspect rankings, e-FIR summaries — comes from one validated pipeline instead of five hand-made copies.',
    ],
  },

  {
    slug: 'account-summary-control-room',
    title: 'Account Summary Control Room',
    subtitle: 'Layered money-flow analysis and audit reporting',
    client: 'Cyber Centre of Excellence, Gujarat State',
    group: 'cyber',
    category: 'Data platform',
    year: '2026',
    role: 'Sole developer',
    tag: 'Python · Flask · pandas · Excel automation',
    featured: true,
    accent: '#5eead4',
    summary:
      'Follows a disputed rupee through six or more layers of accounts and draws the tree: who received it, where it was cashed out, what is frozen and what is still moving.',
    metrics: [
      { value: '6+', label: 'transfer layers traced' },
      { value: '18k+', label: 'lines of Python' },
      { value: '4', label: 'cash-out channels analysed' },
    ],
    cover: { src: null, alt: '', ...D, chrome: 'diagram', diagram: 'flow' },
    gallery: [],
    links: [{ label: 'Source', href: 'https://github.com/CHIRAG-SUTHAR-GIT/ACCOUNT-SUMMARY-CONTROL-ROOM', kind: 'code' }],
    confidential: 'Runs against live case data, so there is no public deployment. Source is on GitHub; a walkthrough can be arranged.',
    stack: ['Python', 'Flask', 'pandas', 'OpenPyXL', 'Jinja', 'JavaScript', 'pytest'],
    problem:
      'Fraud money does not sit still. It lands in a mule account, splits, moves again, and three layers later it is being pulled out of an ATM in another state. Officers were reconstructing that chain by hand across dozens of bank statements, and a partial hold on one account in layer four is easy to miss when you are looking at rows in a spreadsheet.',
    approach:
      'The Control Room reads the raw statements and builds a hierarchical model of the case: layer one through layer six and beyond, account by account, with credited and debited totals rolled up per bank. That model is rendered as an interactive tree — victim and entry accounts in red, intermediates in blue, cash-out points in orange, frozen accounts in grey — with per-transaction status showing pending, partial or complete. The same model drives the Excel account summaries and a downloadable HTML flow diagram that can be attached to a case file.',
    features: [
      { title: 'Hierarchical layer tracking', body: 'Multi-layer transaction tracking with account-wise credit and debit summaries, bank-wise grouping, and expandable trees with live filtering and search.' },
      { title: 'Money-flow visualisation', body: 'Colour-coded interactive nodes for victim, intermediate, cash-out and frozen accounts, each carrying its own transaction detail, exportable as a standalone HTML diagram.' },
      { title: 'Cash-out channel analysis', body: 'ATM withdrawals with location, cheque withdrawals, POS transactions with merchant detail, holds and frozen accounts, plus grouping of sub-₹500 micro-transactions that would otherwise flood the view.' },
      { title: 'Batch processing', body: 'Overnight batch runs generate account summaries for a whole caseload at once, with a dashboard to watch progress.' },
      { title: 'Audit trail', body: 'Duplicate detection with logging, detailed audit logs, and reconciliation counts so a number in a report can always be traced back to a source row.' },
    ],
    outcome: [
      'A case-wide money trail that used to be assembled by hand is produced from the raw statements.',
      'Hold and recovery status is visible per bank and per layer, which is exactly what a freeze request needs.',
      'Flow diagrams are exportable and attachable, so the analysis travels with the case file.',
    ],
  },

  {
    slug: 'transaction-tracker',
    title: 'Transaction Tracker System',
    subtitle: 'Case-level money trail from raw NCRP data',
    client: 'Cyber Centre of Excellence, Gujarat State',
    group: 'cyber',
    category: 'Investigation tooling',
    year: '2026',
    role: 'Sole developer',
    tag: 'Python · pandas · transaction analysis',
    featured: false,
    accent: '#ffb020',
    summary:
      'Takes raw NCRP portal data for a single complaint and returns the complete trail: every account, every layer, and each bank’s position on hold, partial credit and pending amounts.',
    metrics: [
      { value: '1', label: 'case in, full trail out' },
      { value: '3', label: 'bank positions reconciled' },
    ],
    cover: { src: null, alt: '', ...D, chrome: 'diagram', diagram: 'ledger' },
    gallery: [],
    links: [],
    confidential: 'Operates on sensitive case data. No public demo or source.',
    stack: ['Python', 'pandas', 'OpenPyXL'],
    problem:
      'The NCRP export for a complaint is a flat list of transactions. What an officer needs is the opposite: a rupee-by-rupee account of where a disputed amount travelled, and a straight answer on how much each bank has put on hold.',
    approach:
      'The tracker walks the disputed amount through every account and layer it has passed through, reconciling case-wise totals against per-bank positions — held, partially credited, still pending. It became the working reference for transaction analysis on fraud complaints because it answers the one question a freeze request has to answer.',
    features: [
      { title: 'Rupee-level tracing', body: 'The disputed amount is followed through each account and layer rather than summarised at the top level.' },
      { title: 'Bank position reconciliation', body: 'Per-bank breakdown of amounts on hold, partially credited and pending, reconciled against the case total.' },
      { title: 'Built for daily use', body: 'Designed around the way an officer actually works a complaint, not around the shape of the export file.' },
    ],
    outcome: [
      'Adopted as the standard working reference for transaction analysis on fraud complaints.',
      'Turns an NCRP export into a document that supports action rather than more spreadsheet work.',
    ],
  },

  {
    slug: 'ncrp-samanvaya-automation',
    title: 'NCRP & Samanvaya Automation',
    subtitle: 'Portal bots for the work nobody should do by hand',
    client: 'Cyber Centre of Excellence, Gujarat State',
    group: 'cyber',
    category: 'Automation',
    year: '2026',
    role: 'Sole developer',
    tag: 'Python · Selenium · scheduled jobs',
    featured: true,
    accent: '#a78bfa',
    summary:
      'A set of bots that perform retrieval, filing, cross-checking and bulk updates on national cyber crime portals end to end — removing thousands of hours of manual entry a year.',
    metrics: [
      { value: '1000s', label: 'of manual hours removed' },
      { value: '100%', label: 'of runs logged and verifiable' },
    ],
    cover: { src: null, alt: '', ...D, chrome: 'diagram', diagram: 'automation' },
    gallery: [],
    links: [],
    confidential: 'Interacts with restricted government systems. Neither a demo nor source can be shared.',
    stack: ['Python', 'Selenium', 'pandas', 'Scheduled jobs'],
    problem:
      'Portal work is the tax on cyber crime investigation. Retrieval, filing, cross-checking and bulk status updates were done by hand, one record at a time, by people whose time is better spent on the case.',
    approach:
      'Each recurring operation was scripted end to end with Selenium, wrapped in scheduling, and instrumented so that every run is logged and checkable. Consistency turned out to matter as much as speed: a bot fills the same field the same way every time, which makes downstream analysis trustworthy.',
    features: [
      { title: 'End-to-end operations', body: 'Retrieval, filing, cross-checking and bulk updates run start to finish without supervision.' },
      { title: 'Scheduled and repeatable', body: 'Jobs run on a schedule and produce the same output every time, so downstream reports can rely on them.' },
      { title: 'Verifiable output', body: 'Every run is logged, so the result can be audited rather than trusted.' },
    ],
    outcome: [
      'One of the largest recurring time costs in the workflow was removed outright.',
      'Portal data entered by automation is consistent, which improved the quality of every report built on top of it.',
    ],
  },

  {
    slug: 'probodh',
    title: 'Probodh',
    subtitle: 'Public fraud-account check and awareness service',
    client: 'Cyber Centre of Excellence, Gujarat State',
    group: 'cyber',
    category: 'Public service',
    year: '2026',
    role: 'Core modules',
    tag: 'Python · fraud database matching',
    featured: false,
    accent: '#5eead4',
    summary:
      'Check an account against known fraud records before you send money. If there is a match, you get warned. If you have already been defrauded, it walks you into filing a complaint.',
    metrics: [
      { value: '5.6k', label: 'lines in the core service' },
      { value: '1', label: 'check before the money leaves' },
    ],
    cover: { src: null, alt: '', ...D, chrome: 'diagram', diagram: 'shield' },
    gallery: [],
    links: [{ label: 'Source', href: 'https://github.com/CHIRAG-SUTHAR-GIT/prabodh', kind: 'code' }],
    confidential: 'Deployment is restricted, so the live link cannot be shared publicly.',
    stack: ['Python', 'Streamlit', 'pandas', 'MySQL'],
    problem:
      'Almost every fraud complaint arrives after the transfer. The account that received the money is very often already known to police from earlier complaints — but the person about to send it has no way to ask.',
    approach:
      'Probodh puts that question in the public’s hands: enter an account, get an answer against the known fraud records, and get a plain-language warning if it matches. If the answer comes too late, the same service routes the person into the complaint process instead of leaving them to find it. I built the core modules the service runs on.',
    features: [
      { title: 'Pre-transfer account check', body: 'A single lookup against known fraud records before money moves.' },
      { title: 'Clear warnings', body: 'Plain-language results rather than a database dump, written for someone who is about to be defrauded.' },
      { title: 'Route into complaint filing', body: 'Users who have already lost money are taken into the complaint process rather than left at a dead end.' },
    ],
    outcome: [
      'Moves one check from after the loss to before it.',
      'Turns the department’s existing fraud records into a preventive service rather than an archive.',
    ],
  },

  {
    slug: 'outsource-employee-management',
    title: 'Outsource Employee Management',
    subtitle: 'Attendance, work logs and staff records for the cyber cell',
    client: 'Cyber Centre of Excellence, Gujarat State',
    group: 'cyber',
    category: 'Internal tool',
    year: '2026',
    role: 'Sole developer',
    tag: 'Flask · SQLAlchemy · Socket.IO · MySQL',
    featured: false,
    accent: '#a78bfa',
    summary:
      'Attendance that records itself. Login and logout create and close the entry, shifts classify themselves, and supervisors see who is on duty in real time.',
    metrics: [
      { value: '3', label: 'access roles' },
      { value: '20k+', label: 'lines across the stack' },
      { value: '5', label: 'shift classifications' },
    ],
    cover: { src: null, alt: '', ...D, chrome: 'diagram', diagram: 'roster' },
    gallery: [],
    links: [
      { label: 'Live app', href: 'https://outsourcelog.streamlit.app/', kind: 'live' },
      { label: 'Source', href: 'https://github.com/CHIRAG-SUTHAR-GIT/outsource_attendance', kind: 'code' },
    ],
    stack: ['Python', 'Flask', 'SQLAlchemy', 'Flask-SocketIO', 'MySQL', 'bcrypt', 'Alembic', 'OpenPyXL', 'pytest', 'Hypothesis', 'Streamlit'],
    problem:
      'Attendance for outsourced staff was a register: filled in later, argued about at month end, and impossible to reconcile against who was actually at a desk during a night shift.',
    approach:
      'Attendance became a by-product of working. Logging in opens an entry, logging out closes it, and the shift code — morning, general, evening, night or other — is derived rather than declared. Observers and admins watch live status over WebSockets, approve entries, and can force-terminate a stale session. Month-end is an Excel export instead of an argument, and every critical action is written to an audit log. A lighter Streamlit deployment covers the day-to-day view.',
    features: [
      { title: 'Automatic entries', body: 'Attendance is created on login and completed on logout, with no manual filling.' },
      { title: 'Shift classification', body: 'Morning, general, evening, night and other are assigned automatically from the time of the event.' },
      { title: 'Real-time monitoring', body: 'Socket.IO pushes live status so a supervisor sees who is on duty without refreshing.' },
      { title: 'Approval workflow and force logout', body: 'Observers and admins approve entries; admins can terminate an active session that was left open.' },
      { title: 'Role-based access', body: 'Three roles — employee, observer, admin — with bcrypt-hashed credentials and Flask-Login sessions.' },
      { title: 'Reporting and audit', body: 'Monthly reports with Excel export, and an audit log covering every critical action.' },
      { title: 'Tested where it counts', body: 'Unit, integration and property-based tests with pytest and Hypothesis over the attendance logic.' },
    ],
    outcome: [
      'Month-end reconciliation became an export rather than an exercise.',
      'Live status replaced phone calls for the simple question of who is on duty.',
    ],
  },

  {
    slug: 'bank-ack-pivot',
    title: 'Bank ACK Pivot',
    subtitle: 'Acknowledgement and pending-status pivots for case reporting',
    client: 'Cyber Centre of Excellence, Gujarat State',
    group: 'cyber',
    category: 'Reporting tool',
    year: '2026',
    role: 'Sole developer',
    tag: 'Python · Streamlit · OpenPyXL',
    featured: false,
    accent: '#ffb020',
    summary:
      'Three pivot workflows — bank acknowledgement, ACK list and pending status — with saved column-mapping presets so a recurring report is a two-minute job.',
    metrics: [
      { value: '3', label: 'pivot workflows' },
      { value: '5.7k', label: 'lines of Python' },
    ],
    cover: { src: null, alt: '', ...D, chrome: 'diagram', diagram: 'pivot' },
    gallery: [],
    links: [{ label: 'Source', href: 'https://github.com/CHIRAG-SUTHAR-GIT/bank-ack-pivot', kind: 'code' }],
    stack: ['Python', 'Streamlit', 'pandas', 'OpenPyXL', 'pytest'],
    problem: 'The same three summaries were being rebuilt by hand every reporting cycle, from files whose columns never quite matched last time’s.',
    approach:
      'Each summary became a workflow with its own column-mapping preset and account-number normalisation, so the mapping is solved once and reused. Reports export straight to Excel. Generated files and local inputs are kept out of version control, because they carry transaction data.',
    features: [
      { title: 'Three pivot workflows', body: 'Bank ACK, ACK list and pending status, each with its own validated shape.' },
      { title: 'Column mapping presets', body: 'Mappings are stored and reused, so a new file with familiar columns needs no setup.' },
      { title: 'Account normalisation', body: 'Account numbers are normalised before matching, with tests covering the edge cases that used to cause silent mismatches.' },
    ],
    outcome: [
      'A recurring reporting task collapsed from an afternoon to a couple of minutes.',
      'Sensitive inputs and outputs stay off the repository by design.',
    ],
  },

  {
    slug: 'wallet-intelligence-dashboard',
    title: 'Wallet Intelligence Dashboard',
    subtitle: 'Correlating crypto exchange reports across accounts',
    client: 'Investigation tooling',
    group: 'cyber',
    category: 'Data platform',
    year: '2026',
    role: 'Sole developer',
    tag: 'Python · Streamlit · NetworkX · Altair',
    featured: false,
    accent: '#5eead4',
    summary:
      'Takes one master exchange report and any number of sub-reports, finds the counterparties they share, and reports the value that actually moved — not the value counted twice.',
    metrics: [
      { value: '7', label: 'analysis modes' },
      { value: '7', label: 'result views' },
    ],
    cover: { src: 'wallet', alt: 'Wallet Intelligence Dashboard — analysis mode selection and report upload', ...D, chrome: 'browser', diagram: 'flow' },
    gallery: [{ src: 'wallet', alt: 'The analysis type selector and dual upload panels', caption: 'Seven analysis modes, from withdrawal history to a custom sheet-and-column pick.', ...D }],
    links: [{ label: 'Source', href: 'https://github.com/CHIRAG-SUTHAR-GIT/wallet-intelligence-dashboard', kind: 'code' }],
    stack: ['Python', 'Streamlit', 'pandas', 'NumPy', 'Altair', 'NetworkX', 'XlsxWriter'],
    problem:
      'Comparing exchange reports account by account produces two kinds of wrong answer. A withdrawal in one report and the matching deposit in another are one movement of money recorded twice — sum both and every total inflates. And a plain overlap check tells you two accounts touched the same counterparty, not which direction the value went.',
    approach:
      'The dashboard resolves every column by alias, so a renamed header does not break a run, and matches counterparties per analysis mode: withdrawal, deposit, Binance Pay, attempted withdrawal, P2P, a combined deposits-and-withdrawals mode, and a custom mode where you pick the sheet and column. Transfers seen from both sides are matched on transaction ID and counted once — but the duplicate row is kept, because that pairing is the strongest evidence the two accounts are linked. Failed, cancelled and rejected rows are excluded rather than summed as settled.',
    features: [
      { title: 'De-duplication of two-sided transfers', body: 'A withdrawal and its matching deposit are one movement; matching transaction IDs are counted once and the pairing is surfaced as evidence.' },
      { title: 'Direction, not just volume', body: 'Every counterparty gets gross in, gross out and net, so a wallet that took 50k in and sent 50k out does not read as nothing.' },
      { title: 'Cluster graph', body: 'A bipartite account-to-counterparty graph finds sub-to-sub links the master account never touched.' },
      { title: 'Pattern detection', body: 'Repeated identical amounts, amounts sitting just under a round number, and two accounts hitting one counterparty within a short window.' },
      { title: 'Readable identities', body: 'Each report’s UID and email are read from its customer information sheet, so tables name people instead of filenames.' },
      { title: 'Data quality tab', body: 'What loaded, what was skipped and what each filter removed — visible rather than assumed.' },
    ],
    outcome: [
      'Totals that reflect the value that actually moved between accounts.',
      'Links between sub-accounts that a per-file review would never surface.',
    ],
  },

  /* ------------------------------------------------------------------ *
   * CLIENT WEB & MOBILE
   * ------------------------------------------------------------------ */
  {
    slug: 'radhe-design-studio',
    title: 'Radhe Design Studio',
    subtitle: 'Website, 360° studio and interiors CRM',
    client: 'Radhe Design Studio, Ahmedabad',
    group: 'client',
    category: 'Website & CRM',
    year: '2026',
    role: 'Design and development, end to end',
    tag: 'HTML · CSS · JavaScript · PHP · MySQL',
    featured: true,
    accent: '#e6c489',
    summary:
      'An architecture practice deserved more than a template. A drafting-sheet design system, an in-house 360° panorama viewer, and an admin CRM that tracks every fitting in every project through to handover.',
    metrics: [
      { value: '4', label: 'public pages, no framework' },
      { value: '360°', label: 'in-house panorama viewer' },
      { value: '0', label: 'scroll-jacking libraries' },
    ],
    cover: { src: 'radhe', alt: 'Radhe Design Studio homepage — split hero with an interior photograph and the studio wordmark', ...D, chrome: 'browser', diagram: 'craft' },
    mobile: { src: 'radhe-m', alt: 'Radhe Design Studio on a phone', ...M },
    gallery: [
      { src: 'radhe', alt: 'Radhe Design Studio homepage hero', caption: 'The split hero: photography on one side, a gold-on-black masthead on the other, with animated practice metrics beneath.', ...D },
      { src: 'radhe-projects', alt: 'The filterable project index', caption: 'Project collections filter by residential, hospitality, workplace and detail work.', ...D },
      { src: 'radhe-long', alt: 'The full Radhe Design Studio homepage, top to bottom', caption: 'The full page: services, process, metrics and the enquiry form, all reached by anchor.', w: 1200, h: 4857, long: true },
    ],
    links: [
      { label: 'Live site', href: 'https://radhedesignstudio.in/', kind: 'live' },
      { label: 'Source', href: 'https://github.com/CHIRAG-SUTHAR-GIT/radhe-design-studio', kind: 'code' },
    ],
    stack: ['HTML', 'CSS', 'Vanilla JavaScript', 'Canvas', 'PHP', 'MySQL', 'PDO'],
    problem:
      'An architecture and interiors practice sells judgement, and a stock template quietly says the opposite. The studio also had a second, unglamorous problem: every project carries hundreds of customisations and material decisions, from a single handle to a whole house, and they were being tracked in spreadsheets and memory.',
    approach:
      'The public site borrows its language from the studio’s own medium — a drafting-sheet design system with an animated orthogonal floor-plan layer and an AutoCAD-style crosshair on precision pointers. Section-aware blueprint canvases run behind ink and paper blocks, pause when off-screen, and hold a deliberate 30fps so they never fight the content. Scrolling stays native: requestAnimationFrame and IntersectionObserver do the work, no scroll-jacking library. Behind it, a 360° studio route runs a bundled panorama-to-depth engine with inertial drag, zoom, auto-rotation, fullscreen, keyboard control and optional gyroscope. The admin CRM runs the delivery side, tracking every customisation and material requirement project by project until handover.',
    features: [
      { title: 'Drafting-sheet design system', body: 'Light and dark themes built from the studio’s own drawing conventions rather than a web trend.' },
      { title: '360° studio', body: 'A Kuula-inspired route driven by a bundled panorama-to-depth engine: inertial drag and swipe, scroll and button zoom, auto-rotation, fullscreen, keyboard navigation, gyroscope, and a multi-scene thumbnail strip.' },
      { title: 'Filterable project index', body: 'Residential, hospitality, workplace and detail work, with horizontal showcases and page transitions.' },
      { title: 'Interiors CRM', body: 'An admin-only system covering every customisation and material requirement, from the smallest fitting to a complete house, tracked project-wise to handover.' },
      { title: 'Hardened enquiry endpoint', body: 'PHP handler with required-field validation, a honeypot, PDO prepared statements and email dispatch; credentials kept out of the repository.' },
      { title: 'Accessible by construction', body: 'Reduced-motion support, keyboard-visible focus states, semantic landmarks, and no horizontal overflow at any width.' },
    ],
    outcome: [
      'A practice site that reads as considered work rather than a brochure.',
      'The delivery side of the business runs inside the same system that markets it.',
      'No build step: the studio can edit pages through the file manager and nothing breaks.',
    ],
  },

  {
    slug: 'veer-aluminium',
    title: 'Veer Aluminium & Fabrication',
    subtitle: 'Cinematic site with a live quotation engine',
    client: 'Veer Aluminium & Fabrication, Palanpur',
    group: 'client',
    category: 'Web platform',
    year: '2026',
    role: 'Design and development, end to end',
    tag: 'Next.js 15 · React 19 · TypeScript · Prisma',
    featured: true,
    accent: '#f2c14e',
    summary:
      'A fabrication firm that used to quote by phone now quotes in the browser: pick product, material and dimensions, watch the price build itself, and download a GST-inclusive PDF quotation on the spot.',
    metrics: [
      { value: '<60s', label: 'from landing to a PDF quote' },
      { value: '13', label: 'services catalogued' },
      { value: '1', label: 'admin panel running the whole thing' },
    ],
    cover: { src: 'veer', alt: 'Veer Aluminium homepage — a dark cinematic hero reading Transforming Spaces With Premium Aluminium and Glass Solutions', ...D, chrome: 'browser', diagram: 'automation' },
    mobile: { src: 'veer-m', alt: 'Veer Aluminium on a phone', ...M },
    gallery: [
      { src: 'veer', alt: 'The Veer Aluminium homepage hero', caption: 'Parallax hero with slow zoom, glassmorphism cards and animated counters.', ...D },
      { src: 'veer-estimate', alt: 'The instant estimate calculator with live pricing summary', caption: 'The estimate engine: product, material, frame finish and dimensions on the left, an itemised live price and a 2.5D preview on the right.', ...D },
      { src: 'veer-projects', alt: 'The projects portfolio page', caption: 'Masonry portfolio with category filters and a before/after comparison slider.', ...D },
      { src: 'veer-estimate-long', alt: 'The full estimate calculator page', caption: 'The whole calculator, down to add-ons, GST and the PDF export.', w: 1200, h: 1709, long: true },
    ],
    links: [
      { label: 'Live site', href: 'https://veeraluminium.vercel.app/', kind: 'live' },
      { label: 'Source', href: 'https://github.com/CHIRAG-SUTHAR-GIT/VAF', kind: 'code' },
    ],
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'GSAP', 'Lenis', 'Framer Motion', 'Recharts', 'jsPDF', 'Radix UI', 'Zod'],
    problem:
      'Every enquiry started the same way: what will a sliding window in toughened glass with a black frame cost me? Answering it took a call, a site visit and a day. Buyers who wanted a number that afternoon went elsewhere, and the ones who stayed were quoted from memory.',
    approach:
      'The centrepiece is an estimate calculator that puts the firm’s own pricing in the customer’s hands. Product, aluminium grade, glass type, frame finish, dimensions and add-ons feed an itemised, GST-inclusive price that updates as you change it, next to an animated 2.5D preview of what you are configuring. Materials can be compared side by side, quotes saved locally, and a professional PDF quotation generated with jsPDF and submitted as a lead. Around it sits a cinematic marketing site — parallax hero, Lenis and GSAP scroll, magnetic buttons, masonry portfolio with a before/after slider — and an admin CMS where every rate is editable, so the calculator updates without a deploy.',
    features: [
      { title: 'Live quotation engine', body: 'Itemised pricing across material, labour, installation, transport and GST, recalculated on every change, with a side-by-side material comparison.' },
      { title: 'PDF quotations', body: 'A professional quotation generated in the browser with jsPDF and jspdf-autotable, downloadable immediately and captured as a lead.' },
      { title: 'Admin CMS', body: 'Dashboard with lead, conversion, service-popularity and revenue charts; a lead pipeline with search, filter and status; editable pricing; and a content editor for homepage copy.' },
      { title: 'Cinematic front end', body: 'Lenis smooth scrolling with GSAP scroll triggers, parallax hero with slow zoom, glassmorphism, animated counters and magnetic buttons — with prefers-reduced-motion respected throughout.' },
      { title: 'Search and share ready', body: 'Dynamic metadata, LocalBusiness, FAQ and WebSite JSON-LD, sitemap, robots and a dynamic OG image.' },
      { title: 'PWA and theming', body: 'Web manifest with an offline shell service worker, dark and light modes, mobile-first throughout.' },
    ],
    outcome: [
      'A buyer gets a defensible, itemised number in under a minute instead of after a site visit.',
      'Every quote generated is a captured lead sitting in the admin pipeline.',
      'Rates change from the admin panel, so the firm is not waiting on a developer to reprice.',
    ],
  },

  {
    slug: 'imperial-craft-studio',
    title: 'Imperial Craft Studio',
    subtitle: 'Brand and portfolio site for a craft and design studio',
    client: 'Imperial Craft Studio',
    group: 'client',
    category: 'Website',
    year: '2026',
    role: 'Design and development, end to end',
    tag: 'Design-led build',
    featured: true,
    accent: '#d8b4fe',
    summary: 'Of all the client work so far, the one I am most satisfied with. Brand and portfolio site, designed and developed start to finish.',
    metrics: [{ value: '100%', label: 'designed and built in-house' }],
    cover: { src: null, alt: '', ...D, chrome: 'diagram', diagram: 'craft' },
    gallery: [],
    links: [{ label: 'Live site', href: 'https://imperialcraftstudio.in/', kind: 'live' }],
    stack: ['HTML', 'CSS', 'JavaScript'],
    problem: 'A craft studio sells taste. The site had to be the first proof of it, which meant the design could not be borrowed from anywhere.',
    approach: 'Brand direction, layout, motion and build were all done in-house, with the work itself given the room it needs and the interface kept out of its way.',
    features: [
      { title: 'Designed, not assembled', body: 'Type, palette and layout drawn for this studio rather than adapted from a theme.' },
      { title: 'Work first', body: 'The portfolio is the interface; navigation and chrome stay quiet around it.' },
    ],
    outcome: ['The piece of client work I would put in front of a new client first.'],
  },

  {
    slug: 'unique-holidays',
    title: 'Unique Holidays',
    subtitle: 'Scroll-driven travel site, zero dependencies',
    client: 'Unique Holidays',
    group: 'client',
    category: 'Website',
    year: '2026',
    role: 'Design and development, end to end',
    tag: 'HTML · CSS · Vanilla JS · image pipeline',
    featured: true,
    accent: '#38bdf8',
    summary: 'A cinematic travel site with a scroll-driven homepage, 18 destinations and 18 packages — built with no framework, no build step and no external image requests.',
    metrics: [
      { value: '18', label: 'destinations' },
      { value: '18', label: 'tour packages' },
      { value: '0', label: 'npm dependencies' },
    ],
    cover: { src: 'unique-holidays', alt: 'Unique Holidays homepage — a full-bleed mountain landscape behind the wordmark', ...D, chrome: 'browser', diagram: 'roster' },
    mobile: { src: 'unique-holidays-m', alt: 'Unique Holidays on a phone', ...M },
    gallery: [
      { src: 'unique-holidays', alt: 'The Unique Holidays homepage hero', caption: 'A full-bleed scene behind the brand, with the trip-search widget one scroll below.', ...D },
      { src: 'unique-holidays-packages', alt: 'The tour packages page with category filters', caption: 'All 18 packages, filterable by category, each with what is included and an FAQ accordion.', ...D },
      { src: 'unique-holidays-long', alt: 'The full Unique Holidays homepage', caption: 'Featured destinations, best sellers, why-us, stats, how-it-works and testimonials — one scroll.', w: 1200, h: 7200, long: true },
    ],
    links: [{ label: 'Source', href: 'https://github.com/CHIRAG-SUTHAR-GIT/unique-holidays-website', kind: 'code' }],
    stack: ['HTML', 'CSS custom properties', 'Vanilla JavaScript', 'IntersectionObserver', 'WebP pipeline'],
    problem: 'Travel sites live and die on their photographs, and photographs are exactly what makes them slow — especially on a phone on mobile data, which is where the bookings come from.',
    approach:
      'The brand palette was sampled from the client’s own logo and lives as CSS custom properties, so the site and the logo agree. Seventeen destinations use the owner’s real photographs: originals up to 8800px and six megabytes are never served, instead a pipeline generates 1400px card copies and 2400px full-bleed scenes, strips EXIF including GPS, and writes WebP derivatives. The homepage is scroll-driven and cinematic, but it is plain HTML, CSS and vanilla JavaScript — open index.html and it runs.',
    features: [
      { title: 'Scroll-driven homepage', body: 'Hero, trip-search widget, featured destinations, best sellers, stats, how-it-works and a testimonial slider, sequenced on scroll.' },
      { title: 'Live search and filters', body: '18 destinations with live search and India/International filters; 18 packages with category filters, inclusions and an FAQ accordion.' },
      { title: 'Real photographs, handled properly', body: 'Owner-supplied originals resized to card and scene sizes, EXIF and GPS stripped, WebP derivatives generated, nothing served straight from the camera.' },
      { title: 'No build step', body: 'No framework, no npm install, no bundler. The client can edit a page and upload it.' },
    ],
    outcome: [
      'A photograph-heavy site that still loads fast on a mobile connection.',
      'A brand palette that matches the client’s own identity exactly, because it was sampled from it.',
    ],
  },

  {
    slug: 'eva-journeys',
    title: 'Eva Journeys',
    subtitle: 'Travel agency site tuned for WhatsApp bookings',
    client: 'Eva Journeys',
    group: 'client',
    category: 'Website',
    year: '2026',
    role: 'Design and development, end to end',
    tag: 'HTML · CSS · JavaScript · WebP',
    featured: false,
    accent: '#2dd4bf',
    summary: '50+ destinations and 20 packages, searchable by destination and party size, with package-wise WhatsApp booking that carries the enquiry details into the chat.',
    metrics: [
      { value: '50+', label: 'destinations' },
      { value: '20', label: 'tour packages' },
      { value: '1 tap', label: 'to a pre-filled booking chat' },
    ],
    cover: { src: 'eva', alt: 'Eva Journeys homepage — an aerial coastline behind the words Discover Your Next Great Adventure', ...D, chrome: 'browser', diagram: 'mobile' },
    mobile: { src: 'eva-m', alt: 'Eva Journeys on a phone', ...M },
    gallery: [
      { src: 'eva', alt: 'The Eva Journeys homepage hero', caption: 'Aerial hero, dotted route line, and the search and booking calls to action above the fold.', ...D },
      { src: 'eva-long', alt: 'The full Eva Journeys homepage', caption: 'Destinations, packages, travel guides and booking, one scroll deep.', w: 1200, h: 7200, long: true },
    ],
    links: [{ label: 'Live site', href: 'https://www.evajourneys.com/', kind: 'live' }],
    stack: ['HTML', 'CSS', 'JavaScript', 'WebP pipeline'],
    problem: 'An agency’s enquiries arrive on WhatsApp, but a generic “contact us” button drops the customer into an empty chat where they have to explain themselves — and most do not bother.',
    approach:
      'Booking is package-wise: the WhatsApp handoff carries the destination, the package and the enquiry details with it, so the conversation opens already knowing what the customer wants. Search works the way people plan — by destination and party size. Images are WebP-optimised throughout, because these pages are opened on mobile data.',
    features: [
      { title: 'Search that matches how people plan', body: 'By destination and by number of travellers, rather than by internal package code.' },
      { title: 'Package-wise WhatsApp booking', body: 'The enquiry details travel into the chat, so no one has to restate what they were looking at.' },
      { title: 'Travel guide section', body: 'Long-form destination content that gives the site something to rank for.' },
      { title: 'Fast on mobile data', body: 'WebP images and a light front end, tuned for the networks the audience actually uses.' },
    ],
    outcome: ['Enquiries arrive with context attached instead of as a blank “hi”.', 'Fast pages on the connections that matter for this audience.'],
  },

  {
    slug: 'tiffin-tracker',
    title: 'Tiffin Tracker',
    subtitle: 'Android app running tiffin businesses in Gandhinagar',
    client: 'Tiffin providers, Gandhinagar',
    group: 'client',
    category: 'Android app',
    year: '2025',
    role: 'Sole developer',
    tag: 'Java · Android · server-backed sync',
    featured: true,
    accent: '#fb923c',
    summary: 'In daily commercial use: customer-wise delivery counts, automatic payment reminders and day-to-day accounts, with every provider’s records on the server so a lost phone is not a lost business.',
    metrics: [
      { value: 'Daily', label: 'commercial use' },
      { value: '1', label: 'login per provider, records on the server' },
    ],
    cover: { src: null, alt: '', ...D, chrome: 'diagram', diagram: 'mobile' },
    gallery: [],
    links: [],
    confidential: 'Private commercial deployment. A walkthrough can be arranged on request.',
    stack: ['Java', 'Android SDK', 'Server-backed sync', 'MySQL'],
    problem: 'A tiffin provider runs on a diary: who took how many tiffins, who has paid, who is three weeks behind. The diary gets wet, the phone gets replaced, and a month of accounts disappears with it.',
    approach:
      'The whole operation moved into one Android app built for the phones these businesses actually use. Delivery counts are recorded customer by customer, payment reminders go out automatically, and daily accounts add themselves up. Each provider gets a separate login with records kept on the server, so an accidental uninstall or a new phone costs nothing.',
    features: [
      { title: 'Customer-wise delivery counts', body: 'Daily counts per customer, entered in seconds, in the middle of a delivery round.' },
      { title: 'Automatic payment reminders', body: 'Dues are chased by the app rather than remembered by the owner.' },
      { title: 'Day-to-day accounts', body: 'Daily and monthly totals kept without a separate ledger.' },
      { title: 'Per-provider accounts on the server', body: 'Separate logins with server-side records: reinstall the app or change the phone and nothing is lost.' },
    ],
    outcome: [
      'Used every day by tiffin providers in Gandhinagar to run the whole operation.',
      'The month’s accounts survive a lost phone, which is the failure the paper diary could never handle.',
    ],
  },

  {
    slug: 'krishna-enterprise',
    title: 'Krishna Enterprise',
    subtitle: 'Catalogue and enquiry site for a recycling manufacturer',
    client: 'Krishna Enterprise',
    group: 'client',
    category: 'Website',
    year: '2025',
    role: 'Design and development, end to end',
    tag: 'HTML · CSS · JavaScript · PHP',
    featured: false,
    accent: '#4ade80',
    summary: 'An MSME and GST-registered plastic recycling manufacturer, with a granule catalogue, product-wise enquiry, custom formulation requests and direct call and WhatsApp routes for bulk buyers.',
    metrics: [
      { value: '5', label: 'granule types catalogued' },
      { value: '2 taps', label: 'from product to a bulk enquiry' },
    ],
    cover: { src: 'krishna', alt: 'Krishna Enterprise homepage — a dark hero reading Leading Plastic Recycling Solutions', ...D, chrome: 'browser', diagram: 'ledger' },
    mobile: { src: 'krishna-m', alt: 'Krishna Enterprise on a phone', ...M },
    gallery: [
      { src: 'krishna', alt: 'The Krishna Enterprise homepage hero', caption: 'MSME and GST credentials stated up front, because bulk buyers check them first.', ...D },
      { src: 'krishna-long', alt: 'The full Krishna Enterprise homepage', caption: 'Product catalogue, credentials, contact routes and location for bulk buyers.', w: 1200, h: 5251, long: true },
    ],
    links: [
      { label: 'Live site', href: 'https://chirag-nextgen.github.io/krishnaenterprise/', kind: 'live' },
      { label: 'Source', href: 'https://github.com/Chirag-nextgen/krishnaenterprise', kind: 'code' },
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Dark/light theming'],
    problem: 'Industrial buyers are not browsing. They want to know the grade, whether the supplier is registered, and how fast they can get someone on the phone.',
    approach:
      'The catalogue leads with the material — LDPE, HDPE, PC, ABS and PP granules — with product-wise enquiry and a route for custom formulation requests. MSME and GST registration are stated above the fold because that is the first question a bulk buyer asks. Call and WhatsApp are one tap from anywhere on the page, and location and contact details are laid out for someone planning a pickup.',
    features: [
      { title: 'Material-led catalogue', body: 'LDPE, HDPE, PC, ABS and PP granules, each with its own enquiry route.' },
      { title: 'Custom formulation requests', body: 'A path for buyers who need a blend rather than a listed grade.' },
      { title: 'Credentials up front', body: 'MSME and GST registration stated in the hero, where a bulk buyer looks first.' },
      { title: 'Direct contact', body: 'Call and WhatsApp available from anywhere, with location details for pickups.' },
    ],
    outcome: ['Enquiries arrive naming the grade the buyer wants.', 'A small manufacturer presents at the level of a much larger supplier.'],
  },
];

export const featured = projects.filter((p) => p.featured);
export const byGroup = (g: ProjectGroup) => projects.filter((p) => p.group === g);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
