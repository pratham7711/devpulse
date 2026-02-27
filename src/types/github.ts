export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  pushed_at: string;
  updated_at: string;
  created_at: string;
  size: number;
  default_branch: string;
  visibility: string;
}

export interface EventPayload {
  push_id?: number;
  size?: number;
  ref?: string;
  commits?: { sha: string; message: string }[];
  action?: string;
  pull_request?: { title: string; number: number; html_url: string };
  issue?: { title: string; number: number; html_url: string };
  forkee?: { full_name: string; html_url: string };
}

export interface Event {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: EventPayload;
  public: boolean;
  created_at: string;
}

export interface LanguageStat {
  language: string;
  count: number;
  color: string;
  percentage: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface TotalStats {
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  topLanguage: string;
}
