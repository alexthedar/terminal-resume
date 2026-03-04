import { useState, useEffect, useCallback } from 'react';

export function useTypewriter(text: string, speed: number = 15) {
  const [charIndex, setCharIndex] = useState(0);
  const [prevText, setPrevText] = useState(text);

  if (text !== prevText) {
    setPrevText(text);
    setCharIndex(0);
  }

  const isComplete = !text || charIndex >= text.length;
  const displayedText = text ? text.slice(0, charIndex) : '';

  useEffect(() => {
    if (isComplete || !text) return;

    const interval = setInterval(() => {
      setCharIndex((prev) => prev + 1);
    }, speed);

    return () => clearInterval(interval);
  }, [isComplete, text, speed]);

  const skip = useCallback(() => {
    setCharIndex(text.length);
  }, [text]);

  return { displayedText, isComplete, skip };
}
