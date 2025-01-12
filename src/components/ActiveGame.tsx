import React from 'react';
import Player from './Player';
import Letter from './Letter';
import BadDot from './BadDot';
import Snowflake from './Snowflake';
import Egg from './Egg';
import type { Position, LetterState, BadDotState, SnowflakeState, EggState } from '../types/game';

interface ActiveGameProps {
  letters: LetterState[];
  playerPos: Position;
  badDots: BadDotState[];
  level: number;
  snowflake: SnowflakeState;
  egg: EggState;
  isEggActive: boolean;
}

const ActiveGame = ({ letters, playerPos, badDots, level, snowflake, egg, isEggActive }: ActiveGameProps) => {
  return (
    <>
      <div className="absolute top-4 left-4 text-2xl font-bold text-white drop-shadow-md">
        {letters.filter((l) => l.collected).length}/{letters.length}
      </div>
      <div className="absolute top-4 right-4 text-2xl font-bold text-white drop-shadow-md">
        Level {level}
      </div>
      <Player 
        position={playerPos} 
        emoji={isEggActive ? undefined : (window as any).currentPlayerEmoji}
        imageUrl={isEggActive ? "/lovable-uploads/57a5f3ca-49a2-4f2d-9bf2-4372e15b3188.png" : undefined}
      />
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
      {!snowflake.collected && (
        <Snowflake position={snowflake.position} />
      )}
      {level % 5 === 0 && !egg.collected && (
        <Egg position={egg.position} />
      )}
    </>
  );
};

export default ActiveGame;