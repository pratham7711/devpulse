import type { GithubUser, Repo, Event } from '../types/github';

const BASE_URL = 'https://api.github.com';

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (res.status === 404) {
    throw new Error('User not found');
  }
  if (res.status === 403) {
    const resetTime = res.headers.get('X-RateLimit-Reset');
    const resetDate = resetTime
      ? new Date(parseInt(resetTime) * 1000).toLocaleTimeString()
      : 'soon';
    throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate}`);
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchUser(username: string): Promise<GithubUser> {
  return apiFetch<GithubUser>(`${BASE_URL}/users/${username}`);
}

export async function fetchRepos(username: string): Promise<Repo[]> {
  return apiFetch<Repo[]>(
    `${BASE_URL}/users/${username}/repos?sort=pushed&per_page=30`
  );
}

export async function fetchEvents(username: string): Promise<Event[]> {
  return apiFetch<Event[]>(
    `${BASE_URL}/users/${username}/events/public?per_page=100`
  );
}
