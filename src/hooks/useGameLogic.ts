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
  setLetters: (value: LetterState[] | ((prev: LetterState[]) => LetterState[])) => void,
  setBadDots: (value: BadDotState[] | ((prev: BadDotState[]) => BadDotState[])) => void,
  setIsWinner: (winner: boolean) => void,
  setGameOver: (over: boolean) => void,
  setLevel: (value: number) => void,
  setScore: (score: number) => void,
) => {
  const checkCollision = useCallback(() => {
    if (!gameStarted || gameOver || isWinner) return;

    // Count collected letters before updating
    const collectedLetters = letters.filter(l => l.collected).length;
    let letterCollectedThisCheck = false;

    setLetters((prevLetters: LetterState[]) => {
      return prevLetters.map((letter) => {
        if (!letter.collected) {
          const distance = Math.sqrt(
            Math.pow(playerPos.x - letter.position.x, 2) +
            Math.pow(playerPos.y - letter.position.y, 2)
          );
          if (distance < 30) {
            letterCollectedThisCheck = true;
            return {
              ...letter,
              collected: true,
            };
          }
        }
        return letter;
      });
    });

    // Check if player has collected all 7 letters
    if (letterCollectedThisCheck && collectedLetters === 6) { // If we just collected the 7th letter
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setScore(nextLevel);

      // Generate new letters for the next level
      const chars = ["S", "K", "R", "I", "B", "E", "R"];
      const newLetters = chars.map((char) => ({
        char,
        position: {
          x: Math.floor(Math.random() * 300),
          y: Math.floor(Math.random() * 300),
        },
        collected: false,
      }));
      setLetters(newLetters);

      // Add an additional bad dot for the new level
      setBadDots(prevDots => [
        ...prevDots,
        {
          position: {
            x: Math.floor(Math.random() * 300),
            y: Math.floor(Math.random() * 300),
          },
          speed: 1,
        }
      ]);
    }
  }, [playerPos, level, setLetters, setLevel, setScore, gameStarted, gameOver, isWinner, setBadDots, letters]);

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