import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import type { ContributionDay } from '../types/github';

interface ContributionGraphProps {
  data: ContributionDay[];
  totalContributions: number;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const LEVEL_CLASSES = [
  'contrib-level-0',
  'contrib-level-1',
  'contrib-level-2',
  'contrib-level-3',
  'contrib-level-4',
];

function getWeeks(days: ContributionDay[]): ContributionDay[][] {
  // Pad so first day is Sunday
  const first = new Date(days[0].date);
  const startPad = first.getDay();
  const padded: (ContributionDay | null)[] = [
    ...Array(startPad).fill(null),
    ...days,
  ];
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    const week = padded.slice(i, i + 7) as ContributionDay[];
    weeks.push(week);
  }
  return weeks;
}

function getMonthLabels(weeks: ContributionDay[][]): { label: string; col: number }[] {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, col) => {
    const day = week.find(Boolean);
    if (!day) return;
    const m = new Date(day.date).getMonth();
    if (m !== lastMonth) {
      labels.push({ label: MONTHS[m], col });
      lastMonth = m;
    }
  });
  return labels;
}

export function ContributionGraph({ data, totalContributions }: ContributionGraphProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const weeks = getWeeks(data);
  const monthLabels = getMonthLabels(weeks);

  useEffect(() => {
    if (!gridRef.current) return;
    const cells = gridRef.current.querySelectorAll('.contrib-cell');
    gsap.fromTo(
      cells,
      { opacity: 0, scale: 0.4 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: { amount: 1.2, from: 'start', grid: 'auto' },
        ease: 'back.out(1.4)',
      }
    );
  }, [data]);

  const CELL = 13;
  const GAP = 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
          Contribution Activity
        </h3>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {totalContributions.toLocaleString()} contributions
        </span>
      </div>

      <div style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 4 }}>
        {/* Month labels */}
        <div style={{ display: 'flex', marginLeft: 28, marginBottom: 4, gap: 0 }}>
          {monthLabels.map(({ col }, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 28 + col * (CELL + GAP),
                fontSize: 11,
                color: 'var(--text-muted)',
              }}
            />
          ))}
          {/* Simpler approach: spacer per week */}
          {weeks.map((_, wi) => {
            const label = monthLabels.find(m => m.col === wi);
            return (
              <div
                key={wi}
                style={{
                  width: CELL + GAP,
                  flexShrink: 0,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  overflow: 'visible',
                  whiteSpace: 'nowrap',
                }}
              >
                {label ? label.label : ''}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {/* Day labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 4 }}>
            {DAYS.map((d, i) => (
              <div
                key={i}
                style={{
                  height: CELL,
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  width: 20,
                  justifyContent: 'flex-end',
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div
            ref={gridRef}
            style={{
              display: 'flex',
              gap: GAP,
            }}
          >
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di];
                  if (!day) {
                    return (
                      <div
                        key={di}
                        style={{ width: CELL, height: CELL, borderRadius: 2, background: 'transparent' }}
                      />
                    );
                  }
                  return (
                    <div
                      key={di}
                      className={`contrib-cell ${LEVEL_CLASSES[day.level]}`}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'transform 0.1s, filter 0.1s',
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          text: `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                        });
                        e.currentTarget.style.transform = 'scale(1.3)';
                        e.currentTarget.style.filter = 'brightness(1.4)';
                      }}
                      onMouseLeave={(e) => {
                        setTooltip(null);
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Less</span>
        {[0,1,2,3,4].map(l => (
          <div key={l} className={LEVEL_CLASSES[l]} style={{ width: 12, height: 12, borderRadius: 2 }} />
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>More</span>
      </div>

      {/* Tooltip (portal-like via fixed) */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 12,
            color: 'var(--text-primary)',
            pointerEvents: 'none',
            zIndex: 9999,
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </motion.div>
  );
}
