import { useState, useCallback } from 'react';
import type { Position, LetterState, BadDotState, Score } from '../types/game';
import { useToast } from '@/components/ui/use-toast';

export const useGameState = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 30, y: 30 });
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [badDots, setBadDots] = useState<BadDotState[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const { toast } = useToast();

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
    
    toast({
      title: "Score Saved!",
      description: `${alias} - ${score.toLocaleString()} points`,
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