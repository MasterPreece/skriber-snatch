import { useCallback } from 'react';
import type { Position, LetterState, BadDotState } from '../types/game';

interface UseGameLogicProps {
  gameStarted: boolean;
  gameOver: boolean;
  isWinner: boolean;
  playerPos: Position;
  letters: LetterState[];
  badDots: BadDotState[];
  level: number;
  setLetters: (value: LetterState[]) => void;
  setBadDots: (value: BadDotState[]) => void;
  setIsWinner: (value: boolean) => void;
  setGameOver: (value: boolean) => void;
  setLevel: (value: number) => void;
  setScore: (value: number) => void;
  setPlayerPos: (value: Position | ((prev: Position) => Position)) => void;
}

export const useGameLogic = ({
  gameStarted,
  gameOver,
  isWinner,
  playerPos,
  letters,
  badDots,
  level,
  setLetters,
  setBadDots,
  setIsWinner,
  setGameOver,
  setLevel,
  setScore,
  setPlayerPos
}: UseGameLogicProps) => {
  const checkCollision = useCallback(() => {
    if (!gameStarted || gameOver || isWinner) return;

    // Check collision with letters
    const updatedLetters = letters.map(letter => {
      if (!letter.collected) {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - letter.position.x, 2) + 
          Math.pow(playerPos.y - letter.position.y, 2)
        );
        
        if (distance < 30) {
          return { ...letter, collected: true };
        }
      }
      return letter;
    });

    setLetters(updatedLetters);

    // Check if all letters are collected
    if (updatedLetters.every(letter => letter.collected)) {
      setIsWinner(true);
      setLevel(level + 1);
      setScore(level);
    }

    // Check collision with bad dots
    badDots.forEach(dot => {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - dot.position.x, 2) + 
        Math.pow(playerPos.y - dot.position.y, 2)
      );
      
      if (distance < 20) {
        setGameOver(true);
      }
    });

    // Update bad dots positions to chase player
    const updatedBadDots = badDots.map(dot => {
      const dx = playerPos.x - dot.position.x;
      const dy = playerPos.y - dot.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        return {
          ...dot,
          position: {
            x: dot.position.x + (dx / distance) * dot.speed,
            y: dot.position.y + (dy / distance) * dot.speed
          }
        };
      }
      return dot;
    });

    setBadDots(updatedBadDots);
  }, [gameStarted, gameOver, isWinner, playerPos, letters, badDots, level, setLetters, setBadDots, setIsWinner, setGameOver, setLevel, setScore]);

  return { checkCollision };
};