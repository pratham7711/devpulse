import { motion } from 'framer-motion';
import type { GithubUser } from '../types/github';

interface ProfileCardProps {
  user: GithubUser;
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        textAlign: 'center',
        flex: 1,
        minWidth: 80,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.2,
        }}
      >
        {typeof value === 'number'
          ? value >= 1000
            ? `${(value / 1000).toFixed(1)}k`
            : value
          : value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
    </div>
  );
}

export function ProfileCard({ user }: ProfileCardProps) {
  const joinYear = new Date(user.created_at).getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            borderRadius: '50%',
            padding: 3,
            background: 'linear-gradient(135deg, var(--green), var(--blue))',
            boxShadow: 'var(--glow-green)',
            flexShrink: 0,
          }}
        >
          <img
            src={user.avatar_url}
            alt={user.login}
            loading="lazy"
            decoding="async"
            width={80}
            height={80}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'block',
              border: '3px solid var(--bg-secondary)',
            }}
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {user.name ?? user.login}
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'var(--blue)',
              fontFamily: 'var(--font-mono)',
              marginTop: 2,
            }}
          >
            @{user.login}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Joined {joinYear}
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            borderLeft: '2px solid var(--green)',
            paddingLeft: 12,
          }}
        >
          {user.bio}
        </p>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {user.location && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📍</span> {user.location}
          </div>
        )}
        {user.company && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🏢</span> {user.company}
          </div>
        )}
        {user.blog && (
          <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🔗</span>
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {user.blog}
            </a>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8 }}>
        <StatBox label="Followers" value={user.followers} />
        <StatBox label="Following" value={user.following} />
        <StatBox label="Repos" value={user.public_repos} />
      </div>

      {/* GitHub link */}
      <motion.a
        href={user.html_url}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '10px 16px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-secondary)',
          fontSize: 14,
          fontWeight: 500,
          textDecoration: 'none',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--green)';
          e.currentTarget.style.color = 'var(--green)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        View on GitHub
      </motion.a>
    </motion.div>
  );
}
