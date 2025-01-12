import React from "react";

interface PlayerProps {
  position: {
    x: number;
    y: number;
  };
  emoji?: string;
  imageUrl?: string;
}

const Player = ({ position, emoji, imageUrl }: PlayerProps) => {
  return (
    <div
      className="absolute w-6 h-6 flex items-center justify-center transition-all duration-75 ease-linear"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Player" 
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <span className="text-[1.4em]">{emoji}</span>
      )}
    </div>
  );
};

export default Player;