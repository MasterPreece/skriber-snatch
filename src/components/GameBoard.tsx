import React from "react";
import { Button } from "@/components/ui/button";
import Player from "./Player";
import Letter from "./Letter";
import WinnerText from "./WinnerText";
import BadDot from "./BadDot";
import Leaderboard from "./Leaderboard";
import LeaderboardEntry from "./LeaderboardEntry";
import { useGameState } from "../hooks/useGameState";
import { useGameInitialization } from "../hooks/useGameInitialization";
import { useGameLogic } from "../hooks/useGameLogic";
import { usePlayerMovement } from "../hooks/usePlayerMovement";

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
    scores,
    showEntryForm,
    handleSaveScore,
    calculateScore
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

  usePlayerMovement(gameStarted, gameOver, isWinner, setPlayerPos);

  React.useEffect(() => {
    checkCollision();
  }, [playerPos, checkCollision]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-[400px] h-[400px] bg-gradient-to-b from-[#e6e9f0] to-[#eef1f5] overflow-hidden border border-gray-200 rounded-lg shadow-lg">
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-8 bg-white">
            <h1 className="text-4xl font-bold text-purple-600 text-center">
              Welcome to Skriber Snatch
            </h1>
            <Button 
              onClick={initializeGame}
              className="text-xl px-8 py-6"
            >
              Start Game
            </Button>
          </div>
        )}
        
        {gameStarted && !gameOver && !isWinner && (
          <>
            <div className="absolute top-4 left-4 text-2xl font-bold text-gray-700">
              {letters.filter((l) => l.collected).length}/{letters.length}
            </div>
            <div className="absolute top-4 right-4 text-2xl font-bold text-gray-700">
              {timeLeft}s
            </div>
            <Player position={playerPos} />
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
              <BadDot key={index} position={dot.position} />
            ))}
          </>
        )}
        
        {isWinner && (
          <>
            <WinnerText />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
              <div className="text-2xl font-bold text-purple-600 animate-bounce">
                Score: {score.toLocaleString()}
              </div>
              {showEntryForm ? (
                <LeaderboardEntry score={score} onSave={handleSaveScore} />
              ) : (
                <Button 
                  onClick={initializeGame}
                  className="text-lg px-6 py-4"
                >
                  Play Again
                </Button>
              )}
            </div>
          </>
        )}
        
        {gameOver && !isWinner && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <div className="text-3xl font-bold text-red-500 text-center px-4">
              You aren't a Skriber winner, try again
            </div>
            <Button 
              onClick={initializeGame}
              className="text-lg px-6 py-4"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
      
      {scores.length > 0 && (
        <Leaderboard scores={scores} />
      )}
    </div>
  );
};

export default GameBoard;