'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Project, ProjectGroup } from '@/lib/data/projects';
import { IconArrow } from './icons';

type FilterKey = 'all' | ProjectGroup | 'web' | 'data' | 'automation' | 'mobile';

const FILTERS: { k: FilterKey; l: string }[] = [
  { k: 'all', l: 'All work' },
  { k: 'cyber', l: 'Cyber & data' },
  { k: 'client', l: 'Client work' },
  { k: 'web', l: 'Websites & platforms' },
  { k: 'data', l: 'Data & analysis' },
  { k: 'automation', l: 'Automation & tools' },
  { k: 'mobile', l: 'Mobile' },
];

const CATEGORY_TAG: Record<string, FilterKey> = {
  'Data platform': 'data',
  'Investigation tooling': 'data',
  'Public service': 'data',
  'Reporting tool': 'data',
  Automation: 'automation',
  'Internal tool': 'automation',
  'Website & CRM': 'web',
  'Web platform': 'web',
  Website: 'web',
  'Android app': 'mobile',
};

function tagsFor(p: Project): FilterKey[] {
  return [p.group, CATEGORY_TAG[p.category] ?? 'web'];
}

export function WorkArchive({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [peekSrc, setPeekSrc] = useState<string | null>(null);
  const [peekPos, setPeekPos] = useState({ x: 0, y: 0 });
  const peekVisible = peekSrc !== null;
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });

  const visible = projects.filter((p) => filter === 'all' || tagsFor(p).includes(filter));

  useEffect(() => {
    if (!peekVisible) return;
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX + 190, y: e.clientY };
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    const loop = () => {
      setPeekPos((prev) => ({
        x: prev.x + (Math.min(Math.max(targetRef.current.x, 200), innerWidth - 200) - prev.x) * 0.14,
        y: prev.y + (Math.min(Math.max(targetRef.current.y, 140), innerHeight - 140) - prev.y) * 0.14,
      }));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [peekVisible]);

  return (
    <>
      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f.k} className="filter" type="button" aria-pressed={filter === f.k} onClick={() => setFilter(f.k)}>
            {f.l}
          </button>
        ))}
      </div>

      <p className="lede" style={{ marginBottom: '1rem' }}>
        <span data-arch-count>{String(visible.length).padStart(2, '0')}</span> shown
      </p>

      <div className="arch">
        {visible.map((p, i) => (
          <Link
            key={p.slug}
            className="arch__row"
            href={`/work/${p.slug}`}
            data-cursor="Open"
            onMouseEnter={() => p.cover.src && setPeekSrc(`/assets/img/work/${p.cover.src}@sm.webp`)}
            onMouseLeave={() => setPeekSrc(null)}
          >
            <span className="arch__n">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="arch__t">{p.title}</span>
              <span className="arch__m" style={{ display: 'block', marginTop: '.35rem' }}>
                {p.client}
              </span>
            </span>
            <span className="arch__s">{p.subtitle}</span>
            <span className="arch__m">{p.tag}</span>
            <span className="arch__go">
              <IconArrow />
            </span>
          </Link>
        ))}
      </div>

      <div className={`peek${peekVisible ? ' on' : ''}`} style={{ left: peekPos.x, top: peekPos.y }} aria-hidden="true">
        {peekSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={peekSrc} alt="" width={340} height={212} />
        )}
      </div>
    </>
  );
}
