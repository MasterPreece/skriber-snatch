import React, { useEffect, useState } from "react";

interface BadDotProps {
  position: {
    x: number;
    y: number;
  };
  speed: number;
}

const BadDot = ({ position, speed }: BadDotProps) => {
  const [currentPos, setCurrentPos] = useState(position);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setCurrentPos((prev) => {
        const angle = Math.random() * 2 * Math.PI;
        const moveDistance = speed * 2;
        
        let newX = prev.x + Math.cos(angle) * moveDistance;
        let newY = prev.y + Math.sin(angle) * moveDistance;
        
        // Keep the bad dot within bounds
        newX = Math.max(0, Math.min(350, newX));
        newY = Math.max(0, Math.min(350, newY));
        
        return { x: newX, y: newY };
      });
    }, 50); // Update position every 50ms

    return () => clearInterval(moveInterval);
  }, [speed]);

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
