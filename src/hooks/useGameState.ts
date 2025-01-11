import { useState, useCallback } from 'react';
import type { Position, Score } from '../types/game';
import { useToast } from '@/components/ui/use-toast';
import { useLetterManagement } from './useLetterManagement';
import { useBadDotsManagement } from './useBadDotsManagement';

const STORAGE_KEY = 'skriber-snatch-scores';

export const useGameState = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 30, y: 30 });
  const [isWinner, setIsWinner] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const { toast } = useToast();

  const [scores, setScores] = useState<Score[]>(() => {
    const savedScores = localStorage.getItem(STORAGE_KEY);
    return savedScores ? JSON.parse(savedScores) : [];
  });

  const { letters, setLetters } = useLetterManagement(
    gameStarted,
    gameOver,
    isWinner,
    playerPos,
    level
  );

  const { badDots, setBadDots } = useBadDotsManagement(
    gameStarted,
    gameOver,
    isWinner,
    playerPos,
    level
  );

  const handleSaveScore = useCallback((alias: string) => {
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
  }, [level, toast]);

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