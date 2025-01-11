import React from 'react';
import Player from './Player';
import Letter from './Letter';
import BadDot from './BadDot';
import type { Position, LetterState, BadDotState } from '../types/game';

interface ActiveGameProps {
  letters: LetterState[];
  playerPos: Position;
  badDots: BadDotState[];
  level: number;
}

const ActiveGame = ({ letters, playerPos, badDots, level }: ActiveGameProps) => {
  return (
    <>
      <div className="absolute top-4 left-4 text-2xl font-bold text-white drop-shadow-md">
        {letters.filter((l) => l.collected).length}/{letters.length}
      </div>
      <div className="absolute top-4 right-4 text-2xl font-bold text-white drop-shadow-md">
        Level {level}
      </div>
      <Player position={playerPos} emoji={(window as any).currentPlayerEmoji} />
      {letters.map((letter, index) => (
        !letter.collected && (
          <Letter
            key={index}
            position={letter.position}
            char={letter.char}
          />
        )
      ))}
      {badDots.map((dot, index) => (
        <BadDot key={index} position={dot.position} speed={dot.speed} />
      ))}
    </>
  );
};

export default ActiveGame;