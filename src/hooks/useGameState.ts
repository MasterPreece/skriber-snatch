import { useState, useEffect, useCallback } from 'react';
import type { Position, LetterState, BadDotState, Score } from '../types/game';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const [scores, setScores] = useState<Score[]>([]);

  // Fetch scores on component mount
  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedScores: Score[] = data.map(score => ({
        alias: score.alias,
        score: score.score,
        date: score.created_at
      }));

      setScores(formattedScores);
    } catch (error) {
      console.error('Error fetching scores:', error);
      toast({
        title: "Error fetching scores",
        description: "Could not load the leaderboard",
        variant: "destructive"
      });
    }
  };

  const handleSaveScore = useCallback(async (alias: string) => {
    try {
      const { error } = await supabase
        .from('scores')
        .insert([
          {
            alias: alias,
            score: level
          }
        ]);

      if (error) throw error;

      // Refresh scores after saving
      await fetchScores();
      
      setShowEntryForm(false);
      
      toast({
        title: "Score Saved!",
        description: `${alias} - Level ${level}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving score:', error);
      toast({
        title: "Error saving score",
        description: "Could not save your score. Please try again.",
        variant: "destructive"
      });
    }
  }, [level, toast]);

  // Show entry form when game is won
  useEffect(() => {
    if (isWinner) {
      setShowEntryForm(true);
    }
  }, [isWinner]);

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