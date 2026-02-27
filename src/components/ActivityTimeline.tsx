import { motion } from 'framer-motion';
import type { Event } from '../types/github';
import { formatRelativeTime } from '../utils/dataProcessors';

interface ActivityTimelineProps {
  events: Event[];
}

interface EventConfig {
  icon: string;
  color: string;
  label: (e: Event) => string;
}

const EVENT_CONFIG: Record<string, EventConfig> = {
  PushEvent: {
    icon: '⬆️',
    color: 'var(--green)',
    label: (e) => {
      const commits = e.payload.size ?? e.payload.commits?.length ?? 1;
      return `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${e.repo.name.split('/')[1]}`;
    },
  },
  PullRequestEvent: {
    icon: '🔀',
    color: 'var(--purple)',
    label: (e) => {
      const action = e.payload.action ?? 'opened';
      const title = e.payload.pull_request?.title ?? '';
      return `${action.charAt(0).toUpperCase() + action.slice(1)} PR: ${title}`;
    },
  },
  IssuesEvent: {
    icon: '🐛',
    color: 'var(--red)',
    label: (e) => {
      const action = e.payload.action ?? 'opened';
      const title = e.payload.issue?.title ?? '';
      return `${action.charAt(0).toUpperCase() + action.slice(1)} issue: ${title}`;
    },
  },
  WatchEvent: {
    icon: '⭐',
    color: 'var(--orange)',
    label: (e) => `Starred ${e.repo.name}`,
  },
  ForkEvent: {
    icon: '🍴',
    color: 'var(--blue)',
    label: (e) => `Forked ${e.repo.name}`,
  },
  CreateEvent: {
    icon: '✨',
    color: 'var(--green)',
    label: (e) => `Created ${e.payload.ref ? `branch ${e.payload.ref}` : 'repository'} in ${e.repo.name.split('/')[1]}`,
  },
  DeleteEvent: {
    icon: '🗑️',
    color: 'var(--red)',
    label: (e) => `Deleted branch in ${e.repo.name.split('/')[1]}`,
  },
  IssueCommentEvent: {
    icon: '💬',
    color: 'var(--blue)',
    label: (e) => `Commented on issue in ${e.repo.name.split('/')[1]}`,
  },
  ReleaseEvent: {
    icon: '🚀',
    color: 'var(--purple)',
    label: (e) => `Released in ${e.repo.name.split('/')[1]}`,
  },
};

const DEFAULT_CONFIG: EventConfig = {
  icon: '📌',
  color: 'var(--text-muted)',
  label: (e) => `${e.type.replace('Event', '')} in ${e.repo.name.split('/')[1]}`,
};

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 24,
          color: 'var(--text-muted)',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        No recent public activity
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 24,
      }}
    >
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: 'var(--text-primary)' }}>
        Recent Activity
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {events.slice(0, 15).map((event, i) => {
          const config = EVENT_CONFIG[event.type] ?? DEFAULT_CONFIG;
          const label = config.label(event);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              style={{ display: 'flex', gap: 14, paddingBottom: 16 }}
            >
              {/* Timeline line + dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    border: `1px solid ${config.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {config.icon}
                </div>
                {i < Math.min(events.length, 15) - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      background: 'var(--border-muted)',
                      marginTop: 4,
                      minHeight: 12,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: 6 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                  {formatRelativeTime(event.created_at)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
