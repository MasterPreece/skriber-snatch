import React from 'react';
import { Button } from "@/components/ui/button";
import WinnerText from './WinnerText';
import LeaderboardEntry from './LeaderboardEntry';

interface WinnerScreenProps {
  score: number;
  showEntryForm: boolean;
  onSave: (alias: string) => void;
  onRestart: () => void;
}

const WinnerScreen = ({ score, showEntryForm, onSave, onRestart }: WinnerScreenProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <WinnerText />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="text-2xl font-bold text-purple-600 animate-bounce">
          Score: {score.toLocaleString()}
        </div>
        {showEntryForm ? (
          <LeaderboardEntry score={score} onSave={onSave} />
        ) : (
          <Button 
            onClick={onRestart}
            className="text-lg px-6 py-4"
          >
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default WinnerScreen;