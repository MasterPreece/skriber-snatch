import { useState, useEffect, useCallback } from 'react';
import type { Position, LetterState, BadDotState, Score } from '../types/game';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'skriber-snatch-scores';
const MIN_SPAWN_DISTANCE = 100; // Minimum distance from player for bad dot spawns

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

  const getRandomPositionAwayFromPlayer = (playerPos: Position): Position => {
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * 300),
        y: Math.floor(Math.random() * 300),
      };
      // Calculate distance from player
      const distance = Math.sqrt(
        Math.pow(position.x - playerPos.x, 2) + 
        Math.pow(position.y - playerPos.y, 2)
      );
      // If distance is greater than minimum, accept the position
      if (distance >= MIN_SPAWN_DISTANCE) {
        break;
      }
    } while (true);
    
    return position;
  };

  useEffect(() => {
    if (gameStarted && !gameOver && !isWinner && letters.every(l => l.collected)) {
      // Level completed, initialize next level
      const chars = ["S", "K", "R", "I", "B", "E", "R"];
      const newLetters = chars.map((char) => ({
        char,
        position: getRandomPositionAwayFromPlayer(playerPos),
        collected: false,
      }));

      const baseSpeed = 1 + (level * 0.5); // Increase speed with each level
      const newBadDots: BadDotState[] = Array(level).fill(null).map(() => ({
        position: getRandomPositionAwayFromPlayer(playerPos),
        speed: baseSpeed,
      }));

      setLetters(newLetters);
      setBadDots(newBadDots);
      setLevel(prev => prev + 1); // Increment by 1 instead of 2
    }
  }, [letters, level, gameStarted, gameOver, isWinner, playerPos]);

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