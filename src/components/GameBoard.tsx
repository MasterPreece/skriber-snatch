import React from "react";
import { Toaster } from "@/components/ui/toaster";
import WelcomeScreen from "./WelcomeScreen";
import GameOverScreen from "./GameOverScreen";
import WinnerScreen from "./WinnerScreen";
import ActiveGame from "./ActiveGame";
import MobileControls from "./MobileControls";
import TopScores from "./TopScores";
import { useGameState } from "../hooks/useGameState";
import { useGameInitialization } from "../hooks/useGameInitialization";
import { useGameLogic } from "../hooks/useGameLogic";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useIsMobile } from "../hooks/use-mobile";
import type { SnowflakeState, EggState } from "../types/game";

const GameBoard = () => {
  const {
    playerPos,
    setPlayerPos,
    letters,
    setLetters,
    isWinner,
    setIsWinner,
    level,
    setLevel,
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
    setShowEntryForm,
    scores
  } = useGameState();

  const [snowflake, setSnowflake] = React.useState<SnowflakeState>({
    position: { x: 0, y: 0 },
    collected: false,
  });

  const [egg, setEgg] = React.useState<EggState>({
    position: { x: 0, y: 0 },
    collected: false,
  });

  const [isEggActive, setIsEggActive] = React.useState(false);

  const canMoveRef = React.useRef(true);

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

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setIsWinner(false);
    setLetters([]);
    setBadDots([]);
    setLevel(1);
    setScore(0);
    setPlayerPos({ x: 30, y: 30 });
    setShowEntryForm(false);
    setSnowflake({ position: { x: 0, y: 0 }, collected: false });
    setEgg({ position: { x: 0, y: 0 }, collected: false });
    setIsEggActive(false);
  };

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
    setScore,
    snowflake,
    setSnowflake,
    egg,
    setEgg,
    setIsEggActive
  );

  usePlayerMovement(
    gameStarted,
    gameOver,
    isWinner,
    setPlayerPos
  );

  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (gameStarted && !gameOver && !isWinner) {
      canMoveRef.current = false;
      setTimeout(() => {
        canMoveRef.current = true;
      }, 500);
    }
  }, [level, gameStarted, gameOver, isWinner]);

  const handleMobileMove = (direction: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") => {
    if (!gameStarted || gameOver || isWinner || !canMoveRef.current) return;
    
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

  React.useEffect(() => {
    resetGame();
  }, []);

  React.useEffect(() => {
    if (gameOver && !isWinner) {
      setShowEntryForm(true);
    }
  }, [gameOver, isWinner]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-[url('/lovable-uploads/6a584446-6e3e-4052-acb6-34952ba1d772.png')] bg-cover bg-center bg-no-repeat">
      <TopScores scores={scores} />
      
      <div className="relative w-[400px] h-[400px] bg-gradient-to-b from-[rgba(51,195,240,0.95)] to-[rgba(14,165,233,0.95)] overflow-hidden border border-sky-300 rounded-lg shadow-lg backdrop-blur-sm mt-4">
        {!gameStarted && !gameOver && (
          <WelcomeScreen onStart={initializeGame} />
        )}
        
        {gameStarted && !gameOver && !isWinner && (
          <ActiveGame 
            letters={letters}
            playerPos={playerPos}
            badDots={badDots}
            level={level}
            snowflake={snowflake}
            egg={egg}
            isEggActive={isEggActive}
          />
        )}
        
        {(isWinner || gameOver) && (
          <WinnerScreen 
            score={level}
            showEntryForm={showEntryForm}
            onSave={handleSaveScore}
            onRestart={initializeGame}
          />
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