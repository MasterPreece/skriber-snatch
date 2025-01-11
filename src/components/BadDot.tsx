import React, { useEffect, useState } from "react";

interface BadDotProps {
  position: {
    x: number;
    y: number;
  };
  speed: number;
  playerPos: {
    x: number;
    y: number;
  };
}

const BadDot = ({ position, speed, playerPos }: BadDotProps) => {
  const [currentPos, setCurrentPos] = useState(position);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setCurrentPos((prev) => {
        // Calculate direction towards player
        const dx = playerPos.x - prev.x;
        const dy = playerPos.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize direction and apply speed
        const moveDistance = speed * 2;
        const newX = prev.x + (dx / distance) * moveDistance;
        const newY = prev.y + (dy / distance) * moveDistance;
        
        // Keep the bad dot within bounds
        return {
          x: Math.max(0, Math.min(350, newX)),
          y: Math.max(0, Math.min(350, newY))
        };
      });
    }, 50); // Update position every 50ms

    return () => clearInterval(moveInterval);
  }, [speed, playerPos]);

  return (
    <div
      className="absolute flex items-center justify-center w-16 h-16 rounded-full transition-all ease-linear text-4xl"
      style={{
        transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
        transitionDuration: `${75 / speed}ms`,
      }}
    >
      🦖
    </div>
  );
};

export default BadDot;
