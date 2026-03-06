import { useEffect, useRef } from 'react';
import { MIXES } from '../data/mixes';

declare global {
  interface Window {
    Mixcloud?: {
      PlayerWidget: (iframe: HTMLIFrameElement) => Promise<{
        play: () => void;
        pause: () => void;
        events: { play: { on: (cb: () => void) => void } };
      }>;
    };
  }
}

interface MusicPlayerProps {
  onClose: () => void;
}

export function MusicPlayer({ onClose }: MusicPlayerProps) {
  const widgetsRef = useRef<({ play: () => void; pause: () => void } | null)[]>([]);

  const handleIframeLoad = (iframe: HTMLIFrameElement, index: number) => {
    if (!window.Mixcloud) return;
    window.Mixcloud.PlayerWidget(iframe).then((widget) => {
      widgetsRef.current[index] = widget;
      widget.events.play.on(() => {
        widgetsRef.current.forEach((w, i) => {
          if (i !== index && w) w.pause();
        });
      });
    }).catch(() => {});
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="music-player">
      <div className="terminal-content">
        <h2 className="section-title">MIXES</h2>
        <div className="section-divider">{'═'.repeat(40)}</div>
        <p className="music-subtitle">DJ mixes by ALIX KAST</p>
        <div className="music-mix-list">
          {MIXES.map((mix, i) => (
            <div key={mix.slug} className="music-mix-item">
              <p className="music-mix-label">&gt; {mix.title}</p>
              <div className="music-iframe-wrap">
                <iframe
                  onLoad={(e) => handleIframeLoad(e.currentTarget, i)}
                  width="100%"
                  height="60"
                  src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(mix.slug)}`}
                  frameBorder="0"
                  allow="autoplay"
                  title={mix.title}
                />
              </div>
            </div>
          ))}
        </div>
        <button className="music-back-button" onClick={onClose}>
          [ESC] BACK
        </button>
      </div>
    </div>
  );
}
