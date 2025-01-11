import { useCallback } from 'react';
import type { Position, LetterState, BadDotState } from '../types/game';

const PLAYER_EMOJIS = ["🍆", "🥑", "🍎", "🍊", "🍇", "🍓", "🍌", "🥝", "🍍", "🥭"];

export const useGameInitialization = (
  setLetters: (letters: LetterState[]) => void,
  setBadDots: (dots: BadDotState[]) => void,
  setPlayerPos: (pos: Position) => void,
  setTimeLeft: (time: number) => void,
  setScore: (score: number) => void,
  setIsWinner: (winner: boolean) => void,
  setGameOver: (over: boolean) => void,
  setGameStarted: (started: boolean) => void,
) => {
  const initializeGame = useCallback(() => {
    const chars = ["S", "K", "R", "I", "B", "E", "R"];
    const newLetters = chars.map((char) => ({
      char,
      position: {
        x: Math.floor(Math.random() * 300),
        y: Math.floor(Math.random() * 300),
      },
      collected: false,
    }));

    const quadrants = [
      { minX: 150, maxX: 300, minY: 0, maxY: 150 },    // top-right
      { minX: 0, maxX: 150, minY: 150, maxY: 300 },    // bottom-left
      { minX: 150, maxX: 300, minY: 150, maxY: 300 },  // bottom-right
    ];

    const newBadDots: BadDotState[] = [];
    const minDistance = 50;

    quadrants.forEach(quadrant => {
      let placed = false;
      while (!placed) {
        const newPosition = {
          x: Math.floor(Math.random() * (quadrant.maxX - quadrant.minX)) + quadrant.minX,
          y: Math.floor(Math.random() * (quadrant.maxY - quadrant.minY)) + quadrant.minY,
        };

        const isTooClose = newBadDots.some(dot => {
          const dx = dot.position.x - newPosition.x;
          const dy = dot.position.y - newPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < minDistance;
        });

        if (!isTooClose) {
          newBadDots.push({ position: newPosition });
          placed = true;
        }
      }
    });

    const randomEmoji = PLAYER_EMOJIS[Math.floor(Math.random() * PLAYER_EMOJIS.length)];
    (window as any).currentPlayerEmoji = randomEmoji;

    setLetters(newLetters);
    setBadDots(newBadDots);
    setPlayerPos({ x: 30, y: 30 });
    setTimeLeft(30);
    setScore(0);
    setIsWinner(false);
    setGameOver(false);
    setGameStarted(true);
  }, [setLetters, setBadDots, setPlayerPos, setTimeLeft, setScore, setIsWinner, setGameOver, setGameStarted]);

  return { initializeGame };
};