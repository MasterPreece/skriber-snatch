import { useCallback } from 'react';
import type { Position, LetterState, BadDotState } from '../types/game';
import { useCollisionDetection } from './useCollisionDetection';

export const useGameLogic = (
  gameStarted: boolean,
  gameOver: boolean,
  isWinner: boolean,
  playerPos: Position,
  letters: LetterState[],
  badDots: BadDotState[],
  level: number,
  setLetters: (letters: LetterState[]) => void,
  setBadDots: (dots: BadDotState[]) => void,
  setIsWinner: (winner: boolean) => void,
  setGameOver: (over: boolean) => void,
  setLevel: (level: number) => void,
  setScore: (score: number) => void,
) => {
  const { checkLetterCollision, checkBadDotCollision } = useCollisionDetection(
    playerPos,
    letters,
    setLetters,
    badDots,
    level,
    setLevel,
    setGameOver
  );

  const checkCollision = useCallback(() => {
    if (!gameStarted || gameOver || isWinner) return;
    
    checkLetterCollision();
    checkBadDotCollision();
  }, [gameStarted, gameOver, isWinner, checkLetterCollision, checkBadDotCollision]);

  return { checkCollision };
};