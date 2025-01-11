import React from 'react';
import { Button } from "@/components/ui/button";

interface GameOverScreenProps {
  onRestart: () => void;
}

const GameOverScreen = ({ onRestart }: GameOverScreenProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
      <div className="text-3xl font-bold text-red-500 text-center px-4">
        You aren't a Skriber winner, try again
      </div>
      <Button 
        onClick={onRestart}
        className="text-lg px-6 py-4"
      >
        Try Again
      </Button>
    </div>
  );
};

export default GameOverScreen;