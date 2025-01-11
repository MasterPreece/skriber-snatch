import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import type { Score } from '../types/game';

const fetchScores = async (): Promise<Score[]> => {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    alias: item.alias,
    score: item.score,
    date: item.created_at
  }));
};

export const useScores = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scores = [] } = useQuery({
    queryKey: ['scores'],
    queryFn: fetchScores,
  });

  const { mutate: saveScore } = useMutation({
    mutationFn: async (data: { alias: string; score: number }) => {
      const { error } = await supabase
        .from('scores')
        .insert([{ alias: data.alias, score: data.score }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
      toast({
        title: "Score saved!",
        description: "Your high score has been recorded.",
      });
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

  return { scores, saveScore };
};