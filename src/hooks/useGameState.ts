import { useState, useCallback } from 'react';
import type { Position, LetterState, BadDotState, Score } from '../types/game';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'skriber-snatch-scores';

export const useGameState = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 30, y: 30 });
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [badDots, setBadDots] = useState<BadDotState[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const { toast } = useToast();

  // Load scores from localStorage on initial render
  const [scores, setScores] = useState<Score[]>(() => {
    const savedScores = localStorage.getItem(STORAGE_KEY);
    return savedScores ? JSON.parse(savedScores) : [];
  });

  const calculateScore = useCallback(() => {
    const baseScore = Math.floor((timeLeft / 30) * 1000000);
    return Math.max(0, baseScore);
  }, [timeLeft]);

  const handleSaveScore = (alias: string) => {
    const newScore = {
      alias,
      score,
      date: new Date().toISOString(),
    };
    
    const newScores = [...scores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setScores(newScores);
    setShowEntryForm(false);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));
    
    toast({
      title: "Score Saved!",
      description: `${alias} - ${score.toLocaleString()} points`,
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
    timeLeft,
    setTimeLeft,
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
    calculateScore
  };
};