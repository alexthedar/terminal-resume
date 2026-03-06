import { useRef, useCallback, useState, useEffect } from 'react';
import { RESUME } from '../data/resume';
import { NavOptions } from './NavOptions';
import type { NavOption } from '../types';

export const HOME_OPTIONS: NavOption[] = [
  { id: 'about', label: 'about', description: 'Who I am' },
  { id: 'experience', label: 'experience', description: 'Where I\'ve worked' },
  { id: 'skills', label: 'skills', description: 'What I know' },
  { id: 'education', label: 'education', description: 'Where I studied' },
  { id: 'contact', label: 'contact', description: 'Get in touch' },
];

const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

interface HomeScreenProps {
  onNavigate: (sectionId: string) => void;
  onOpenCommand: () => void;
  commandMode: boolean;
  onCloseCommand: () => void;
}

export function HomeScreen({ onNavigate, onOpenCommand, commandMode, onCloseCommand }: HomeScreenProps) {
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleNameClick = useCallback((e: React.MouseEvent) => {
    if (!isTouchDevice()) return;
    e.stopPropagation();

    if (commandMode) {
      onCloseCommand();
      return;
    }

    tapCount.current++;
    clearTimeout(tapTimer.current);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      onOpenCommand();
    } else {
      tapTimer.current = setTimeout(() => {
        tapCount.current = 0;
      }, 600);
    }
  }, [onOpenCommand, commandMode, onCloseCommand]);

  return (
    <div className="home-screen">
      <h1 className="home-name" onClick={handleNameClick}>{RESUME.name}</h1>
      <p className="home-title">
        {RESUME.title.split(' · ').map((part, i, arr) => (
          <span key={i}>
            {part}{i < arr.length - 1 && <span className="home-title-dot"> · </span>}
          </span>
        ))}
      </p>
      <p className="home-tagline">{RESUME.tagline}</p>
      <NavOptions options={HOME_OPTIONS} onSelect={onNavigate} />
      <EasterEggHint onOpenCommand={onOpenCommand} commandMode={commandMode} />
    </div>
  );
}

function EasterEggHint({ onOpenCommand, commandMode }: { onOpenCommand: () => void; commandMode: boolean }) {
  const [showHint, setShowHint] = useState(false);
  const isTouch = isTouchDevice();

  useEffect(() => {
    if (commandMode) {
      setShowHint(false);
      return;
    }

    const hintTimer = setTimeout(() => setShowHint(true), 10000);
    const autoOpen = setTimeout(() => {
      if (!commandMode) onOpenCommand();
    }, 60000);

    return () => {
      clearTimeout(hintTimer);
      clearTimeout(autoOpen);
    };
  }, [commandMode, onOpenCommand]);

  if (!showHint || commandMode) return null;

  return (
    <p className="easter-egg-hint">
      {isTouch ? 'triple tap the name...' : 'press 0...'}
    </p>
  );
}
