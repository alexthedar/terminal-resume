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

export function Terminal() {
  const [booting, setBooting] = useState(true);
  const [bootWaitForKey, setBootWaitForKey] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [commandMode, setCommandMode] = useState(false);
  const [musicMode, setMusicMode] = useState(false);
  const [snakeMode, setSnakeMode] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [tttMode, setTTTMode] = useState(false);
  const [glitchType, setGlitchType] = useState<number>(0);
  const [glitchHold, setGlitchHold] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [ambientGlitch, setAmbientGlitch] = useState(true);
  const skipRef = useRef<(() => void) | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tearContainerRef = useRef<HTMLDivElement>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
          setGlitchType(0);
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
  }, [booting, commandMode, currentSection, currentOptions, section, handleNavigate, glitchHold]);

  // Glitch 5: clone content into shifted horizontal strips
  useEffect(() => {
    const container = tearContainerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    if (glitchType !== 3) {
      container.innerHTML = '';
      return;
    }

    // Generate 3-5 thin random strips (~3-5% tall each, random position and shift)
    const count = 3 + Math.floor(Math.random() * 3);
    const strips: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const top = Math.floor(Math.random() * 90) + 5; // 5-95%
      const height = 3 + Math.floor(Math.random() * 3); // 3-5% tall
      const bottom = 100 - top - height;
      const shift = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.floor(Math.random() * 6)); // 2-7px
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
  }, [glitchType]);

  // Ambient glitch: random glitch every 5-45s after boot
  useEffect(() => {
    if (booting || !ambientGlitch || chaosMode) return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 5000 + Math.random() * 40000;
      timeout = setTimeout(() => {
        const variant = Math.floor(Math.random() * 3) + 1;
        setGlitchType(variant);
        setGlitchHold(false);
        setTimeout(() => setGlitchType(0), 400 + Math.random() * 400);
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
      const variant = Math.floor(Math.random() * 3) + 1;
      setGlitchType(variant);
      setGlitchHold(false);
      setTimeout(() => setGlitchType(0), 400 + Math.random() * 400);
    };
    fire();
    const id = setInterval(fire, 800 + Math.random() * 1500);
    return () => clearInterval(id);
  }, [chaosMode]);

  const handleGlitch = useCallback((variant: number, hold: boolean) => {
    setGlitchType(variant);
    setGlitchHold(hold);
    if (!hold) {
      setTimeout(() => setGlitchType(0), 600);
    }
  }, []);

  const handleCalm = useCallback(() => {
    setChaosMode(false);
    setAmbientGlitch(false);
    setGlitchType(0);
    setGlitchHold(false);
  }, []);

  const handleChaos = useCallback(() => {
    setChaosMode(true);
  }, []);

  const handleBootComplete = useCallback(() => {
    setBooting(false);
    setBootWaitForKey(false);
  }, []);

  return (
    <div className={`terminal${glitchType ? ` glitch-${glitchType}` : ''}${glitchHold ? ' glitch-hold' : ''}`} onClick={handleClick}>
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
    </div>
  );
}
