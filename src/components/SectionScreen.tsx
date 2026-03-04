import { useTypewriter } from '../hooks/useTypewriter';
import { NavOptions } from './NavOptions';
import type { ResumeSection } from '../types';

interface SectionScreenProps {
  section: ResumeSection;
  onNavigate: (sectionId: string) => void;
  skipRef: React.MutableRefObject<(() => void) | null>;
}

export function SectionScreen({ section, onNavigate, skipRef }: SectionScreenProps) {
  const { displayedText, isComplete, skip } = useTypewriter(section.content, 15);

  skipRef.current = isComplete ? null : skip;

  return (
    <div className="section-content">
      <h2 className="section-title">&gt; {section.title}</h2>
      <div className="section-divider">──────────────────────────────</div>

      <div className="section-text">
        {displayedText}
        {!isComplete && <span className="cursor">_</span>}
      </div>

      {isComplete && <NavOptions options={section.navOptions} onSelect={onNavigate} />}
    </div>
  );
}
