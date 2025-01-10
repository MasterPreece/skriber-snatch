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
      className="absolute w-4 h-4 bg-destructive rounded-full transition-all duration-75 ease-linear"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    />
  );
};

export default BadDot;