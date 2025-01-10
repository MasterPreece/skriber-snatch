import React from "react";

interface PlayerProps {
  position: {
    x: number;
    y: number;
  };
}

const Player = ({ position }: PlayerProps) => {
  return (
    <div
      className="absolute w-6 h-6 bg-player rounded-full transition-all duration-75 ease-linear"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    />
  );
};

export default Player;