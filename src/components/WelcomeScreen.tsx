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
      <Button 
        onClick={onStart}
        className="mt-8 text-lg px-6 py-4"
      >
        Play
      </Button>
    </div>
  );
};

export default WelcomeScreen;