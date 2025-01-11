import React from "react";

interface BadDotProps {
  position: {
    x: number;
    y: number;
  };
  speed: number;
}

const BadDot = ({ position, speed }: BadDotProps) => {
  return (
    <div
      className="absolute flex items-center justify-center w-16 h-16 rounded-full transition-all ease-linear text-4xl"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transitionDuration: `${75 / speed}ms`,
      }}
    >
      🦖
    </div>
  );
};

export default BadDot;