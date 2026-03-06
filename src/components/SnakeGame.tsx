import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const TICK_MS = 150;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

function randomFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

interface SnakeGameProps {
  onClose: () => void;
}

export function SnakeGame({ onClose }: SnakeGameProps) {
  const initialSnake: Point[] = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [food, setFood] = useState<Point>(() => randomFood(initialSnake));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  const dirRef = useRef<Direction>('RIGHT');

  const changeDirection = useCallback((newDir: Direction) => {
    if (newDir !== OPPOSITE[dirRef.current]) {
      dirRef.current = newDir;
    }
  }, []);

  const restart = useCallback(() => {
    const s = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    setSnake(s);
    setFood(randomFood(s));
    dirRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setStarted(true);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (gameOver) {
        restart();
        return;
      }

      if (!started) {
        setStarted(true);
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, started, onClose, changeDirection, restart]);

  // Game loop
  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const dir = dirRef.current;
        const newHead: Point = {
          x: head.x + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0),
          y: head.y + (dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0),
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          setFood(randomFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [started, gameOver, food]);

  const handleArrow = (dir: Direction) => {
    if (gameOver) {
      restart();
      return;
    }
    if (!started) {
      setStarted(true);
    }
    changeDirection(dir);
  };

  return (
    <div className="snake-game">
      <div className="terminal-content">
        <div className="snake-header">
          <h2 className="section-title">SNAKE</h2>
          <span className="snake-score">SCORE: {score}</span>
        </div>
        <div className="section-divider">{'═'.repeat(40)}</div>

        <div className="snake-board">
          {Array.from({ length: GRID_SIZE }, (_, y) => (
            <div key={y} className="snake-row">
              {Array.from({ length: GRID_SIZE }, (_, x) => {
                const isHead = snake[0].x === x && snake[0].y === y;
                const isSnake = snake.some((s) => s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;
                return (
                  <div
                    key={x}
                    className={`snake-cell${isHead ? ' head' : isSnake ? ' body' : ''}${isFood ? ' food' : ''}`}
                  />
                );
              })}
            </div>
          ))}

          {!started && !gameOver && (
            <div className="snake-overlay">
              <p>PRESS ENTER OR TAP</p>
              <p>AN ARROW TO START</p>
            </div>
          )}

          {gameOver && (
            <div className="snake-overlay">
              <p>GAME OVER</p>
              <p>SCORE: {score}</p>
              <p className="snake-restart">PRESS ANY KEY OR ARROW TO RESTART</p>
            </div>
          )}
        </div>

        <div className="snake-controls">
          <div className="snake-controls-row">
            <button className="snake-arrow" onClick={() => handleArrow('UP')}>
              ▲
            </button>
          </div>
          <div className="snake-controls-row">
            <button className="snake-arrow" onClick={() => handleArrow('LEFT')}>
              ◀
            </button>
            <button className="snake-arrow" onClick={() => handleArrow('DOWN')}>
              ▼
            </button>
            <button className="snake-arrow" onClick={() => handleArrow('RIGHT')}>
              ▶
            </button>
          </div>
        </div>

        <button className="music-back-button" onClick={onClose}>
          [ESC] BACK
        </button>
      </div>
    </div>
  );
}
