import React from "react";
import type { Position, LetterState, BadDotState } from '../types/game';
import Player from './Player';
import Letter from './Letter';
import BadDot from './BadDot';
import GameStats from './GameStats';

interface GamePlayAreaProps {
  letters: LetterState[];
  playerPos: Position;
  badDots: BadDotState[];
  level: number;
}

const GamePlayArea = ({ letters, playerPos, badDots, level }: GamePlayAreaProps) => {
  return (
    <>
      <GameStats 
        collectedCount={letters.filter((l) => l.collected).length}
        totalCount={letters.length}
        level={level}
      />
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

export default GamePlayArea;