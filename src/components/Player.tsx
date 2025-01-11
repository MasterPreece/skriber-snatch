import React from "react";

interface PlayerProps {
  position: {
    x: number;
    y: number;
  };
  emoji: string;
}

const Player = ({ position, emoji }: PlayerProps) => {
  return (
    <div
      className="absolute w-6 h-6 flex items-center justify-center transition-all duration-75 ease-linear"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <span className="text-[1.4em]">{emoji}</span>
    </div>
  );
};

export default Player;