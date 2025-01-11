import { useState, useCallback } from 'react';
import type { Position, LetterState, BadDotState, Score } from '../types/game';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const MIN_SPAWN_DISTANCE = 100;

const fetchScores = async (): Promise<Score[]> => {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);

  if (error) throw error;
  
  // Map the database response to our Score type
  return data.map(item => ({
    id: item.id,
    alias: item.alias,
    score: item.score,
    date: item.created_at
  }));
};

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
  const queryClient = useQueryClient();

  // Fetch scores
  const { data: scores = [] } = useQuery({
    queryKey: ['scores'],
    queryFn: fetchScores,
  });

  // Save score mutation
  const { mutate: saveScore } = useMutation({
    mutationFn: async (alias: string) => {
      const { error } = await supabase
        .from('scores')
        .insert([{ alias, score: level }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
      toast({
        title: "Score saved!",
        description: "Your high score has been recorded.",
      });
      setShowEntryForm(false);
    },
    onError: (error) => {
      console.error('Error saving score:', error);
      toast({
        title: "Error",
        description: "Failed to save your score. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getRandomPositionAwayFromPlayer = useCallback((playerPos: Position): Position => {
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
  }, []);

  const handleSaveScore = useCallback((alias: string) => {
    saveScore(alias);
  }, [saveScore]);

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
    getRandomPositionAwayFromPlayer,
  };
};