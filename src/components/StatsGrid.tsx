import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { TotalStats } from '../types/github';

interface StatsGridProps {
  stats: TotalStats;
  repoCount: number;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || target === 0) {
      setValue(target);
      return;
    }
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return { value, ref };
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  accent: string;
  index: number;
}

function StatCard({ label, value, icon, accent, index }: StatCardProps) {
  const isNumber = typeof value === 'number';
  const { value: animated, ref } = useCountUp(isNumber ? value : 0);

  const display = isNumber
    ? animated >= 1000
      ? `${(animated / 1000).toFixed(1)}k`
      : animated.toString()
    : value;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${accent}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: accent,
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      />

      <div style={{ fontSize: 28 }}>{icon}</div>

      <div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: accent,
            lineHeight: 1.1,
          }}
        >
          {display}
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            marginTop: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </div>
      </div>
    </motion.div>
  );
}

export function StatsGrid({ stats, repoCount }: StatsGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 14,
      }}
    >
      <StatCard label="Total Stars" value={stats.totalStars} icon="⭐" accent="var(--orange)" index={0} />
      <StatCard label="Total Forks" value={stats.totalForks} icon="🍴" accent="var(--blue)" index={1} />
      <StatCard label="Public Repos" value={repoCount} icon="📦" accent="var(--green)" index={2} />
      <StatCard label="Top Language" value={stats.topLanguage} icon="💻" accent="var(--purple)" index={3} />
    </div>
  );
}
