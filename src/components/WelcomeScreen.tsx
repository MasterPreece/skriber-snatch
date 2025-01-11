import React from 'react';
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center p-8 bg-white">
      <div className="mt-4">
        <h1 className="text-4xl font-bold text-purple-600 text-center">
          Welcome to Skriber Snatch
        </h1>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <Button 
          onClick={onStart}
          className="text-lg px-6 py-4"
        >
          Play
        </Button>
        <Button 
          onClick={onStart}
          variant="outline"
          className="text-lg px-6 py-4"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;