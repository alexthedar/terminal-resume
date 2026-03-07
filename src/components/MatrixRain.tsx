import { useEffect, useRef } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`";
const FONT_SIZE = 14;
const FADE_ALPHA = 0.05;
const TICK_MS = 50;

const PHRASES = [
  "REACT",
  "REACT-NATIVE",
  "TYPESCRIPT",
  "NODEJS",
  "NESTJS",
  "KOAJS",
  "SENIOR ENGINEER",
  "JAVASCRIPT",
  "ALEXANDAR CASTANEDA",
  "CALM FROM CHAOS",
  "WEB",
  "MOBILE",
  "CLAUDE",
  "REDUX",
];

const SPAWN_INTERVAL_MS = 5000;

// Each letter in a word goes through: falling → deposited → holding → erasing (rain washes over it)
type LetterPhase = "falling" | "deposited" | "erasing" | "done";

interface WordLetter {
  char: string;
  col: number;
  targetRow: number;
  phase: LetterPhase;
  dropRow: number; // position of the rain stream carrying/erasing this letter
}

interface Word {
  letters: WordLetter[];
  holdTimer: number; // ticks to hold after all letters deposited
  eraseStarted: boolean;
}

interface MatrixRainProps {
  onClose: () => void;
}

export function MatrixRain({ onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const columns = Math.floor(canvas.width / FONT_SIZE);
    const rows = Math.floor(canvas.height / FONT_SIZE);
    const drops: number[] = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * -30),
    );

    const words: Word[] = [];
    let lastSpawn = Date.now() - SPAWN_INTERVAL_MS + 1500;
    let usedIndices: number[] = [];

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const interval = setInterval(() => {
      // Fade
      ctx.fillStyle = `rgba(0, 0, 0, ${FADE_ALPHA})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px monospace`;

      // Normal rain columns
      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle =
          drops[i] * FONT_SIZE < FONT_SIZE * 2
            ? "#ffffff"
            : `rgba(0, 255, 65, ${0.7 + Math.random() * 0.3})`;
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Spawn new words
      const now = Date.now();
      if (now - lastSpawn > SPAWN_INTERVAL_MS) {
        lastSpawn = now;

        if (usedIndices.length >= PHRASES.length) usedIndices = [];
        let idx: number;
        do {
          idx = Math.floor(Math.random() * PHRASES.length);
        } while (usedIndices.includes(idx));
        usedIndices.push(idx);

        const text = PHRASES[idx];
        const maxCol = columns - text.length;
        if (maxCol > 0) {
          const startCol = Math.floor(Math.random() * maxCol);
          const targetRow = Math.floor(
            rows * 0.15 + Math.random() * rows * 0.65,
          );

          // Randomize the order letters arrive so it looks organic
          const fallOrder = text.split("").map((_, i) => i);
          for (let i = fallOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fallOrder[i], fallOrder[j]] = [fallOrder[j], fallOrder[i]];
          }

          const letters: WordLetter[] = text.split("").map((char, c) => ({
            char,
            col: startCol + c,
            targetRow,
            phase: "falling" as LetterPhase,
            // Stagger based on random order, not left-to-right
            dropRow:
              -3 - fallOrder.indexOf(c) * Math.floor(targetRow * 0.4 + 4),
          }));

          words.push({ letters, holdTimer: 0, eraseStarted: false });
        }
      }

      // Animate words
      for (let w = words.length - 1; w >= 0; w--) {
        const word = words[w];
        const allDeposited = word.letters.every((l) => l.phase !== "falling");
        const allDone = word.letters.every((l) => l.phase === "done");

        if (allDone) {
          words.splice(w, 1);
          continue;
        }

        // Once all letters deposited, hold then start erasing
        if (allDeposited && !word.eraseStarted) {
          word.holdTimer++;
          if (word.holdTimer > 50) {
            // ~2.5s hold
            word.eraseStarted = true;
            // Start erase rain streams staggered — each needs to travel
            // from top to targetRow, so offset each by that distance + a gap
            const eraseOrder = word.letters.map((_, i) => i);
            // Shuffle the erase order so it doesn't look uniform
            for (let i = eraseOrder.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [eraseOrder[i], eraseOrder[j]] = [eraseOrder[j], eraseOrder[i]];
            }
            word.letters.forEach((l, c) => {
              if (l.phase === "deposited") {
                l.phase = "erasing";
                const order = eraseOrder.indexOf(c);
                l.dropRow = -3 - order * Math.floor(l.targetRow * 0.4 + 4);
              }
            });
          }
        }

        for (const letter of word.letters) {
          if (letter.phase === "falling") {
            // Rain stream falling toward target row
            if (letter.dropRow >= 0) {
              // Green trail above the head
              for (let t = 1; t <= 4; t++) {
                const trailRow = letter.dropRow - t;
                if (trailRow >= 0) {
                  const trailChar =
                    CHARS[Math.floor(Math.random() * CHARS.length)];
                  const trailAlpha = 0.5 - t * 0.1;
                  ctx.fillStyle = `rgba(0, 255, 65, ${trailAlpha})`;
                  ctx.fillText(
                    trailChar,
                    letter.col * FONT_SIZE,
                    trailRow * FONT_SIZE,
                  );
                }
              }

              // White leading head
              ctx.fillStyle = "#ffffff";
              const headChar =
                letter.dropRow === letter.targetRow
                  ? letter.char
                  : CHARS[Math.floor(Math.random() * CHARS.length)];
              ctx.fillText(
                headChar,
                letter.col * FONT_SIZE,
                letter.dropRow * FONT_SIZE,
              );
            }

            letter.dropRow++;

            // When the stream passes the target row, deposit the letter
            if (letter.dropRow > letter.targetRow + 4) {
              letter.phase = "deposited";
            }
          }

          if (letter.phase === "deposited") {
            // Keep the deposited letter bright on screen
            ctx.fillStyle = "#00ff41";
            ctx.font = `bold ${FONT_SIZE}px monospace`;
            ctx.fillText(
              letter.char,
              letter.col * FONT_SIZE,
              letter.targetRow * FONT_SIZE,
            );
            ctx.font = `${FONT_SIZE}px monospace`;
          }

          if (letter.phase === "erasing") {
            // Keep drawing the letter until the erase stream reaches it
            if (letter.dropRow < letter.targetRow) {
              ctx.fillStyle = "#00ff41";
              ctx.font = `bold ${FONT_SIZE}px monospace`;
              ctx.fillText(
                letter.char,
                letter.col * FONT_SIZE,
                letter.targetRow * FONT_SIZE,
              );
              ctx.font = `${FONT_SIZE}px monospace`;
            }

            // Erase rain stream falling down
            if (letter.dropRow >= 0) {
              for (let t = 1; t <= 4; t++) {
                const trailRow = letter.dropRow - t;
                if (trailRow >= 0) {
                  const trailChar =
                    CHARS[Math.floor(Math.random() * CHARS.length)];
                  const trailAlpha = 0.5 - t * 0.1;
                  ctx.fillStyle = `rgba(0, 255, 65, ${trailAlpha})`;
                  ctx.fillText(
                    trailChar,
                    letter.col * FONT_SIZE,
                    trailRow * FONT_SIZE,
                  );
                }
              }

              ctx.fillStyle = "#ffffff";
              ctx.fillText(
                CHARS[Math.floor(Math.random() * CHARS.length)],
                letter.col * FONT_SIZE,
                letter.dropRow * FONT_SIZE,
              );
            }

            letter.dropRow++;

            // Once the erase stream passes well below the letter, it's gone
            if (letter.dropRow > letter.targetRow + 6) {
              letter.phase = "done";
            }
          }
        }
      }
    }, TICK_MS);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="matrix-rain" onClick={onClose}>
      <canvas ref={canvasRef} />
      <div className="matrix-hint">PRESS ESC OR TAP TO EXIT</div>
    </div>
  );
}
