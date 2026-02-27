import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading: boolean;
  initialValue?: string;
}

const STORAGE_KEY = 'devpulse_recent_searches';
const MAX_RECENT = 5;

export function SearchBar({ onSearch, loading, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      setRecent(Array.isArray(stored) ? stored : []);
    } catch {
      setRecent([]);
    }
  }, []);

  const saveRecent = (username: string) => {
    const updated = [username, ...recent.filter((r) => r !== username)].slice(0, MAX_RECENT);
    setRecent(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    saveRecent(trimmed);
    onSearch(trimmed);
  };

  const handleChipClick = (username: string) => {
    setValue(username);
    saveRecent(username);
    onSearch(username);
  };

  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex',
            gap: 10,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '6px 6px 6px 16px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={() => {
            (document.activeElement?.parentElement as HTMLElement)?.style &&
              ((document.activeElement?.parentElement as HTMLElement).style.borderColor = 'var(--green)');
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter GitHub username..."
            disabled={loading}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 16,
              letterSpacing: '0.02em',
            }}
          />
          <motion.button
            type="submit"
            disabled={loading || !value.trim()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: loading ? 'var(--bg-tertiary)' : 'var(--green)',
              color: loading ? 'var(--text-secondary)' : '#0D1117',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '10px 22px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 14,
              cursor: loading || !value.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {recent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 14,
              alignItems: 'center',
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Recent:</span>
            {recent.map((username) => (
              <motion.button
                key={username}
                onClick={() => handleChipClick(username)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  padding: '3px 12px',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--green)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                }}
              >
                {username}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
