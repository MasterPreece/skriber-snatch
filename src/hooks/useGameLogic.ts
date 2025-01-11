import { useEffect, useCallback, useState } from 'react';
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
  const [canMove, setCanMove] = useState(true);

  const getRandomPosition = (): Position => ({
    x: Math.floor(Math.random() * 300),
    y: Math.floor(Math.random() * 300),
  });

  const initializeLevel = useCallback(() => {
    const chars = ["S", "K", "R", "I", "B", "E", "R"];
    const newLetters = chars.map((char) => ({
      char,
      position: getRandomPosition(),
      collected: false,
    }));

    const baseSpeed = 1 + (level * 0.5);
    const maxBadDots = Math.min(level, 10);
    
    const newBadDots: BadDotState[] = Array(maxBadDots).fill(null).map(() => ({
      position: getRandomPosition(),
      speed: baseSpeed,
    }));

    setLetters(newLetters);
    setBadDots(newBadDots);
    
    // Pause bad dot movement for 0.5 seconds when level starts
    setCanMove(false);
    setTimeout(() => {
      setCanMove(true);
    }, 500);
  }, [level, setLetters, setBadDots]);

  const checkCollision = useCallback(() => {
    if (!gameStarted || gameOver || isWinner) return;

    let allCollected = true;
    const newLetters = letters.map((letter) => {
      if (!letter.collected) {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - letter.position.x, 2) +
          Math.pow(playerPos.y - letter.position.y, 2)
        );
        if (distance < 30) {
          return { ...letter, collected: true };
        }
        allCollected = false;
      }
      return letter;
    });

    // Only update letters if there's a change
    const hasLettersChanged = JSON.stringify(letters) !== JSON.stringify(newLetters);
    
    if (hasLettersChanged) {
      setLetters(newLetters);
      
      // If all letters are collected, advance to next level
      if (allCollected) {
        setLevel(level + 1);
        setScore(level);
        // Initialize the next level immediately
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
    if (!gameStarted || gameOver || isWinner || !canMove) return;

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
  }, [playerPos, gameStarted, gameOver, isWinner, badDots, setBadDots, canMove]);

  // Check for collision with bad dots
  useEffect(() => {
    if (!gameStarted || gameOver || isWinner) return;

    const checkBadDotCollision = () => {
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
    };

    checkBadDotCollision();
  }, [playerPos, badDots, gameStarted, gameOver, isWinner, setGameOver]);

  return { checkCollision };
};