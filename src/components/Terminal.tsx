import { useState, useRef, useEffect, useCallback } from 'react';
import { RESUME } from '../data/resume';
import { BootScreen } from './BootScreen';
import { HomeScreen, HOME_OPTIONS } from './HomeScreen';
import { SectionScreen } from './SectionScreen';

export function Terminal() {
  const [booting, setBooting] = useState(true);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const skipRef = useRef<(() => void) | null>(null);

  const handleNavigate = useCallback((sectionId: string) => {
    if (sectionId === 'home') {
      setCurrentSection(null);
    } else {
      setCurrentSection(sectionId);
    }
  }, []);

  const handleClick = () => {
    skipRef.current?.();
  };

  const section = currentSection ? RESUME.sections[currentSection] : null;

  // Get current nav options for keyboard handling
  const currentOptions = section ? section.navOptions : (!booting ? HOME_OPTIONS : []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (booting) return;

      if (e.key === 'Escape') {
        setCurrentSection(null);
        return;
      }

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

      const num = parseInt(e.key);
      if (num >= 1 && num <= currentOptions.length) {
        handleNavigate(currentOptions[num - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [booting, currentOptions, section, handleNavigate]);

  const handleBootComplete = useCallback(() => {
    setBooting(false);
  }, []);

  return (
    <div className="terminal" onClick={handleClick}>
      <div className="scanlines" />
      <div className="crt-flicker" />
      <div className="terminal-content">
        {booting && <BootScreen onComplete={handleBootComplete} />}

        {!booting && !section && <HomeScreen onNavigate={handleNavigate} />}

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
    </div>
  );
}
