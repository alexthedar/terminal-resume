import { useState, useRef, useEffect, useCallback } from 'react';
import { RESUME } from '../data/resume';
import { BootScreen } from './BootScreen';
import { HomeScreen, HOME_OPTIONS } from './HomeScreen';
import { SectionScreen } from './SectionScreen';
import { CommandPrompt } from './CommandPrompt';
import { MusicPlayer } from './MusicPlayer';
import { SnakeGame } from './SnakeGame';

export function Terminal() {
  const [booting, setBooting] = useState(true);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [commandMode, setCommandMode] = useState(false);
  const [musicMode, setMusicMode] = useState(false);
  const [snakeMode, setSnakeMode] = useState(false);
  const skipRef = useRef<(() => void) | null>(null);

  const handleNavigate = useCallback((sectionId: string) => {
    if (sectionId === 'home') {
      setCurrentSection(null);
    } else {
      setCurrentSection(sectionId);
    }
  }, []);

  const handleClick = () => {
    if (!commandMode) skipRef.current?.();
  };

  const section = currentSection ? RESUME.sections[currentSection] : null;

  // Get current nav options for keyboard handling
  const currentOptions = section ? section.navOptions : (!booting ? HOME_OPTIONS : []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (booting) return;

      if (e.key === 'Escape') {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (commandMode && !isTouch) {
          setCommandMode(false);
        } else if (!commandMode) {
          setCurrentSection(null);
        }
        return;
      }

      if (commandMode) return;

      // Any key skips typewriter if it's still running
      if (skipRef.current) {
        skipRef.current();
        return;
      }

      // Contact section shortcuts
      if (currentSection === 'contact') {
        if (e.key === 'g') {
          window.open('https://github.com/alexthedar', '_blank');
          return;
        }
        if (e.key === 'l') {
          window.open('https://linkedin.com/in/alexandarcastaneda', '_blank');
          return;
        }
      }

      // Easter egg: press 0 on home page only (desktop)
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (e.key === '0' && !currentSection && !isTouch) {
        e.preventDefault();
        setCommandMode(true);
        return;
      }

      const num = parseInt(e.key);
      if (num >= 1 && num <= currentOptions.length) {
        handleNavigate(currentOptions[num - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [booting, commandMode, currentSection, currentOptions, section, handleNavigate]);

  const handleBootComplete = useCallback(() => {
    setBooting(false);
  }, []);

  return (
    <div className="terminal" onClick={handleClick}>
      <div className="scanlines" />
      <div className="crt-flicker" />
      <div className="terminal-content">
        {booting && <BootScreen onComplete={handleBootComplete} />}

        {!booting && !section && (
          <>
            <HomeScreen onNavigate={handleNavigate} onOpenCommand={() => setCommandMode(true)} commandMode={commandMode} onCloseCommand={() => setCommandMode(false)} />
            {commandMode && <CommandPrompt onClose={() => setCommandMode(false)} onMusic={() => { setCommandMode(false); setMusicMode(true); }} onSnake={() => { setCommandMode(false); setSnakeMode(true); }} />}
          </>
        )}

        {!booting && section && (
          <SectionScreen
            key={section.id}
            section={section}
            onNavigate={handleNavigate}
            skipRef={skipRef}
          />
        )}

        {!booting && section && (
          <button className="home-button" onClick={() => setCurrentSection(null)}>
            [ESC] HOME
          </button>
        )}
      </div>

      {musicMode && <MusicPlayer onClose={() => setMusicMode(false)} />}
      {snakeMode && <SnakeGame onClose={() => setSnakeMode(false)} />}
    </div>
  );
}
