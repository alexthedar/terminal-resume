import { useState, useEffect, useRef, useCallback } from 'react';
import { MIXES } from '../data/mixes';

declare global {
  interface Window {
    Mixcloud?: {
      PlayerWidget: (iframe: HTMLIFrameElement) => Promise<{ play: () => void }>;
    };
  }
}

interface MusicPlayerProps {
  onClose: () => void;
}

export function MusicPlayer({ onClose }: MusicPlayerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedIndex !== null) {
          setSelectedIndex(null);
        } else {
          onClose();
        }
        return;
      }

      if (selectedIndex === null) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= MIXES.length) {
          setSelectedIndex(num - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onClose]);

  const autoplay = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !window.Mixcloud) return;
    window.Mixcloud.PlayerWidget(iframe).then((widget) => {
      widget.play();
    });
  }, []);

  const mix = selectedIndex !== null ? MIXES[selectedIndex] : null;
  const iframeSrc = mix
    ? `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(mix.slug)}`
    : '';

  return (
    <div className="music-player">
      <div className="terminal-content">
        {!mix ? (
          <div className="music-list">
            <h2 className="section-title">MIXES</h2>
            <div className="section-divider">{'═'.repeat(40)}</div>
            <p className="music-subtitle">DJ mixes by ALIX KAST</p>
            <div className="nav-options">
              {MIXES.map((m, i) => (
                <button
                  key={m.slug}
                  className="nav-button"
                  onClick={() => setSelectedIndex(i)}
                >
                  [{i + 1}] {m.title}
                </button>
              ))}
            </div>
            <button className="music-back-button" onClick={onClose}>
              [ESC] BACK
            </button>
          </div>
        ) : (
          <div className="music-now-playing">
            <h2 className="section-title">NOW PLAYING</h2>
            <div className="section-divider">{'═'.repeat(40)}</div>
            <p className="music-track-name">&gt; {mix.title}</p>
            <p className="music-artist">by ALIX KAST</p>
            <div className="music-iframe-wrap">
              <iframe
                ref={iframeRef}
                width="100%"
                height="60"
                src={iframeSrc}
                frameBorder="0"
                allow="autoplay"
                title={mix.title}
                onLoad={autoplay}
              />
            </div>
            <button
              className="music-back-button"
              onClick={() => setSelectedIndex(null)}
            >
              [ESC] BACK TO LIST
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
