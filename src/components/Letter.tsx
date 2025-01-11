import React from "react";

interface LetterProps {
  position: {
    x: number;
    y: number;
  };
  char: string;
  collected: boolean;
}

const Letter = ({ position, char, collected }: LetterProps) => {
  if (collected) return null;
  
  return (
    <div
      className="absolute text-3xl font-bold text-white drop-shadow-md"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {char}
    </div>
  );
};

export default Letter;