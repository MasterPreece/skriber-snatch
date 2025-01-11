import { useCallback } from 'react';
import type { Position, LetterState, BadDotState } from '../types/game';

interface UseCollisionDetectionProps {
  playerPos: Position;
  letters: LetterState[];
  setLetters: (letters: LetterState[] | ((prev: LetterState[]) => LetterState[])) => void;
  badDots: BadDotState[];
  setGameOver: (over: boolean) => void;
  setIsWinner: (winner: boolean) => void;
  setLevel: (level: number) => void;
  setScore: (score: number) => void;
  level: number;  // Added this prop
  score: number;  // Added this prop
}

export const useCollisionDetection = ({
  playerPos,
  letters,
  setLetters,
  badDots,
  setGameOver,
  setIsWinner,
  setLevel,
  setScore,
  level,
  score,
}: UseCollisionDetectionProps) => {
  const checkLetterCollision = useCallback(() => {
    let allCollected = true;
    
    setLetters((prevLetters) =>
      prevLetters.map((letter) => {
        if (!letter.collected) {
          const distance = Math.sqrt(
            Math.pow(playerPos.x - letter.position.x, 2) +
            Math.pow(playerPos.y - letter.position.y, 2)
          );
          
          if (distance < 40) {
            return { ...letter, collected: true };
          }
          allCollected = false;
        }
        return letter;
      })
    );

    if (allCollected) {
      setIsWinner(true);
      const newLevel = level + 1;
      setLevel(newLevel);
      const newScore = score + 100;
      setScore(newScore);
    }
  }, [playerPos, setLetters, setIsWinner, setLevel, setScore, level, score]);

  const checkBadDotCollision = useCallback(() => {
    const collision = badDots.some((dot) => {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - dot.position.x, 2) +
        Math.pow(playerPos.y - dot.position.y, 2)
      );
      return distance < 32;
    });

    if (collision) {
      setGameOver(true);
    }
  }, [playerPos, badDots, setGameOver]);

  return { checkLetterCollision, checkBadDotCollision };
};