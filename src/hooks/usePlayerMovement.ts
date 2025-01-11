import { useEffect } from 'react';
import type { Position } from '../types/game';

export const usePlayerMovement = (
  gameStarted: boolean,
  gameOver: boolean,
  isWinner: boolean,
  setPlayerPos: (value: Position | ((prev: Position) => Position)) => void,
  speed: number = 33.75  // Increased from 22.5 to 33.75 (another 1.5x faster)
) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver || isWinner) return;
      
      setPlayerPos((prev: Position) => {
        let newPos = { ...prev };
        const maxWidth = 350;
        const maxHeight = 350;

        switch (e.key) {
          case "ArrowUp":
            newPos.y = Math.max(0, prev.y - speed);
            break;
          case "ArrowDown":
            newPos.y = Math.min(maxHeight, prev.y + speed);
            break;
          case "ArrowLeft":
            newPos.x = Math.max(0, prev.x - speed);
            break;
          case "ArrowRight":
            newPos.x = Math.min(maxWidth, prev.x + speed);
            break;
        }
        return newPos;
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, gameOver, isWinner, setPlayerPos, speed]);
};