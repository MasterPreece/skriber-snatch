import { useEffect, useCallback } from 'react';
import type { Position, LetterState, BadDotState } from '../types/game';

export const useGameLogic = (
  gameStarted: boolean,
  gameOver: boolean,
  isWinner: boolean,
  playerPos: Position,
  letters: LetterState[],
  badDots: BadDotState[],
  level: number,
  setLetters: (value: LetterState[]) => void,
  setBadDots: (value: BadDotState[]) => void,
  setIsWinner: (winner: boolean) => void,
  setGameOver: (over: boolean) => void,
  setLevel: (level: number) => void,
  setScore: (score: number) => void,
) => {
  const getRandomPosition = (): Position => ({
    x: Math.floor(Math.random() * 300),
    y: Math.floor(Math.random() * 300),
  });

  const calculateDistance = (pos1: Position, pos2: Position): number => {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + 
      Math.pow(pos1.y - pos2.y, 2)
    );
  };

  const getRandomDistantPosition = (playerPosition: Position, minDistance: number): Position => {
    let position: Position;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop

    do {
      position = getRandomPosition();
      attempts++;
    } while (
      calculateDistance(position, playerPosition) < minDistance && 
      attempts < maxAttempts
    );

    return position;
  };

  const initializeLevel = useCallback(() => {
    const chars = ["S", "K", "R", "I", "B", "E", "R"];
    const newLetters = chars.map((char) => ({
      char,
      position: getRandomPosition(),
      collected: false,
    }));

    const baseSpeed = 1 + (level * 0.5);
    const maxBadDots = Math.min(level, 10);
    const minSpawnDistance = 150; // Minimum distance from player
    
    const newBadDots: BadDotState[] = Array(maxBadDots).fill(null).map(() => ({
      position: getRandomDistantPosition(playerPos, minSpawnDistance),
      speed: baseSpeed,
    }));

    setLetters(newLetters);
    setBadDots(newBadDots);
  }, [level, setLetters, setBadDots, playerPos]);

  const checkCollision = useCallback(() => {
    if (!gameStarted || gameOver || isWinner) return;

    let allCollected = true;
    const newLetters = letters.map((letter) => {
      if (!letter.collected) {
        const distance = calculateDistance(playerPos, letter.position);
        if (distance < 30) {
          return { ...letter, collected: true };
        }
        allCollected = false;
      }
      return letter;
    });

    const hasLettersChanged = JSON.stringify(letters) !== JSON.stringify(newLetters);
    
    if (hasLettersChanged) {
      setLetters(newLetters);
      
      if (allCollected) {
        setLevel(level + 1);
        setScore(level);
        setTimeout(() => initializeLevel(), 100);
      }
    }
  }, [playerPos, level, letters, gameStarted, gameOver, isWinner, setLetters, setLevel, setScore, initializeLevel]);

  // Initialize level when game starts
  useEffect(() => {
    if (gameStarted && !gameOver && !isWinner) {
      initializeLevel();
    }
  }, [gameStarted, gameOver, isWinner, initializeLevel]);

  // Bad dots movement logic
  useEffect(() => {
    if (!gameStarted || gameOver || isWinner) return;

    const moveInterval = setInterval(() => {
      const newBadDots = badDots.map((dot) => {
        const dx = playerPos.x - dot.position.x;
        const dy = playerPos.y - dot.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 1) return dot;

        const speed = dot.speed;
        const newX = dot.position.x + (dx / distance) * speed;
        const newY = dot.position.y + (dy / distance) * speed;

        return {
          position: {
            x: Math.max(0, Math.min(300, newX)),
            y: Math.max(0, Math.min(300, newY)),
          },
          speed,
        };
      });

      setBadDots(newBadDots);
    }, 50);

    return () => clearInterval(moveInterval);
  }, [playerPos, gameStarted, gameOver, isWinner, badDots, setBadDots]);

  // Check for collision with bad dots
  useEffect(() => {
    if (!gameStarted || gameOver || isWinner) return;

    const checkBadDotCollision = () => {
      const collision = badDots.some((dot) => {
        const distance = calculateDistance(
          { x: playerPos.x, y: playerPos.y },
          { x: dot.position.x + 32, y: dot.position.y + 32 }
        );
        return distance < 12;
      });

      if (collision) {
        setGameOver(true);
      }
    };

    checkBadDotCollision();
  }, [playerPos, badDots, gameStarted, gameOver, isWinner, setGameOver]);

  return { checkCollision };
};