import { isReduced, type Cleanup } from './util';

const SNIPPETS: string[][] = [
  ['$ sudo tail -f /var/log/ncrp_ingest.log', '[ok] 41,208 rows normalised', '[ok] fuzzy match: account_no (94%)', '[ok] batch commit -> mysql (sha256 ok)'],
  ['$ tree -L 2 ./cases/2026-09', '├── bank_statements/', '│   ├── hdfc_txn.xlsx', '│   └── sbi_txn.xlsx', '├── ack_numbers.csv', '└── risk_report.pdf'],
  ['$ ps aux | grep fraud_pipeline', 'chirag 14021  0.3  python3 -m src.pipeline', 'chirag 14022  0.1  python3 -m src.aggregator'],
  ['$ sudo systemctl status cyber-analytics', '● active (running) since 09:14 IST', '  Tasks: 6    Memory: 340.2M'],
  ['$ git log --oneline -3', 'a3f9e21 fix: account normalisation edge case', 'c88d012 feat: district-wise split engine', '7e10bda chore: bump rapidfuzz'],
  ['$ find ./cases -name "*.xlsx" | wc -l', '47', '$ du -sh ./cases/2026-09', '2.3G'],
  ['$ sudo -u cyberadmin python3 verify.py', 'checksum OK — 3,204 records', 'ledger balance reconciled'],
  ['$ df -h /data', 'Filesystem   Used  Avail  Use%', '/dev/sda1    62G   180G   26%'],
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function runLoop(feed: { el: HTMLDivElement; text: Text }, alive: { current: boolean }) {
  let last = -1;
  while (alive.current) {
    let idx = (Math.random() * SNIPPETS.length) | 0;
    if (idx === last) idx = (idx + 1) % SNIPPETS.length;
    last = idx;
    const lines = SNIPPETS[idx];
    const done: string[] = [];
    for (const line of lines) {
      for (let i = 1; i <= line.length; i++) {
        if (!alive.current) return;
        feed.text.data = done.concat(line.slice(0, i)).join('\n');
        await sleep(13 + Math.random() * 20);
      }
      done.push(line);
      feed.text.data = done.join('\n');
      await sleep(140 + Math.random() * 120);
    }
    await sleep(3400 + Math.random() * 1400);
    feed.el.style.opacity = '0';
    await sleep(500);
    feed.text.data = '';
    feed.el.style.removeProperty('opacity');
    await sleep(300 + Math.random() * 500);
  }
}

function makeFeed(anchorClass: string) {
  const el = document.createElement('div');
  el.className = `term-feed ${anchorClass}`;
  el.style.transition = 'opacity 0.5s ease';
  el.setAttribute('aria-hidden', 'true');
  const pre = document.createElement('pre');
  const text = document.createTextNode('');
  const caret = document.createElement('span');
  caret.className = 'term-feed__caret';
  pre.appendChild(text);
  pre.appendChild(caret);
  el.appendChild(pre);
  document.getElementById('fx-root')?.appendChild(el);
  return { el, text };
}

/** Floating "live terminal" panels typing out real command-line snippets —
 * a companion to the node-graph canvas. Global, viewport-anchored, so set
 * up once for the app's life. */
export function initTermFeed(): Cleanup {
  if (isReduced()) return () => {};
  if (window.matchMedia('(max-width: 1220px), (max-height: 720px)').matches) return () => {};

  const alive = { current: true };
  const feedTL = makeFeed('term-feed--tl');
  const feedBR = makeFeed('term-feed--br');
  runLoop(feedTL, alive);
  const startBR = setTimeout(() => runLoop(feedBR, alive), 1800);

  return () => {
    alive.current = false;
    clearTimeout(startBR);
    feedTL.el.remove();
    feedBR.el.remove();
  };
}
