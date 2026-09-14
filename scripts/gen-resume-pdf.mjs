/**
 * Regenerates public/assets/resume/chirag-suthar-resume.pdf from the live
 * /resume page by printing it with headless Chromium.
 *
 * Requires `playwright` (not a project dependency — install it ad hoc):
 *   npm i -D playwright && npx playwright install chromium
 *
 * Usage:
 *   npm run build && npm run start &   # serve the production build
 *   node scripts/gen-resume-pdf.mjs http://localhost:3000
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = process.argv[2] || 'http://localhost:3000';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/assets/resume/chirag-suthar-resume.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/resume`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Force-reveal scroll-triggered content — a real visitor gets this by
// scrolling, but the PDF needs it visible immediately.
await page.evaluate(() => {
  document.querySelectorAll('.rv, .line-mask').forEach((el) => el.classList.add('in'));
});

await page.emulateMedia({ media: 'print' });
await page.waitForTimeout(300);
await page.pdf({
  path: OUT,
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
});

console.log('Wrote', OUT);
await browser.close();
