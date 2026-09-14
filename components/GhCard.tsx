'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/data/site';
import { IconArrow } from './icons';

interface GhStats {
  repos: number | null;
  followers: number | null;
  stars: number | null;
}

const fmt = (n: number | null) => (n === null ? '—' : n.toLocaleString('en-IN'));

export function GhCard() {
  const [stats, setStats] = useState<GhStats>({ repos: null, followers: null, stars: null });
  const [avatarOk, setAvatarOk] = useState<boolean | null>(null);
  const [chartOk, setChartOk] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/github?user=${site.githubHandle}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: GhStats | null) => {
        if (!cancelled && d) setStats(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="ghcard rv rv-d3">
      <div className="ghcard__top">
        {avatarOk === false ? (
          <span className="ghcard__avatar ghcard__avatar--fallback" aria-hidden="true">
            CS
          </span>
        ) : (
          // Native <img>, not next/image: this is a third-party avatar
          // from github.com, not one of our own optimizable assets.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="ghcard__avatar"
            src={`https://github.com/${site.githubHandle}.png?size=96`}
            width={40}
            height={40}
            alt={`${site.name} on GitHub`}
            loading="lazy"
            decoding="async"
            onLoad={() => setAvatarOk(true)}
            onError={() => setAvatarOk(false)}
          />
        )}
        <div className="ghcard__id">
          <span className="ghcard__name">@{site.githubHandle}</span>
          <span className="ghcard__sub">
            <i /> Live from GitHub
          </span>
        </div>
        <a className="ghcard__link" href={site.github} target="_blank" rel="noopener" aria-label="Open GitHub profile">
          <IconArrow />
        </a>
      </div>
      <div className="ghcard__stats">
        <div>
          <b>{fmt(stats.repos)}</b>
          <span>Repos</span>
        </div>
        <div>
          <b>{fmt(stats.followers)}</b>
          <span>Followers</span>
        </div>
        <div>
          <b>{fmt(stats.stars)}</b>
          <span>Stars</span>
        </div>
      </div>
      {chartOk && (
        <div className="ghcard__chartwrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ghcard__chart"
            src={`https://ghchart.rshah.org/ffb020/${site.githubHandle}`}
            alt={`${site.name}’s GitHub contribution graph`}
            loading="lazy"
            decoding="async"
            onError={() => setChartOk(false)}
          />
        </div>
      )}
    </div>
  );
}
