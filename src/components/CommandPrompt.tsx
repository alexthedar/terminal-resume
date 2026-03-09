import { useState, useRef, useEffect } from "react";
import { RESUME } from "../data/resume";

const SECTIONS = Object.keys(RESUME.sections);

const HELP_TEXT = `help   — Show available commands
ls     — List sections
cd     — Navigate to a section
music  — Play some tunes
snake  — Play a game of snake
matrix — Enter the matrix
ttt    — 3D tic-tac-toe
calm   — Restore signal
clear  — Clear the screen
exit   — Close prompt`;

interface CommandPromptProps {
  onClose: () => void;
  onMusic: () => void;
  onSnake: () => void;
  onMatrix: () => void;
  onTTT: () => void;
  onBoot: () => void;
  onGlitch: (variant: number, hold: boolean) => void;
  onCalm: () => void;
  onChaos: () => void;
  onNavigate: (sectionId: string) => void;
}

interface HistoryEntry {
  command: string;
  output: string;
}

export function CommandPrompt({ onClose, onMusic, onSnake, onMatrix, onTTT, onBoot, onGlitch, onCalm, onChaos, onNavigate }: CommandPromptProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { command: "", output: 'type "help" for commands' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const addOutput = (command: string, output: string) => {
    setHistory((prev) => [...prev, { command, output }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim().toLowerCase();
    setInput("");

    if (!raw) return;

    if (raw === "exit" || raw === "quit" || raw === "back") {
      onClose();
      return;
    }

    if (raw === "clear") {
      setHistory([]);
      return;
    }

    if (raw === "help") {
      addOutput(raw, HELP_TEXT);
      return;
    }

    if (raw === "music") {
      onMusic();
      return;
    }

    if (raw === "snake") {
      onSnake();
      return;
    }

    if (raw === "matrix") {
      onMatrix();
      return;
    }

    if (raw === "ttt") {
      onTTT();
      return;
    }

    if (raw === "boot") {
      onBoot();
      return;
    }

    if (raw === "calm") {
      onCalm();
      addOutput(raw, "signal restored.");
      return;
    }

    if (raw === "chaos") {
      onChaos();
      addOutput(raw, "signal destabilized.");
      return;
    }

    const glitchMatch = raw.match(/^glitch\s+(\d)(\s+hold)?$/);
    if (glitchMatch) {
      const variant = parseInt(glitchMatch[1]);
      if (variant >= 1 && variant <= 6) {
        onGlitch(variant, !!glitchMatch[2]);
        return;
      }
    }
    if (raw === "glitch") {
      addOutput(raw, "usage: glitch <1-6> [hold]\n  1 — horizontal jitter\n  2 — text warp\n  3 — scanline displacement\n  4 — roving band\n  5 — degauss wobble\n  6 — interlace flicker");
      return;
    }

    if (raw === "ls") {
      const listing = SECTIONS.map((s) => `  ${s}/`).join("\n");
      addOutput(raw, listing);
      return;
    }

    if (raw.startsWith("cd ")) {
      const target = raw.slice(3).trim().replace(/\/$/, "");
      if (target === ".." || target === "~" || target === "home") {
        onClose();
        onNavigate("home");
        return;
      }
      if (SECTIONS.includes(target)) {
        onClose();
        onNavigate(target);
        return;
      }
      addOutput(raw, `cd: no such directory: ${target}`);
      return;
    }

    if (raw === "cd") {
      addOutput(raw, `usage: cd <section>\nsections: ${SECTIONS.join(", ")}`);
      return;
    }

    addOutput(raw, `Unknown command: ${raw}. Type "help" for options.`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (!isTouch) {
        e.stopPropagation();
        onClose();
      }
    }
  };

  return (
    <div
      className="command-bar"
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current?.focus();
      }}
    >
      <div className="command-bar-history" ref={historyRef}>
        {history.map((entry, i) => (
          <div key={i} className="command-bar-entry">
            {entry.command && (
              <span className="command-bar-cmd">&gt; {entry.command}</span>
            )}
            <span className="command-bar-output">{entry.output}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="command-bar-input-row">
        <span className="command-bar-prompt">&gt;&nbsp;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="command-bar-input"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
