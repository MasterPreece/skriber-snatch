import { useEffect, useCallback } from 'react';
import type { Position, LetterState, BadDotState } from '../types/game';

export const useGameLogic = (
  gameStarted: boolean,
  gameOver: boolean,
  isWinner: boolean,
  playerPos: Position,
  letters: LetterState[],
  badDots: BadDotState[],
  timeLeft: number,
  setLetters: (value: LetterState[] | ((prev: LetterState[]) => LetterState[])) => void,
  setBadDots: (value: BadDotState[] | ((prev: BadDotState[]) => BadDotState[])) => void,
  setIsWinner: (winner: boolean) => void,
  setGameOver: (over: boolean) => void,
  setTimeLeft: (value: number | ((prev: number) => number)) => void,
  setScore: (score: number) => void,
  calculateScore: () => number
) => {
  const checkCollision = useCallback(() => {
    setLetters((prevLetters: LetterState[]) => {
      let allCollected = true;
      const newLetters = prevLetters.map((letter) => {
        if (!letter.collected) {
          const distance = Math.sqrt(
            Math.pow(playerPos.x - letter.position.x, 2) +
              Math.pow(playerPos.y - letter.position.y, 2)
          );
          if (distance < 30) {
            return {
              ...letter,
              collected: true,
            };
          }
          allCollected = false;
        }
        return letter;
      });

      if (allCollected) {
        setIsWinner(true);
        setScore(calculateScore());
      }

      return newLetters;
    });
  }, [playerPos, calculateScore, setLetters, setIsWinner, setScore]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isWinner && gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isWinner && gameStarted) {
      setGameOver(true);
    }
  }, [timeLeft, isWinner, gameStarted, gameOver, setTimeLeft, setGameOver]);

  // Bad dots movement logic
  useEffect(() => {
    if (!gameStarted || gameOver || isWinner) return;

    const moveInterval = setInterval(() => {
      setBadDots((prevDots: BadDotState[]) =>
        prevDots.map((dot) => {
          const dx = playerPos.x - dot.position.x;
          const dy = playerPos.y - dot.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 1) return dot;

          const newX = dot.position.x + (dx / distance);
          const newY = dot.position.y + (dy / distance);

          return {
            position: {
              x: Math.max(0, Math.min(300, newX)),
              y: Math.max(0, Math.min(300, newY)),
            },
          };
        })
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [playerPos, gameStarted, gameOver, isWinner, setBadDots]);

  // Check for collision with bad dots
  useEffect(() => {
    if (!gameStarted || gameOver || isWinner) return;

    const checkBadDotCollision = () => {
      const collision = badDots.some((dot) => {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - dot.position.x, 2) +
          Math.pow(playerPos.y - dot.position.y, 2)
        );
        return distance < 20;
      });

      if (collision) {
        setGameOver(true);
      }
    };

    checkBadDotCollision();
  }, [playerPos, badDots, gameStarted, gameOver, isWinner, setGameOver]);

  return { checkCollision };
};