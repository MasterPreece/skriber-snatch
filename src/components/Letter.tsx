import React from "react";

interface LetterProps {
  position: {
    x: number;
    y: number;
  };
  char: string;
  isNext: boolean;
}

const Letter = ({ position, char, isNext }: LetterProps) => {
  return (
    <div
      className={`absolute text-3xl font-bold transition-all duration-200 ${
        isNext ? "text-green-500 scale-110 animate-bounce" : "text-letter"
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {char}
    </div>
  );
};

export default Letter;