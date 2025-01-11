import { useState, useEffect, useCallback } from 'react';
import type { Position, LetterState, BadDotState, Score } from '../types/game';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'skriber-snatch-scores';
const MIN_SPAWN_DISTANCE = 100;

export const useGameState = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 30, y: 30 });
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [badDots, setBadDots] = useState<BadDotState[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const { toast } = useToast();

  const [scores, setScores] = useState<Score[]>(() => {
    const savedScores = localStorage.getItem(STORAGE_KEY);
    return savedScores ? JSON.parse(savedScores) : [];
  });

  const resetGame = useCallback(() => {
    console.log("Resetting game state...");
    setPlayerPos({ x: 30, y: 30 });
    setLetters([]);
    setIsWinner(false);
    setLevel(1);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setBadDots([]);
    setShowEntryForm(false);
  }, []);

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

  useEffect(() => {
    if (gameStarted && !gameOver && !isWinner && letters.every(l => l.collected)) {
      const nextLevel = level + 1;
      
      const chars = ["S", "K", "R", "I", "B", "E", "R"];
      const newLetters = chars.map((char) => ({
        char,
        position: getRandomPositionAwayFromPlayer(playerPos),
        collected: false,
      }));

      const baseSpeed = 1 + (nextLevel * 0.5);
      const maxBadDots = Math.min(nextLevel, 10);
      
      const newBadDots: BadDotState[] = Array(maxBadDots).fill(null).map(() => ({
        position: getRandomPositionAwayFromPlayer(playerPos),
        speed: baseSpeed,
      }));

      setLetters(newLetters);
      setBadDots(newBadDots);
      setLevel(nextLevel);
    }
  }, [letters, level, gameStarted, gameOver, isWinner, playerPos]);

  return {
    playerPos,
    setPlayerPos,
    letters,
    setLetters,
    isWinner,
    setIsWinner,
    level,
    setLevel,
    score,
    setScore,
    gameOver,
    setGameOver,
    gameStarted,
    setGameStarted,
    badDots,
    setBadDots,
    scores,
    showEntryForm,
    setShowEntryForm,
    handleSaveScore: (alias: string) => {
      const newScore: Score = {
        alias,
        score: level,
        date: new Date().toISOString(),
      };
      
      const existingScores = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const newScores = [...existingScores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      setScores(newScores);
      setShowEntryForm(false);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));
      
      toast({
        title: "Score Saved!",
        description: `${alias} - Level ${level}`,
        duration: 3000,
      });
    },
    resetGame,
  };
};
