import React from 'react';
import type { Position } from '../types/game';

interface SnowflakeProps {
  position: Position;
}

const Snowflake = ({ position }: SnowflakeProps) => {
  return (
    <div
      className="absolute flex items-center justify-center w-8 h-8 transition-all duration-300 hover:scale-110"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      ❄️
    </div>
  );
};

export default Snowflake;