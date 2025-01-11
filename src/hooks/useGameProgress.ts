import { useState } from 'react';

export const useGameProgress = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);

  const resetProgress = () => {
    setLevel(1);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setIsWinner(false);
    setShowEntryForm(false);
  };

  return {
    level,
    setLevel,
    score,
    setScore,
    gameOver,
    setGameOver,
    gameStarted,
    setGameStarted,
    isWinner,
    setIsWinner,
    showEntryForm,
    setShowEntryForm,
    resetProgress
  };
};