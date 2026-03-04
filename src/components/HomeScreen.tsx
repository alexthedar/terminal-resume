import { RESUME } from '../data/resume';
import { NavOptions } from './NavOptions';
import type { NavOption } from '../types';

const HOME_OPTIONS: NavOption[] = [
  { id: 'about', label: 'about', description: 'Who I am' },
  { id: 'experience', label: 'experience', description: 'Where I\'ve worked' },
  { id: 'skills', label: 'skills', description: 'What I know' },
  { id: 'education', label: 'education', description: 'Where I studied' },
  { id: 'contact', label: 'contact', description: 'Get in touch' },
];

interface HomeScreenProps {
  onNavigate: (sectionId: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="home-screen">
      <h1 className="home-name">{RESUME.name}</h1>
      <p className="home-title">{RESUME.title}</p>
      <p className="home-tagline">{RESUME.tagline}</p>
      <NavOptions options={HOME_OPTIONS} onSelect={onNavigate} />
    </div>
  );
}
