import { motion } from 'framer-motion';
import type { Repo } from '../types/github';
import { getLanguageColor } from '../utils/dataProcessors';

interface RepoCardProps {
  repo: Repo;
  index: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function RepoCard({ repo, index }: RepoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{
        y: -4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(57,211,83,0.3)',
      }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'default',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Name + Description */}
      <div>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--blue)',
            fontFamily: 'var(--font-mono)',
            display: 'block',
            marginBottom: 6,
          }}
        >
          {repo.name}
        </a>
        {repo.description && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {repo.description}
          </p>
        )}
      </div>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              style={{
                background: 'var(--blue-muted)',
                color: 'var(--blue)',
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 20,
                fontWeight: 500,
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        {repo.language && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: getLanguageColor(repo.language),
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{repo.language}</span>
          </div>
        )}

        {repo.stargazers_count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>⭐</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{repo.stargazers_count.toLocaleString()}</span>
          </div>
        )}

        {repo.forks_count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>🍴</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{repo.forks_count.toLocaleString()}</span>
          </div>
        )}

        {repo.watchers_count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>👁️</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{repo.watchers_count.toLocaleString()}</span>
          </div>
        )}

        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
          Updated {formatDate(repo.pushed_at)}
        </div>
      </div>
    </motion.div>
  );
}
