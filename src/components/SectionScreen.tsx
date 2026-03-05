import { useTypewriter } from '../hooks/useTypewriter';
import { NavOptions } from './NavOptions';
import type { ResumeSection } from '../types';

const LINK_PATTERN = /(\S+@\S+\.\S+|(?:[\w-]+\.)+(?:com|org|net|io|dev|co)(?:\/\S*)?|\d{3}-\d{3}-\d{4})/g;

function linkify(text: string) {
  const parts = text.split(LINK_PATTERN);
  return parts.map((part, i) => {
    if (LINK_PATTERN.test(part)) {
      LINK_PATTERN.lastIndex = 0;
      let href: string;
      if (part.includes('@')) {
        href = `mailto:${part}`;
      } else if (/^\d{3}-\d{3}-\d{4}$/.test(part)) {
        href = `tel:${part}`;
      } else {
        href = `https://${part}`;
      }
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="terminal-link">
          {part}
        </a>
      );
    }
    return part;
  });
}

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
        {isComplete ? linkify(displayedText) : displayedText}
        {!isComplete && <span className="cursor">_</span>}
      </div>

      {isComplete && <NavOptions options={section.navOptions} onSelect={onNavigate} />}
    </div>
  );
}
