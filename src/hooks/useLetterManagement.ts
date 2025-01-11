import { useState, useEffect } from 'react';
import type { Position, LetterState } from '../types/game';

const MIN_SPAWN_DISTANCE = 100;

export const useLetterManagement = (
  gameStarted: boolean,
  gameOver: boolean,
  isWinner: boolean,
  playerPos: Position,
  level: number
) => {
  const [letters, setLetters] = useState<LetterState[]>([]);

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

  const generateNewLetters = () => {
    const chars = ["S", "K", "R", "I", "B", "E", "R"];
    return chars.map((char) => ({
      char,
      position: getRandomPositionAwayFromPlayer(playerPos),
      collected: false,
    }));
  };

  useEffect(() => {
    if (gameStarted && !gameOver && !isWinner && letters.every(l => l.collected)) {
      setLetters(generateNewLetters());
    }
  }, [gameStarted, gameOver, isWinner, letters, playerPos]);

  return { letters, setLetters, generateNewLetters };
};