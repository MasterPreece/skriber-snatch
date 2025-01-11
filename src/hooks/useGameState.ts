import { useCallback } from 'react';
import { useGamePosition } from './useGamePosition';
import { useGameProgress } from './useGameProgress';
import { useGameElements } from './useGameElements';
import { useScores } from './useScores';

export const useGameState = () => {
  const { playerPos, setPlayerPos, resetPosition } = useGamePosition();
  const { 
    level, setLevel,
    score, setScore,
    gameOver, setGameOver,
    gameStarted, setGameStarted,
    isWinner, setIsWinner,
    showEntryForm, setShowEntryForm,
    resetProgress
  } = useGameProgress();
  
  const {
    letters, setLetters,
    badDots, setBadDots,
    getRandomPositionAwayFromPlayer,
    resetElements
  } = useGameElements();

  const { scores, saveScore } = useScores();

  const handleSaveScore = useCallback((alias: string) => {
    saveScore({ alias, score: level });
  }, [level, saveScore]);

  return {
    // Player position
    playerPos,
    setPlayerPos,
    
    // Game elements
    letters,
    setLetters,
    badDots,
    setBadDots,
    
    // Game progress
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
    
    // Score handling
    showEntryForm,
    handleSaveScore,
    setShowEntryForm,
    scores,
    
    // Utility functions
    getRandomPositionAwayFromPlayer,
  };
};