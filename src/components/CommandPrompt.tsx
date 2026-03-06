import { useState, useRef, useEffect } from "react";

const COMMANDS: Record<string, string> = {
  help: `help   — Show available commands
music  — Play some tunes
snake  — Play a game of snake`,
  music: `Coming soon...`,
  snake: `Coming soon...`,
};

interface CommandPromptProps {
  onClose: () => void;
}

interface HistoryEntry {
  command: string;
  output: string;
}

export function CommandPrompt({ onClose }: CommandPromptProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    setInput("");

    if (!cmd) return;

    if (cmd === "exit" || cmd === "quit" || cmd === "back") {
      onClose();
      return;
    }

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    const output =
      COMMANDS[cmd] ?? `Unknown command: ${cmd}. Type "help" for options.`;
    setHistory((prev) => [...prev, { command: cmd, output }]);
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
