import { useState } from 'react';
import type { Position } from '../types/game';

export const useGamePosition = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 30, y: 30 });

  const resetPosition = () => {
    setPlayerPos({ x: 30, y: 30 });
  };

  return {
    playerPos,
    setPlayerPos,
    resetPosition
  };
};