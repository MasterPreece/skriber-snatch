import { useCallback } from 'react';
import type { Position, LetterState, BadDotState } from '../types/game';

const PLAYER_EMOJIS = ["🍆", "🥑", "🍎", "🍊", "🍇", "🍓", "🍌", "🥝", "🍍", "🥭"];

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
    // First, reset all game states
    setGameStarted(false);
    setGameOver(false);
    setIsWinner(false);
    setLetters([]);
    setBadDots([]);
    setLevel(1);
    setScore(0);
    setPlayerPos({ x: 30, y: 30 });
    
    // Then initialize new game with a slight delay
    setTimeout(() => {
      const chars = ["S", "K", "R", "I", "B", "E", "R"];
      const newLetters = chars.map((char) => ({
        char,
        position: {
          x: Math.floor(Math.random() * 300),
          y: Math.floor(Math.random() * 300),
        },
        collected: false,
      }));

      const baseSpeed = 1;
      const newBadDots: BadDotState[] = [{
        position: {
          x: Math.floor(Math.random() * 300),
          y: Math.floor(Math.random() * 300),
        },
        speed: baseSpeed,
      }];

      const randomEmoji = PLAYER_EMOJIS[Math.floor(Math.random() * PLAYER_EMOJIS.length)];
      (window as any).currentPlayerEmoji = randomEmoji;

      setLetters(newLetters);
      setBadDots(newBadDots);
      setPlayerPos({ x: 30, y: 30 });
      setGameStarted(true);
    }, 100);
  }, [setLetters, setBadDots, setPlayerPos, setLevel, setScore, setIsWinner, setGameOver, setGameStarted]);

  return { initializeGame };
};