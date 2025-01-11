import { useState, useCallback } from 'react';
import type { LetterState, BadDotState, Position } from '../types/game';

const MIN_SPAWN_DISTANCE = 100;

export const useGameElements = () => {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [badDots, setBadDots] = useState<BadDotState[]>([]);

  const getRandomPositionAwayFromPlayer = useCallback((playerPos: Position): Position => {
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * 300),
        y: Math.floor(Math.random() * 300),
      };
      const distance = Math.sqrt(
        Math.pow(position.x - playerPos.x, 2) + 
        Math.pow(position.y - playerPos.y, 2)
      );
      if (distance >= MIN_SPAWN_DISTANCE) {
        break;
      }
    } while (true);
    
    return position;
  }, []);

  const resetElements = () => {
    setLetters([]);
    setBadDots([]);
  };

  return {
    letters,
    setLetters,
    badDots,
    setBadDots,
    getRandomPositionAwayFromPlayer,
    resetElements
  };
};