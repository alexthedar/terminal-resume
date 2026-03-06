import { useState, useEffect } from 'react';
import { MIXES } from '../data/mixes';

const KEYS = 'abcdefghijklmnopqrstuvwxyz';

interface MusicPlayerProps {
  onClose: () => void;
}

export function MusicPlayer({ onClose }: MusicPlayerProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeIndex !== null) {
          setActiveIndex(null);
        } else {
          onClose();
        }
        return;
      }

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouch) return;

      const idx = KEYS.indexOf(e.key.toLowerCase());
      if (idx >= 0 && idx < MIXES.length) {
        setActiveIndex((prev) => {
          if (prev === idx) {
            setLoading(false);
            return null;
          }
          setLoading(true);
          return idx;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, onClose]);

  const handleToggle = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
      setLoading(false);
    } else {
      setActiveIndex(index);
      setLoading(true);
    }
  };

  return (
    <div className="music-player">
      <div className="terminal-content">
        <h2 className="section-title">MIXES</h2>
        <div className="section-divider">{'═'.repeat(40)}</div>
        <p className="music-subtitle">DJ mixes by ALIX KAST</p>
        <div className="music-mix-list">
          {MIXES.map((mix, i) => (
            <div key={mix.slug} className="music-mix-item">
              <button
                className={`music-mix-header${activeIndex === i ? ' active' : ''}`}
                onClick={() => handleToggle(i)}
              >
                <span className="music-mix-title">{activeIndex === i ? '▼' : '▶'} [{KEYS[i]}] {mix.title}</span>
                <span className="music-mix-tags">{mix.tags.join(' / ')}</span>
              </button>
              {activeIndex === i && (
                <div className="music-iframe-wrap">
                  {loading && <p className="music-loading">loading...</p>}
                  <iframe
                    width="100%"
                    height="60"
                    src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(mix.slug)}`}
                    frameBorder="0"
                    allow="autoplay"
                    title={mix.title}
                    onLoad={() => setLoading(false)}
                    style={loading ? { opacity: 0, position: 'absolute' } : undefined}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <a
          className="terminal-link music-profile-link"
          href="https://www.mixcloud.com/alixkast/"
          target="_blank"
          rel="noopener noreferrer"
        >
          more mixes on mixcloud →
        </a>
        <button className="music-back-button" onClick={onClose}>
          [ESC] BACK
        </button>
      </div>
    </div>
  );
}
