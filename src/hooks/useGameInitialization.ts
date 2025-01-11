import { useCallback } from 'react';
import type { Position, LetterState, BadDotState } from '../types/game';

const PLAYER_EMOJIS = ["🍆", "🥑", "🍎", "🍊", "🍇", "🍓", "🍌", "🥝", "🍍", "🥭"];

const getRandomPosition = (min: number = 50, max: number = 250): Position => ({
  x: Math.floor(Math.random() * (max - min) + min),
  y: Math.floor(Math.random() * (max - min) + min),
});

export const useGameInitialization = (
  setLetters: (letters: LetterState[]) => void,
  setBadDots: (dots: BadDotState[]) => void,
  setPlayerPos: (pos: Position) => void,
  setLevel: (level: number) => void,
  setScore: (score: number) => void,
  setIsWinner: (winner: boolean) => void,
  setGameOver: (over: boolean) => void,
  setGameStarted: (started: boolean) => void,
) => {
  const initializeGame = useCallback(() => {
    // Initialize letters for the first level
    const chars = ["S", "K", "R", "I", "B", "E", "R"];
    const newLetters = chars.map((char) => ({
      char,
      position: getRandomPosition(),
      collected: false,
    }));

    // Initialize one bad dot for the first level
    const newBadDots: BadDotState[] = [{
      position: getRandomPosition(),
      speed: 1, // Initial speed for level 1
    }];

    // Set random player emoji
    const randomEmoji = PLAYER_EMOJIS[Math.floor(Math.random() * PLAYER_EMOJIS.length)];
    (window as any).currentPlayerEmoji = randomEmoji;

    // Initialize game state
    setLetters(newLetters);
    setBadDots(newBadDots);
    setPlayerPos({ x: 30, y: 30 });
    setLevel(1);
    setScore(0);
    setIsWinner(false);
    setGameOver(false);
    setGameStarted(true);

    console.log("Game initialized with", newLetters.length, "letters and", newBadDots.length, "bad dots");
  }, [setLetters, setBadDots, setPlayerPos, setLevel, setScore, setIsWinner, setGameOver, setGameStarted]);

  return { initializeGame };
};