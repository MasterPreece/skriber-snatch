import { useCallback } from 'react';
import type { Position, LetterState, BadDotState } from '../types/game';

export const useCollisionDetection = (
  playerPos: Position,
  letters: LetterState[],
  setLetters: (letters: LetterState[]) => void,
  badDots: BadDotState[],
  level: number,
  setLevel: (level: number) => void,
  setGameOver: (over: boolean) => void
) => {
  const checkLetterCollision = useCallback(() => {
    let collectedCount = 0;
    
    setLetters((prevLetters) => {
      const newLetters = prevLetters.map((letter) => {
        if (!letter.collected) {
          const distance = Math.sqrt(
            Math.pow(playerPos.x - letter.position.x, 2) +
            Math.pow(playerPos.y - letter.position.y, 2)
          );
          if (distance < 30) {
            collectedCount++;
            return { ...letter, collected: true };
          }
        }
        return letter;
      });

      if (collectedCount > 0 && newLetters.every(l => l.collected)) {
        setLevel(level + 1);
      }

      return newLetters;
    });
  }, [playerPos, level, setLetters, setLevel]);

  const checkBadDotCollision = useCallback(() => {
    const collision = badDots.some((dot) => {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - dot.position.x - 32, 2) +
        Math.pow(playerPos.y - dot.position.y - 32, 2)
      );
      return distance < 12;
    });

    if (collision) {
      setGameOver(true);
    }
  }, [playerPos, badDots, setGameOver]);

  return { checkLetterCollision, checkBadDotCollision };
};