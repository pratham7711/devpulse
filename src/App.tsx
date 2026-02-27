import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

import { fetchUser, fetchRepos, fetchEvents } from './api/github';
import type { GithubUser, Repo, Event } from './types/github';
import {
  getLanguageStats,
  getContributionData,
  getReposByStars,
  getTotalStats,
} from './utils/dataProcessors';

import { SearchBar } from './components/SearchBar';
import { ProfileCard } from './components/ProfileCard';
import { ContributionGraph } from './components/ContributionGraph';
import { LanguageChart } from './components/LanguageChart';
import { RepoCard } from './components/RepoCard';
import { ActivityTimeline } from './components/ActivityTimeline';
import { StatsGrid } from './components/StatsGrid';

const DEFAULT_USER = 'pratham7711';

function LoadingSkeleton() {
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, marginBottom: 24 }}>
        <div className="skeleton" style={{ height: 380 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton" style={{ height: 100 }} />
          <div className="skeleton" style={{ height: 160 }} />
          <div className="skeleton" style={{ height: 100 }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 160, marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 130 }} />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        padding: '60px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 48 }}>⚠️</div>
      <h2 style={{ fontSize: 20, color: 'var(--text-primary)', fontWeight: 600 }}>
        {message.includes('not found') ? 'User Not Found' : 'Something Went Wrong'}
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 400 }}>{message}</p>
      <motion.button
        onClick={onRetry}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={{
          background: 'var(--green)',
          color: '#0D1117',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );
}

interface DashboardData {
  user: GithubUser;
  repos: Repo[];
  events: Event[];
}

export default function App() {
  const [username, setUsername] = useState<string>('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Check URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user') ?? DEFAULT_USER;
    if (user) {
      setUsername(user);
      handleSearch(user);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setData(null);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('user', trimmed);
    window.history.pushState({}, '', url.toString());

    try {
      const [user, repos, events] = await Promise.all([
        fetchUser(trimmed),
        fetchRepos(trimmed),
        fetchEvents(trimmed).catch(() => [] as Event[]),
      ]);

      setData({ user, repos, events });
      setShowDashboard(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setShowDashboard(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewSearch = (q: string) => {
    setUsername(q);
    handleSearch(q);
  };

  const handleRetry = () => {
    setError(null);
    setShowDashboard(false);
  };

  const langStats = data ? getLanguageStats(data.repos) : [];
  const contribData = getContributionData();
  const totalContributions = contribData.reduce((s, d) => s + d.count, 0);
  const reposByStars = data ? getReposByStars(data.repos) : [];
  const totalStats = data ? getTotalStats(data.repos) : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(13,17,23,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--green), var(--blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              color: '#0D1117',
            }}
          >
            DP
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 16,
              background: 'linear-gradient(90deg, var(--green), var(--blue))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DEVPULSE
          </span>
        </motion.div>

        {showDashboard && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ flex: 1, maxWidth: 480 }}
          >
            <SearchBar onSearch={handleNewSearch} loading={loading} initialValue={username} />
          </motion.div>
        )}
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px' }}>
        <AnimatePresence mode="wait">
          {/* Landing */}
          {!showDashboard && !loading && !error && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                minHeight: 'calc(100vh - 60px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 32,
                textAlign: 'center',
                padding: '60px 0',
              }}
            >
              {/* Logo large */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, var(--green), var(--blue))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 28,
                    color: '#0D1117',
                    margin: '0 auto 20px',
                    boxShadow: 'var(--glow-green)',
                  }}
                >
                  DP
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    background: 'linear-gradient(90deg, var(--green), var(--blue))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  DEVPULSE
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                  color: 'var(--text-secondary)',
                  maxWidth: 480,
                }}
              >
                Visualize any GitHub profile — contributions, languages, repos, and activity at a glance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ width: '100%', maxWidth: 560 }}
              >
                <SearchBar onSearch={handleNewSearch} loading={loading} initialValue={DEFAULT_USER} />
              </motion.div>

              {/* Feature pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
              >
                {['🔥 Contribution Heatmap', '📊 Language Stats', '⭐ Repo Rankings', '📡 Activity Feed'].map(
                  (feat) => (
                    <span
                      key={feat}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 20,
                        padding: '5px 14px',
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {feat}
                    </span>
                  )
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ paddingTop: 32 }}
            >
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: 14 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: 24,
                    height: 24,
                    border: '2px solid var(--border)',
                    borderTopColor: 'var(--green)',
                    borderRadius: '50%',
                    margin: '0 auto 12px',
                  }}
                />
                Fetching GitHub data...
              </div>
              <LoadingSkeleton />
            </motion.div>
          )}

          {/* Error */}
          {error && !loading && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ErrorState message={error} onRetry={handleRetry} />
            </motion.div>
          )}

          {/* Dashboard */}
          {showDashboard && data && !loading && (
            <motion.div
              key={`dashboard-${data.user.login}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ paddingTop: 28 }}
            >
              {/* Stats grid */}
              <section style={{ marginBottom: 24 }}>
                <StatsGrid stats={totalStats!} repoCount={data.user.public_repos} />
              </section>

              {/* Profile + Language */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,340px) 1fr',
                  gap: 20,
                  marginBottom: 20,
                  alignItems: 'start',
                }}
              >
                <ProfileCard user={data.user} />
                <LanguageChart stats={langStats} />
              </div>

              {/* Contribution graph */}
              <section style={{ marginBottom: 20 }}>
                <ContributionGraph data={contribData} totalContributions={totalContributions} />
              </section>

              {/* Repos + Activity */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr minmax(0,340px)',
                  gap: 20,
                  alignItems: 'start',
                }}
              >
                {/* Repos */}
                <section>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 14,
                    }}
                  >
                    Top Repositories
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
                      gap: 12,
                    }}
                  >
                    {reposByStars.slice(0, 6).map((repo, i) => (
                      <RepoCard key={repo.id} repo={repo} index={i} />
                    ))}
                  </div>
                </section>

                {/* Activity */}
                <section>
                  <ActivityTimeline events={data.events} />
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
