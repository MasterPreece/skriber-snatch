import React from 'react';
import { Button } from "@/components/ui/button";
import LeaderboardEntry from './LeaderboardEntry';

interface GameOverScreenProps {
  onRestart: () => void;
  level: number;
  onSave: (alias: string) => void;
}

const GameOverScreen = ({ onRestart, level, onSave }: GameOverScreenProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/20 backdrop-blur-sm">
      <div className="text-3xl font-bold text-purple-500 text-center px-4">
        Game Over!
      </div>
      <div className="text-2xl text-white">
        You reached Level {level}!
      </div>
      <LeaderboardEntry score={level} onSave={onSave} />
      <Button 
        onClick={onRestart}
        className="text-lg px-6 py-4 mt-4"
      >
        Try Again
      </Button>
    </div>
  );
};

export default GameOverScreen;