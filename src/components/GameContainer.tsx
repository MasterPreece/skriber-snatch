import React from "react";
import { useGameState } from "../hooks/useGameState";
import { useGameInitialization } from "../hooks/useGameInitialization";
import TopScores from "./TopScores";
import GameBoard from "./GameBoard";

const GameContainer = () => {
  const {
    scores,
    setLetters,
    setBadDots,
    setPlayerPos,
    setLevel,
    setScore,
    setIsWinner,
    setGameOver,
    setGameStarted,
    resetGame,
  } = useGameState();

  const { initializeGame } = useGameInitialization(
    setLetters,
    setBadDots,
    setPlayerPos,
    setLevel,
    setScore,
    setIsWinner,
    setGameOver,
    setGameStarted
  );

  const handleStart = React.useCallback(() => {
    console.log("Starting new game...");
    resetGame();
    initializeGame();
    setGameStarted(true);
  }, [resetGame, initializeGame, setGameStarted]);

  // Reset game when component mounts
  React.useEffect(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-[url('/lovable-uploads/6a584446-6e3e-4052-acb6-34952ba1d772.png')] bg-cover bg-center bg-no-repeat">
      <TopScores scores={scores} />
      <GameBoard onStart={handleStart} />
    </div>
  );
};

export default GameContainer;