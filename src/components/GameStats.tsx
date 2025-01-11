import React from "react";

interface GameStatsProps {
  collectedCount: number;
  totalCount: number;
  level: number;
}

const GameStats = ({ collectedCount, totalCount, level }: GameStatsProps) => {
  return (
    <>
      <div className="absolute top-4 left-4 text-2xl font-bold text-white drop-shadow-md">
        {collectedCount}/{totalCount}
      </div>
      <div className="absolute top-4 right-4 text-2xl font-bold text-white drop-shadow-md">
        Level {level}
      </div>
    </>
  );
};

export default GameStats;