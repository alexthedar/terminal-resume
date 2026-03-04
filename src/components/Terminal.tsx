import { useState, useRef } from 'react';
import { RESUME } from '../data/resume';
import { HomeScreen } from './HomeScreen';
import { SectionScreen } from './SectionScreen';

export function Terminal() {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const skipRef = useRef<(() => void) | null>(null);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') {
      setCurrentSection(null);
    } else {
      setCurrentSection(sectionId);
    }
  };

  const handleClick = () => {
    skipRef.current?.();
  };

  const section = currentSection ? RESUME.sections[currentSection] : null;

  return (
    <div className="terminal" onClick={handleClick}>
      <div className="scanlines" />
      <div className="terminal-content">
        {!section && <HomeScreen onNavigate={handleNavigate} />}

        {section && (
          <SectionScreen
            key={section.id}
            section={section}
            onNavigate={handleNavigate}
            skipRef={skipRef}
          />
        )}

        {section && (
          <button className="home-button" onClick={() => setCurrentSection(null)}>
            [ESC] HOME
          </button>
        )}
      </div>
    </div>
  );
}
