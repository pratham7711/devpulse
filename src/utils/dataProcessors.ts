import type { Repo, LanguageStat, ContributionDay, TotalStats } from '../types/github';

// Real GitHub language colors
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  R: '#198CE7',
  MATLAB: '#e16737',
  Perl: '#0298c3',
  Clojure: '#db5855',
  Erlang: '#B83998',
  Nix: '#7e7eff',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  Other: '#8b949e',
};

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? LANGUAGE_COLORS['Other'];
}

export function getLanguageStats(repos: Repo[]): LanguageStat[] {
  const counts: Record<string, number> = {};

  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([language, count]) => ({
      language,
      count,
      color: getLanguageColor(language),
      percentage: Math.round((count / total) * 100),
    }));
}

export function getContributionData(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const today = new Date();
  // Start from 364 days ago
  const start = new Date(today);
  start.setDate(start.getDate() - 363);

  for (let i = 0; i < 364; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat

    // More activity on weekdays
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseChance = isWeekend ? 0.3 : 0.65;
    const hasActivity = Math.random() < baseChance;

    let count = 0;
    if (hasActivity) {
      const max = isWeekend ? 6 : 12;
      count = Math.floor(Math.random() * max) + 1;
      // Occasional spikes
      if (Math.random() < 0.05) count = Math.floor(Math.random() * 20) + 10;
    }

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count === 0) level = 0;
    else if (count <= 2) level = 1;
    else if (count <= 5) level = 2;
    else if (count <= 10) level = 3;
    else level = 4;

    days.push({
      date: date.toISOString().split('T')[0],
      count,
      level,
    });
  }

  return days;
}

export function getReposByStars(repos: Repo[]): Repo[] {
  return [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
}

export function getTotalStats(repos: Repo[]): TotalStats {
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const totalWatchers = repos.reduce((sum, r) => sum + r.watchers_count, 0);

  const langCounts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      langCounts[repo.language] = (langCounts[repo.language] ?? 0) + 1;
    }
  }
  const topLanguage =
    Object.entries(langCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'N/A';

  return { totalStars, totalForks, totalWatchers, topLanguage };
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}
