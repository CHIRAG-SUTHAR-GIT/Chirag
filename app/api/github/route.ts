import { NextResponse } from 'next/server';

/**
 * Server-side GitHub stats proxy.
 *
 * Runs on Node.js, not in the visitor's browser: one request from this
 * server refreshes the cache for everyone (`next: { revalidate }`), so a
 * portfolio getting traffic never trips GitHub's unauthenticated rate
 * limit (60 requests/hour) the way a client-side fetch from every visitor
 * eventually would. Falls back to null fields on any upstream failure so
 * the widget degrades to its dash placeholders instead of erroring.
 */

export const revalidate = 3600; // 1 hour

interface GithubUser {
  public_repos?: number;
  followers?: number;
}
interface GithubRepo {
  stargazers_count?: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user');
  if (!user || !/^[a-zA-Z0-9-]+$/.test(user)) {
    return NextResponse.json({ error: 'invalid user' }, { status: 400 });
  }

  const headers = { 'User-Agent': 'chirag-suthar-portfolio', Accept: 'application/vnd.github+json' };

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers, next: { revalidate } }),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100`, { headers, next: { revalidate } }),
    ]);

    const userData: GithubUser = userRes.ok ? await userRes.json() : {};
    const repos: GithubRepo[] | null = reposRes.ok ? await reposRes.json() : null;
    const stars = Array.isArray(repos) ? repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0) : null;

    return NextResponse.json(
      {
        repos: userData.public_repos ?? null,
        followers: userData.followers ?? null,
        stars,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch {
    return NextResponse.json({ repos: null, followers: null, stars: null }, { status: 200 });
  }
}
