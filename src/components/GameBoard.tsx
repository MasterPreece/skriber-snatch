import React from "react";
import { Toaster } from "@/components/ui/toaster";
import WelcomeScreen from "./WelcomeScreen";
import GameOverScreen from "./GameOverScreen";
import WinnerScreen from "./WinnerScreen";
import ActiveGame from "./ActiveGame";
import TopScores from "./TopScores";
import MobileControls from "./MobileControls";
import { useGameState } from "../hooks/useGameState";
import { useGameInitialization } from "../hooks/useGameInitialization";
import { useGameLogic } from "../hooks/useGameLogic";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useIsMobile } from "../hooks/use-mobile";

const GameBoard = () => {
  const {
    playerPos,
    setPlayerPos,
    letters,
    setLetters,
    isWinner,
    setIsWinner,
    timeLeft,
    setTimeLeft,
    score,
    setScore,
    gameOver,
    setGameOver,
    gameStarted,
    setGameStarted,
    badDots,
    setBadDots,
    showEntryForm,
    handleSaveScore,
    calculateScore,
    scores
  } = useGameState();

  const { initializeGame } = useGameInitialization(
    setLetters,
    setBadDots,
    setPlayerPos,
    setTimeLeft,
    setScore,
    setIsWinner,
    setGameOver,
    setGameStarted
  );

  const { checkCollision } = useGameLogic(
    gameStarted,
    gameOver,
    isWinner,
    playerPos,
    letters,
    badDots,
    timeLeft,
    setLetters,
    setBadDots,
    setIsWinner,
    setGameOver,
    setTimeLeft,
    setScore,
    calculateScore
  );

  // Add keyboard movement
  usePlayerMovement(
    gameStarted,
    gameOver,
    isWinner,
    setPlayerPos
  );

  const isMobile = useIsMobile();

  const handleMobileMove = (direction: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") => {
    if (!gameStarted || gameOver || isWinner) return;
    
    setPlayerPos((prev) => {
      let newPos = { ...prev };
      const speed = 15;
      const maxWidth = 350;
      const maxHeight = 350;

      switch (direction) {
        case "ArrowUp":
          newPos.y = Math.max(0, prev.y - speed);
          break;
        case "ArrowDown":
          newPos.y = Math.min(maxHeight, prev.y + speed);
          break;
        case "ArrowLeft":
          newPos.x = Math.max(0, prev.x - speed);
          break;
        case "ArrowRight":
          newPos.x = Math.min(maxWidth, prev.x + speed);
          break;
      }
      return newPos;
    });
  };

  React.useEffect(() => {
    checkCollision();
  }, [playerPos, checkCollision]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <TopScores scores={scores} />
      <div className="relative w-[400px] h-[400px] bg-gradient-to-b from-[#e6e9f0] to-[#eef1f5] overflow-hidden border border-gray-200 rounded-lg shadow-lg">
        {!gameStarted && !gameOver && (
          <WelcomeScreen onStart={initializeGame} />
        )}
        
        {gameStarted && !gameOver && !isWinner && (
          <ActiveGame 
            letters={letters}
            playerPos={playerPos}
            badDots={badDots}
            timeLeft={timeLeft}
          />
        )}
        
        {isWinner && (
          <WinnerScreen 
            score={score}
            showEntryForm={showEntryForm}
            onSave={handleSaveScore}
            onRestart={initializeGame}
          />
        )}
        
        {gameOver && !isWinner && (
          <GameOverScreen onRestart={initializeGame} />
        )}
      </div>
      
      {isMobile && gameStarted && !gameOver && !isWinner && (
        <div className="mt-8">
          <MobileControls onMove={handleMobileMove} />
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default GameBoard;