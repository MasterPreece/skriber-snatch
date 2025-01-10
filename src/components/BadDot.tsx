import React from "react";

interface BadDotProps {
  position: {
    x: number;
    y: number;
  };
}

const BadDot = ({ position }: BadDotProps) => {
  return (
    <div
      className="absolute flex items-center justify-center w-16 h-16 bg-destructive rounded-full transition-all duration-75 ease-linear text-white text-xs font-bold"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      bad dots
    </div>
  );
};

export default BadDot;