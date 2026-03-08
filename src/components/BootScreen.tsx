import { useState, useEffect } from 'react';

// Hardcoded figlet-style ASCII art using standard ASCII characters
const ASCII_ARTS = [
  // ALEXTHEDAR
  [
    '    _    _     _______  _______ _   _ _____ ____    _    ____  ',
    '   / \\  | |   | ____\\ \\/ /_   _| | | | ____|  _ \\  / \\  |  _ \\ ',
    '  / _ \\ | |   |  _|  \\  /  | | | |_| |  _| | | | |/ _ \\ | |_) |',
    ' / ___ \\| |___| |___ /  \\  | | |  _  | |___| |_| / ___ \\|  _ < ',
    '/_/   \\_\\_____|_____/_/\\_\\ |_| |_| |_|_____|____/_/   \\_\\_| \\_\\',
  ],
  // CALM FROM CHAOS
  [
    '  ____    _    _     __  __ ',
    ' / ___|  / \\  | |   |  \\/  |',
    '| |     / _ \\ | |   | |\\/| |',
    '| |___ / ___ \\| |___| |  | |',
    ' \\____/_/   \\_\\_____|_|  |_|',
    '',
    ' _____ ____   ___  __  __ ',
    '|  ___|  _ \\ / _ \\|  \\/  |',
    '| |_  | |_) | | | | |\\/| |',
    '|  _| |  _ <| |_| | |  | |',
    '|_|   |_| \\_\\\\___/|_|  |_|',
    '',
    '  ____ _   _    _    ___  ____  ',
    ' / ___| | | |  / \\  / _ \\/ ___| ',
    '| |   | |_| | / _ \\| | | \\___ \\ ',
    '| |___|  _  |/ ___ \\ |_| |___) |',
    ' \\____|_| |_/_/   \\_\\___/|____/ ',
  ],
  // ALEXANDAR CASTANEDA
  [
    '    _    _     _______  __    _    _   _ ____    _    ____  ',
    '   / \\  | |   | ____\\ \\/ /  / \\  | \\ | |  _ \\  / \\  |  _ \\ ',
    '  / _ \\ | |   |  _|  \\  /  / _ \\ |  \\| | | | |/ _ \\ | |_) |',
    ' / ___ \\| |___| |___ /  \\ / ___ \\| |\\  | |_| / ___ \\|  _ < ',
    '/_/   \\_\\_____|_____/_/\\_/_/   \\_\\_| \\_|____/_/   \\_\\_| \\_\\',
    '',
    '  ____    _    ____ _____  _    _   _ _____ ____    _    ',
    ' / ___|  / \\  / ___|_   _|/ \\  | \\ | | ____|  _ \\  / \\   ',
    '| |     / _ \\ \\___ \\ | | / _ \\ |  \\| |  _| | | | |/ _ \\  ',
    '| |___ / ___ \\ ___) || |/ ___ \\| |\\  | |___| |_| / ___ \\ ',
    ' \\____/_/   \\_\\____/ |_/_/   \\_\\_| \\_|_____|____/_/   \\_\\',
  ],
];

function getAsciiLines(): string[] {
  return ASCII_ARTS[Math.floor(Math.random() * ASCII_ARTS.length)];
}

function buildBootLines(asciiLines: string[]) {
  const lines: { text: string; delay: number; isAscii?: boolean }[] = [
    { text: 'BIOS v2.4.1', delay: 0 },
    { text: 'Memory test.......... OK', delay: 400 },
    { text: 'CPU check............. OK', delay: 700 },
    { text: '', delay: 1000 },
    ...asciiLines.map((line, i) => ({
      text: line,
      delay: 1100 + i * 80,
      isAscii: true,
    })),
    { text: '', delay: 1100 + asciiLines.length * 80 + 200 },
    { text: 'Loading profile....... OK', delay: 1100 + asciiLines.length * 80 + 400 },
    { text: 'Initializing terminal session...', delay: 1100 + asciiLines.length * 80 + 800 },
    { text: '', delay: 1100 + asciiLines.length * 80 + 1400 },
  ];
  const completeDelay = 1100 + asciiLines.length * 80 + 2000;
  return { lines, completeDelay };
}

interface BootScreenProps {
  onComplete: () => void;
  waitForKey?: boolean;
}

export function BootScreen({ onComplete, waitForKey }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);
  const [bootData] = useState(() => {
    const asciiLines = getAsciiLines();
    return buildBootLines(asciiLines);
  });
  const { lines, completeDelay } = bootData;

  useEffect(() => {
    const timers = lines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    const doneTimer = setTimeout(() => {
      if (waitForKey) {
        setDone(true);
      } else {
        onComplete();
      }
    }, completeDelay);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, [onComplete, lines, completeDelay, waitForKey]);

  useEffect(() => {
    if (!done) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onComplete();
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [done, onComplete]);

  return (
    <div className="boot-screen">
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className={`boot-line${line.isAscii ? ' ascii-art' : ''}`}>{line.text}</div>
      ))}
      {visibleLines < lines.length && <span className="cursor">_</span>}
      {done && <div className="boot-line" style={{ marginTop: '1rem' }}>PRESS ENTER TO CONTINUE</div>}
    </div>
  );
}
