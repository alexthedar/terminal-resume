import type { NavOption } from '../types';

interface NavOptionsProps {
  options: NavOption[];
  onSelect: (sectionId: string) => void;
}

export function NavOptions({ options, onSelect }: NavOptionsProps) {
  return (
    <div className="nav-options">
      {options.map((option, index) => (
        <button
          key={option.id}
          className="nav-button"
          onClick={() => onSelect(option.id)}
        >
          [{index + 1}] {option.label} - {option.description}
        </button>
      ))}
    </div>
  );
}
