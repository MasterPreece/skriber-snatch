import React from "react";
import Letter from "./Letter";
import Player from "./Player";
import BadDot from "./BadDot";
import type { LetterState, BadDotState } from "../types/game";

interface ActiveGameProps {
  letters: LetterState[];
  playerPos: {
    x: number;
    y: number;
  };
  badDots: BadDotState[];
  level: number;
}

const ActiveGame = ({ letters, playerPos, badDots, level }: ActiveGameProps) => {
  return (
    <div className="relative w-full h-full">
      {letters.map((letter, index) => (
        <Letter
          key={index}
          char={letter.char}
          position={letter.position}
          collected={letter.collected}
        />
      ))}
      
      {badDots.map((dot, index) => (
        <BadDot
          key={index}
          position={dot.position}
          speed={dot.speed}
          playerPos={playerPos}
        />
      ))}
      
      <Player position={playerPos} emoji="🐱" />
    </div>
  );
};

export default ActiveGame;