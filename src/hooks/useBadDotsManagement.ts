import { useState, useEffect } from 'react';
import type { Position, BadDotState } from '../types/game';

const MIN_SPAWN_DISTANCE = 100;

export const useBadDotsManagement = (
  gameStarted: boolean,
  gameOver: boolean,
  isWinner: boolean,
  playerPos: Position,
  level: number
) => {
  const [badDots, setBadDots] = useState<BadDotState[]>([]);

  const getRandomPositionAwayFromPlayer = (playerPos: Position): Position => {
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
  };

  const generateNewBadDots = () => {
    const baseSpeed = 1 + (level * 0.5);
    const maxBadDots = Math.min(level, 10);
    
    return Array(maxBadDots).fill(null).map(() => ({
      position: getRandomPositionAwayFromPlayer(playerPos),
      speed: baseSpeed,
    }));
  };

  useEffect(() => {
    if (gameStarted && !gameOver && !isWinner) {
      setBadDots(generateNewBadDots());
    }
  }, [level, gameStarted, gameOver, isWinner]);

  return { badDots, setBadDots, generateNewBadDots };
};