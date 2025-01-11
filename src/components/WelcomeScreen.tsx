import React from 'react';
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-8 bg-white">
      <h1 className="text-4xl font-bold text-purple-600 text-center">
        Welcome to Skriber Snatch
      </h1>
      <Button 
        onClick={onStart}
        className="text-xl px-8 py-6"
      >
        Start Game
      </Button>
    </div>
  );
};

export default WelcomeScreen;