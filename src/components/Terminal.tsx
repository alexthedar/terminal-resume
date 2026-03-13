import { useState, useRef, useEffect, useCallback } from 'react';
import { RESUME } from '../data/resume';
import { BootScreen } from './BootScreen';
import { HomeScreen, HOME_OPTIONS } from './HomeScreen';
import { SectionScreen } from './SectionScreen';
import { CommandPrompt } from './CommandPrompt';
import { MusicPlayer } from './MusicPlayer';
import { SnakeGame } from './SnakeGame';
import { MatrixRain } from './MatrixRain';
import { TicTacToe3D } from './TicTacToe3D';

// Pick 1-2 random glitch variants (sometimes combo)
const GLITCH_COUNT = 6;
function randomGlitchSet(): Set<number> {
  const v1 = Math.floor(Math.random() * GLITCH_COUNT) + 1;
  if (Math.random() < 0.3) {
    let v2 = Math.floor(Math.random() * GLITCH_COUNT) + 1;
    while (v2 === v1) v2 = Math.floor(Math.random() * GLITCH_COUNT) + 1;
    return new Set([v1, v2]);
  }
  return new Set([v1]);
}

export function Terminal() {
  const [booting, setBooting] = useState(true);
  const [bootWaitForKey, setBootWaitForKey] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [commandMode, setCommandMode] = useState(false);
  const [musicMode, setMusicMode] = useState(false);
  const [snakeMode, setSnakeMode] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [tttMode, setTTTMode] = useState(false);
  const [activeGlitches, setActiveGlitches] = useState<Set<number>>(new Set());
  const [glitchHold, setGlitchHold] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [ambientGlitch, setAmbientGlitch] = useState(true);
  const skipRef = useRef<(() => void) | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tearContainerRef = useRef<HTMLDivElement>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clearGlitches = useCallback(() => setActiveGlitches(new Set()), []);

  const handleNavigate = useCallback((sectionId: string) => {
    if (sectionId === 'home') {
      setCurrentSection(null);
    } else {
      setCurrentSection(sectionId);
    }
  }, []);

  const handleClick = () => {
    if (commandMode) return;

    // Triple-tap to open command prompt (mobile)
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch && !booting) {
      tapCountRef.current++;
      clearTimeout(tapTimerRef.current);
      if (tapCountRef.current >= 3) {
        tapCountRef.current = 0;
        setCommandMode(true);
        return;
      }
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 600);
    }

    skipRef.current?.();
  };

  const section = currentSection ? RESUME.sections[currentSection] : null;

  // Get current nav options for keyboard handling
  const currentOptions = section ? section.navOptions : (!booting ? HOME_OPTIONS : []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (booting) return;

      if (e.key === 'Escape') {
        if (glitchHold) {
          clearGlitches();
          setGlitchHold(false);
          return;
        }
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

      // Easter egg: press 0 to open command prompt (desktop)
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (e.key === '0' && !isTouch) {
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
  }, [booting, commandMode, currentSection, currentOptions, section, handleNavigate, glitchHold, clearGlitches]);

  // Glitch 3: clone content into shifted horizontal strips
  useEffect(() => {
    const container = tearContainerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    if (!activeGlitches.has(3)) {
      container.innerHTML = '';
      return;
    }

    // Generate 3-5 thin random strips (~3-5% tall each, random position and shift)
    const count = 3 + Math.floor(Math.random() * 3);
    const strips: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const top = Math.floor(Math.random() * 90) + 5;
      const height = 3 + Math.floor(Math.random() * 3);
      const bottom = 100 - top - height;
      const shift = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.floor(Math.random() * 6));
      strips.push([top, bottom, shift]);
    }

    container.innerHTML = '';
    for (const [top, bottom, shift] of strips) {
      const clone = content.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.top = '0';
      clone.style.left = '0';
      clone.style.right = '0';
      clone.style.bottom = '0';
      clone.style.clipPath = `inset(${top}% 0 ${bottom}% 0)`;
      clone.style.transform = `translateX(${shift}px)`;
      clone.style.pointerEvents = 'none';
      clone.style.zIndex = '3';
      clone.setAttribute('aria-hidden', 'true');
      container.appendChild(clone);
    }

    return () => {
      container.innerHTML = '';
    };
  }, [activeGlitches]);

  // Ambient glitch: random glitch every 5-45s after boot
  useEffect(() => {
    if (booting || !ambientGlitch || chaosMode) return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 5000 + Math.random() * 40000;
      timeout = setTimeout(() => {
        setActiveGlitches(randomGlitchSet());
        setGlitchHold(false);
        setTimeout(() => setActiveGlitches(new Set()), 400 + Math.random() * 400);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [booting, ambientGlitch, chaosMode]);

  // Chaos mode: rapidly cycle through glitch variants
  useEffect(() => {
    if (!chaosMode) return;
    const fire = () => {
      setActiveGlitches(randomGlitchSet());
      setGlitchHold(false);
      setTimeout(() => setActiveGlitches(new Set()), 400 + Math.random() * 400);
    };
    fire();
    const id = setInterval(fire, 800 + Math.random() * 1500);
    return () => clearInterval(id);
  }, [chaosMode]);

  const handleGlitch = useCallback((variant: number, hold: boolean) => {
    setActiveGlitches(new Set([variant]));
    setGlitchHold(hold);
    if (!hold) {
      setTimeout(() => setActiveGlitches(new Set()), 600);
    }
  }, []);

  const handleCalm = useCallback(() => {
    setChaosMode(false);
    setAmbientGlitch(false);
    setActiveGlitches(new Set());
    setGlitchHold(false);
  }, []);

  const handleChaos = useCallback(() => {
    setChaosMode(true);
  }, []);

  const handleBootComplete = useCallback(() => {
    setBooting(false);
    setBootWaitForKey(false);
  }, []);

  const glitchClasses = [...activeGlitches].map(g => `glitch-${g}`).join(' ');

  return (
    <div className={`terminal${glitchClasses ? ` ${glitchClasses}` : ''}${glitchHold ? ' glitch-hold' : ''}`} onClick={handleClick}>
      <div className="scanlines" />
      <div className="crt-flicker" />
      <div className="glitch-tear-strips" ref={tearContainerRef} />
      <div className="terminal-content" ref={contentRef}>
        {booting && <BootScreen key={String(bootWaitForKey)} onComplete={handleBootComplete} waitForKey={bootWaitForKey} />}

        {!booting && !section && (
          <HomeScreen onNavigate={handleNavigate} onOpenCommand={() => setCommandMode(true)} commandMode={commandMode} onCloseCommand={() => setCommandMode(false)} />
        )}

        {!booting && commandMode && <CommandPrompt onClose={() => setCommandMode(false)} onMusic={() => { setCommandMode(false); setMusicMode(true); }} onSnake={() => { setCommandMode(false); setSnakeMode(true); }} onMatrix={() => { setCommandMode(false); setMatrixMode(true); }} onTTT={() => { setCommandMode(false); setTTTMode(true); }} onBoot={() => { setCommandMode(false); setBootWaitForKey(true); setBooting(true); }} onGlitch={handleGlitch} onCalm={handleCalm} onChaos={handleChaos} onNavigate={handleNavigate} />}

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
      {matrixMode && <MatrixRain onClose={() => setMatrixMode(false)} />}
      {tttMode && <TicTacToe3D onClose={() => setTTTMode(false)} />}

      {/* Print-only resume layout — hidden on screen, shown when printing */}
      <div className="print-resume">
        <h1>{RESUME.name}</h1>
        <p className="print-title">{RESUME.title}</p>
        <div className="print-contact">
          github.com/alexthedar &nbsp;|&nbsp; linkedin.com/in/alexandarcastaneda
        </div>
        {['about', 'experience', 'skills', 'education'].map(id => {
          const s = RESUME.sections[id];
          return (
            <div key={id} className="print-section">
              <h2>{s.title}</h2>
              <div className="print-content">{s.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
