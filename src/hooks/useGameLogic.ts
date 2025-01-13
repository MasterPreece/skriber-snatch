import { useEffect, useCallback, useRef } from 'react';
import type { Position, LetterState, BadDotState, SnowflakeState, EggState } from '../types/game';

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
  snowflake: SnowflakeState,
  setSnowflake: (value: SnowflakeState) => void,
  egg: EggState,
  setEgg: (value: EggState) => void,
  setIsEggActive: (active: boolean) => void,
) => {
  const canBadDotsMove = useRef(true);
  const isFrozen = useRef(false);
  const isEggPowerActive = useRef(false);
  const isImmune = useRef(false);

  const getRandomPosition = (): Position => ({
    x: Math.floor(Math.random() * 350),
    y: Math.floor(Math.random() * 350),
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

    const newSnowflake: SnowflakeState = {
      position: getRandomPosition(),
      collected: false,
    };

    const newEgg: EggState = {
      position: getRandomPosition(),
      collected: false,
    };

    setLetters(newLetters);
    setBadDots(newBadDots);
    setSnowflake(newSnowflake);
    setEgg(newEgg);
    setIsEggActive(false);
    
    // Set immunity at the start of each level
    isImmune.current = true;
    setTimeout(() => {
      isImmune.current = false;
    }, 250); // 0.25 seconds

    canBadDotsMove.current = false;
    setTimeout(() => {
      canBadDotsMove.current = true;
    }, 500);
  }, [level, setLetters, setBadDots, setSnowflake, setEgg, setIsEggActive]);

  const checkCollision = useCallback(() => {
    if (!gameStarted || gameOver || isWinner) return;

    // Check egg collision
    if (level % 5 === 0 && !egg.collected) {
      const eggDistance = Math.sqrt(
        Math.pow(playerPos.x - egg.position.x, 2) +
        Math.pow(playerPos.y - egg.position.y, 2)
      );
      
      if (eggDistance < 30) {
        setEgg({ ...egg, collected: true });
        isEggPowerActive.current = true;
        setIsEggActive(true);
        setTimeout(() => {
          isEggPowerActive.current = false;
          setIsEggActive(false);
        }, 5000);
      }
    }

    // Check snowflake collision
    if (!snowflake.collected) {
      const snowflakeDistance = Math.sqrt(
        Math.pow(playerPos.x - snowflake.position.x, 2) +
        Math.pow(playerPos.y - snowflake.position.y, 2)
      );
      
      if (snowflakeDistance < 30) {
        setSnowflake({ ...snowflake, collected: true });
        isFrozen.current = true;
        setTimeout(() => {
          isFrozen.current = false;
        }, 2000);
      }
    }

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

    const hasLettersChanged = JSON.stringify(letters) !== JSON.stringify(newLetters);
    
    if (hasLettersChanged) {
      setLetters(newLetters);
      
      if (allCollected) {
        setLevel(level + 1);
        setScore(level);
        setTimeout(() => initializeLevel(), 100);
      }
    }
  }, [playerPos, level, letters, gameStarted, gameOver, isWinner, setLetters, setLevel, setScore, initializeLevel, snowflake, setSnowflake, egg, setEgg, setIsEggActive]);

  useEffect(() => {
    if (gameStarted && !gameOver && !isWinner) {
      initializeLevel();
    }
  }, [gameStarted, gameOver, isWinner, initializeLevel]);

  useEffect(() => {
    if (!gameStarted || gameOver || isWinner || !canBadDotsMove.current || isFrozen.current) return;

    const moveInterval = setInterval(() => {
      const newBadDots = badDots.map((dot) => {
        const dx = isEggPowerActive.current 
          ? dot.position.x - playerPos.x  // Run away from player
          : playerPos.x - dot.position.x; // Move towards player
        const dy = isEggPowerActive.current
          ? dot.position.y - playerPos.y  // Run away from player
          : playerPos.y - dot.position.y; // Move towards player
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 1) return dot;

        const speed = dot.speed * (isEggPowerActive.current ? 0.5 : 1); // Slower when running away
        const newX = dot.position.x + (dx / distance) * speed;
        const newY = dot.position.y + (dy / distance) * speed;

        return {
          position: {
            x: Math.max(0, Math.min(350, newX)),
            y: Math.max(0, Math.min(350, newY)),
          },
          speed,
        };
      });

      setBadDots(newBadDots);
    }, 50);

    return () => clearInterval(moveInterval);
  }, [playerPos, gameStarted, gameOver, isWinner, badDots, setBadDots]);

  useEffect(() => {
    if (!gameStarted || gameOver || isWinner) return;

    const checkBadDotCollision = () => {
      if (isEggPowerActive.current || isImmune.current) return; // Can't die while egg power is active or during immunity
      
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