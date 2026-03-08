import { useState, useRef, useEffect, useCallback } from "react";

type Cell = "X" | "O" | null;
type Board = Cell[];

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWin(
  board: Board,
): { winner: "X" | "O"; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line };
    }
  }
  return null;
}

function findWinMove(board: Board, player: "X" | "O"): number | null {
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    const test = [...board];
    test[i] = player;
    if (checkWin(test)?.winner === player) return i;
  }
  return null;
}

function getAIMove(
  boards: Board[],
): { face: number; cell: number } | null {
  // 1. Win
  for (let f = 0; f < 6; f++) {
    const m = findWinMove(boards[f], "O");
    if (m !== null) return { face: f, cell: m };
  }
  // 2. Block
  for (let f = 0; f < 6; f++) {
    const m = findWinMove(boards[f], "X");
    if (m !== null) return { face: f, cell: m };
  }
  // 3. Prioritized: prefer boards with O pieces, centers, corners
  const available: { face: number; cell: number; priority: number }[] = [];
  for (let f = 0; f < 6; f++) {
    for (let c = 0; c < 9; c++) {
      if (boards[f][c] !== null) continue;
      let priority = 0;
      if (boards[f].some((v) => v === "O")) priority += 2;
      if (c === 4) priority += 3;
      if ([0, 2, 6, 8].includes(c)) priority += 1;
      available.push({ face: f, cell: c, priority });
    }
  }
  if (available.length === 0) return null;
  available.sort((a, b) => b.priority - a.priority);
  const top = available.filter((m) => m.priority === available[0].priority);
  return top[Math.floor(Math.random() * top.length)];
}

const FACE_TRANSFORMS = [
  "rotateY(0deg) translateZ(var(--cube-half))",
  "rotateY(180deg) translateZ(var(--cube-half))",
  "rotateY(90deg) translateZ(var(--cube-half))",
  "rotateY(-90deg) translateZ(var(--cube-half))",
  "rotateX(90deg) translateZ(var(--cube-half))",
  "rotateX(-90deg) translateZ(var(--cube-half))",
];

// View angles to see each face straight-on
const FACE_VIEW = [
  { x: 0, y: 0 },
  { x: 0, y: 180 },
  { x: 0, y: -90 },
  { x: 0, y: 90 },
  { x: -85, y: 0 },
  { x: 85, y: 0 },
];

interface TicTacToe3DProps {
  onClose: () => void;
}

export function TicTacToe3D({ onClose }: TicTacToe3DProps) {
  const [boards, setBoards] = useState<Board[]>(() =>
    Array.from({ length: 6 }, () => Array<Cell>(9).fill(null)),
  );
  const [gameOver, setGameOver] = useState<"X" | "O" | "draw" | null>(null);
  const [winFace, setWinFace] = useState<number | null>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [rotX, setRotX] = useState(-20);
  const [rotY, setRotY] = useState(-30);
  const [animating, setAnimating] = useState(false);

  const dragging = useRef(false);
  const moved = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });

  // Auto-rotate to winning face
  useEffect(() => {
    if (gameOver && winFace !== null) {
      const target = FACE_VIEW[winFace];
      setAnimating(true);
      // Normalize Y to shortest path
      let curY = ((rotY % 360) + 540) % 360 - 180;
      let tgtY = target.y;
      const diff = tgtY - curY;
      if (diff > 180) tgtY -= 360;
      else if (diff < -180) tgtY += 360;
      setRotX(target.x);
      setRotY(tgtY);
      const timer = setTimeout(() => setAnimating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [gameOver, winFace]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCellClick = useCallback(
    (face: number, cell: number) => {
      if (moved.current || gameOver) return;
      if (boards[face][cell] !== null) return;

      const newBoards = boards.map((b) => [...b]);
      newBoards[face][cell] = "X";

      const result = checkWin(newBoards[face]);
      if (result?.winner === "X") {
        setBoards(newBoards);
        setGameOver("X");
        setWinFace(face);
        setWinLine(result.line);
        return;
      }

      const ai = getAIMove(newBoards);
      if (ai) {
        newBoards[ai.face][ai.cell] = "O";
        const aiResult = checkWin(newBoards[ai.face]);
        if (aiResult?.winner === "O") {
          setBoards(newBoards);
          setGameOver("O");
          setWinFace(ai.face);
          setWinLine(aiResult.line);
          return;
        }
      }

      const totalEmpty = newBoards.reduce(
        (sum, b) => sum + b.filter((c) => c === null).length,
        0,
      );
      if (totalEmpty === 0) {
        setBoards(newBoards);
        setGameOver("draw");
        return;
      }

      setBoards(newBoards);
    },
    [boards, gameOver],
  );

  const restart = useCallback(() => {
    setBoards(Array.from({ length: 6 }, () => Array<Cell>(9).fill(null)));
    setGameOver(null);
    setWinFace(null);
    setWinLine(null);
    setRotX(-20);
    setRotY(-30);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const totalDx = e.clientX - startPos.current.x;
    const totalDy = e.clientY - startPos.current.y;
    if (!moved.current && (Math.abs(totalDx) > 5 || Math.abs(totalDy) > 5)) {
      moved.current = true;
    }
    if (moved.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      setRotY((p) => p + dx * 0.5);
      setRotX((p) => Math.max(-85, Math.min(85, p - dy * 0.5)));
    }
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        setRotY((p) => p - 15);
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        setRotY((p) => p + 15);
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        setRotX((p) => Math.max(-85, p - 15));
        e.preventDefault();
      }
      if (e.key === "ArrowDown") {
        setRotX((p) => Math.min(85, p + 15));
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="ttt-game"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="terminal-content">
        <div className="ttt-header">
          <h2 className="section-title">3D TIC-TAC-TOE</h2>
          <span className="ttt-status">
            {gameOver === "X"
              ? "YOU WIN!"
              : gameOver === "O"
                ? "CPU WINS!"
                : gameOver === "draw"
                  ? "DRAW!"
                  : "YOUR TURN (X)"}
          </span>
        </div>

        <div className="ttt-scene">
          <div
            className="ttt-cube"
            style={{
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: animating ? "transform 0.8s ease-out" : "none",
            }}
          >
            {boards.map((board, fi) => (
              <div
                key={fi}
                className={`ttt-face${winFace === fi ? " winning" : ""}`}
                style={{ transform: FACE_TRANSFORMS[fi] }}
              >
                <span className="ttt-face-num">{fi + 1}</span>
                <div className="ttt-grid">
                  {board.map((cell, ci) => (
                    <button
                      key={ci}
                      className={`ttt-cell${cell === "X" ? " x" : cell === "O" ? " o" : ""}${winFace === fi && winLine?.includes(ci) ? " win" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCellClick(fi, ci);
                      }}
                      disabled={!!cell || !!gameOver}
                    >
                      {cell}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="ttt-hint">
          {gameOver
            ? "PRESS NEW GAME TO PLAY AGAIN"
            : "DRAG OR ARROWS TO ROTATE · TAP CELL TO PLAY"}
        </p>

        <div className="ttt-buttons">
          {gameOver && (
            <button className="ttt-btn" onClick={restart}>
              NEW GAME
            </button>
          )}
          <button className="music-back-button" onClick={onClose}>
            [ESC] BACK
          </button>
        </div>
      </div>
    </div>
  );
}
