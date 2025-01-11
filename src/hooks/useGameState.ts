import { useState, useCallback } from 'react';
import type { Position, LetterState, BadDotState, Score } from '../types/game';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'skriber-snatch-scores';

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

  useEffect(() => {
    if (gameStarted && !gameOver && !isWinner && letters.every(l => l.collected)) {
      // Level completed, initialize next level
      const chars = ["S", "K", "R", "I", "B", "E", "R"];
      const newLetters = chars.map((char) => ({
        char,
        position: {
          x: Math.floor(Math.random() * 300),
          y: Math.floor(Math.random() * 300),
        },
        collected: false,
      }));

      const baseSpeed = 1 + (level * 0.5); // Increase speed with each level
      const newBadDots: BadDotState[] = Array(level).fill(null).map(() => ({
        position: {
          x: Math.floor(Math.random() * 300),
          y: Math.floor(Math.random() * 300),
        },
        speed: baseSpeed,
      }));

      setLetters(newLetters);
      setBadDots(newBadDots);
      setLevel(prev => prev + 1);
    }
  }, [letters, level, gameStarted, gameOver, isWinner]);

  const handleSaveScore = (alias: string) => {
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
  };

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
    handleSaveScore,
  };
};