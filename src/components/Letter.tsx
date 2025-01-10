import React from "react";

interface LetterProps {
  position: {
    x: number;
    y: number;
  };
}

const Letter = ({ position }: LetterProps) => {
  return (
    <div
      className="absolute text-3xl font-bold text-letter"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      S
    </div>
  );
};

export default Letter;