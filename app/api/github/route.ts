import { NextResponse } from 'next/server';

/**
 * Server-side GitHub stats proxy.
 *
 * Runs on Node.js, not in the visitor's browser: one request from this
 * server refreshes the cache for everyone (`next: { revalidate }`), so a
 * portfolio getting traffic never trips GitHub's rate limit the way a
 * client-side fetch from every visitor eventually would. Falls back to
 * null fields on any upstream failure so the widget degrades to its dash
 * placeholders instead of erroring.
 *
 * With GITHUB_TOKEN set (a fine-grained PAT for this account, read-only
 * "Metadata" access, never exposed to the client), the repo and star
 * counts come from /user/repos with the token attached, so the list
 * includes private repos too — matching what the account owner sees on
 * their own profile, not just what an unauthenticated visitor could see.
 * (Deliberately not using /user's `total_private_repos` field: GitHub
 * only returns that for classic tokens/OAuth apps, not fine-grained ones —
 * counting the repo list itself works with either.) Without the token, it
 * degrades to the public-only counts anyone gets from the unauthenticated
 * API.
 */

export const revalidate = 3600; // 1 hour

interface GithubUser {
  public_repos?: number;
  followers?: number;
}
interface GithubRepo {
  stargazers_count?: number;
}

/** Returns `null` (rather than an empty array) when the very first page
 * fails, so a rate-limited or unauthorized request reads as "unknown" —
 * not silently as "this account has zero repos". */
async function fetchAllRepos(headers: HeadersInit, authed: boolean, user: string): Promise<GithubRepo[] | null> {
  const repos: GithubRepo[] = [];
  const base = authed ? 'https://api.github.com/user/repos?affiliation=owner' : `https://api.github.com/users/${user}/repos`;
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`${base}&per_page=100&page=${page}`, { headers, next: { revalidate } });
    if (!res.ok) return page === 1 ? null : repos;
    const batch: GithubRepo[] = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user');
  if (!user || !/^[a-zA-Z0-9-]+$/.test(user)) {
    return NextResponse.json({ error: 'invalid user' }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const authed = Boolean(token);
  const headers: HeadersInit = {
    'User-Agent': 'chirag-suthar-portfolio',
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    // /user (no username) only resolves for the token's own account — fine
    // here, since this portfolio only ever reports its own owner's stats.
    const userUrl = authed ? 'https://api.github.com/user' : `https://api.github.com/users/${user}`;
    const [userRes, repos] = await Promise.all([fetch(userUrl, { headers, next: { revalidate } }), fetchAllRepos(headers, authed, user)]);

    const userData: GithubUser = userRes.ok ? await userRes.json() : {};
    const repoCount = authed ? (repos === null ? null : repos.length) : userData.public_repos ?? null;
    const stars = repos === null ? null : repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

    return NextResponse.json(
      { repos: repoCount, followers: userData.followers ?? null, stars },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch {
    return NextResponse.json({ repos: null, followers: null, stars: null }, { status: 200 });
  }
}
