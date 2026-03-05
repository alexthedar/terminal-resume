import { useState, useEffect } from 'react';

const BOOT_LINES = [
  { text: 'BIOS v2.4.1', delay: 0 },
  { text: 'Memory test.......... OK', delay: 400 },
  { text: 'CPU check............. OK', delay: 700 },
  { text: 'Loading profile....... OK', delay: 1100 },
  { text: 'Initializing terminal session...', delay: 1600 },
  { text: '', delay: 2200 },
];

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    const completeTimer = setTimeout(onComplete, 2800);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="boot-screen">
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="boot-line">{line.text}</div>
      ))}
      {visibleLines < BOOT_LINES.length && <span className="cursor">_</span>}
    </div>
  );
}
