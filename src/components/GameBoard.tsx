import React, { useState, useEffect, useCallback } from "react";
import Player from "./Player";
import Letter from "./Letter";
import WinnerText from "./WinnerText";

interface Position {
  x: number;
  y: number;
}

const GameBoard = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 50 });
  const [letterPos, setLetterPos] = useState<Position>({ x: 200, y: 200 });
  const [score, setScore] = useState(0);
  const [isWinner, setIsWinner] = useState(false);
  const speed = 5;

  const generateNewLetterPosition = useCallback(() => {
    const x = Math.floor(Math.random() * (window.innerWidth - 100));
    const y = Math.floor(Math.random() * (window.innerHeight - 100));
    setLetterPos({ x, y });
  }, []);

  const checkCollision = useCallback(() => {
    const distance = Math.sqrt(
      Math.pow(playerPos.x - letterPos.x, 2) + Math.pow(playerPos.y - letterPos.y, 2)
    );
    if (distance < 30) {
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore >= 5) {
          setIsWinner(true);
        }
        return newScore;
      });
      generateNewLetterPosition();
    }
  }, [playerPos, letterPos, generateNewLetterPosition]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setPlayerPos((prev) => {
        let newPos = { ...prev };
        switch (e.key) {
          case "ArrowUp":
            newPos.y = Math.max(0, prev.y - speed);
            break;
          case "ArrowDown":
            newPos.y = Math.min(window.innerHeight - 30, prev.y + speed);
            break;
          case "ArrowLeft":
            newPos.x = Math.max(0, prev.x - speed);
            break;
          case "ArrowRight":
            newPos.x = Math.min(window.innerWidth - 30, prev.x + speed);
            break;
        }
        return newPos;
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    checkCollision();
  }, [playerPos, checkCollision]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#e6e9f0] to-[#eef1f5] overflow-hidden">
      <div className="absolute top-4 left-4 text-2xl font-bold text-gray-700">
        Score: {score}/5
      </div>
      {!isWinner && (
        <>
          <Player position={playerPos} />
          <Letter position={letterPos} />
        </>
      )}
      {isWinner && <WinnerText />}
    </div>
  );
};

export default GameBoard;