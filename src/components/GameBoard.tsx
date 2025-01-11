import React from "react";
import { Toaster } from "@/components/ui/toaster";
import WelcomeScreen from "./WelcomeScreen";
import GameOverScreen from "./GameOverScreen";
import WinnerScreen from "./WinnerScreen";
import GamePlayArea from "./GamePlayArea";
import MobileControls from "./MobileControls";
import { useGameState } from "../hooks/useGameState";
import { useGameLogic } from "../hooks/useGameLogic";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useIsMobile } from "../hooks/use-mobile";

interface GameBoardProps {
  onStart: () => void;
}

const GameBoard = ({ onStart }: GameBoardProps) => {
  const {
    playerPos,
    setPlayerPos,
    letters,
    badDots,
    isWinner,
    level,
    gameOver,
    gameStarted,
    showEntryForm,
    handleSaveScore,
  } = useGameState();

  const { checkCollision } = useGameLogic(
    gameStarted,
    gameOver,
    isWinner,
    playerPos,
    letters,
    badDots,
    level,
    setLetters,
    setBadDots,
    setIsWinner,
    setGameOver,
    setLevel,
    setScore
  );

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
      const speed = 33.75;
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
    <div className="relative w-[400px] h-[400px] bg-gradient-to-b from-[rgba(51,195,240,0.95)] to-[rgba(14,165,233,0.95)] overflow-hidden border border-sky-300 rounded-lg shadow-lg backdrop-blur-sm mt-4">
      {!gameStarted && !gameOver && (
        <WelcomeScreen onStart={onStart} />
      )}
      
      {gameStarted && !gameOver && !isWinner && (
        <GamePlayArea 
          letters={letters}
          playerPos={playerPos}
          badDots={badDots}
          level={level}
        />
      )}
      
      {isWinner && (
        <WinnerScreen 
          score={level}
          showEntryForm={showEntryForm}
          onSave={handleSaveScore}
          onRestart={onStart}
        />
      )}
      
      {gameOver && !isWinner && (
        <GameOverScreen 
          onRestart={onStart}
          level={level}
        />
      )}

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
