'use client';

import { useState } from 'react';
import type { Faq as FaqEntry } from '@/lib/data/site';

export function FaqList({ items, idPrefix = 'faq' }: { items: FaqEntry[]; idPrefix?: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="faq">
      {items.map((f, i) => {
        const isOpen = openIdx === i;
        const id = `${idPrefix}-${i}`;
        return (
          <div className={`faq__item${isOpen ? ' open' : ''}`} key={id}>
            <button className="faq__q" type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpenIdx(isOpen ? null : i)}>
              {f.q}
              <i aria-hidden="true" />
            </button>
            <div className="faq__a" id={id} aria-hidden={!isOpen}>
              <div>
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
