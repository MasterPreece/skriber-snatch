import React, { useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onStart();
    }, 1500); // Give users 1.5 seconds to read the welcome message

    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-8 bg-white">
      <h1 className="text-4xl font-bold text-purple-600 text-center">
        Welcome to Skriber Snatch
      </h1>
    </div>
  );
};

export default WelcomeScreen;