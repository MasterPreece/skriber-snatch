import React from "react";
import type { Position } from "../types/game";

interface EggProps {
  position: Position;
}

const Egg = ({ position }: EggProps) => {
  return (
    <div
      className="absolute w-6 h-6 flex items-center justify-center transition-all duration-75 ease-linear"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <span className="text-[1.4em]">🥚</span>
    </div>
  );
};

export default Egg;