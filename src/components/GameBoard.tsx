import React, { useState, useEffect, useCallback } from "react";
import Player from "./Player";
import Letter from "./Letter";
import WinnerText from "./WinnerText";

interface Position {
  x: number;
  y: number;
}

interface LetterState {
  char: string;
  position: Position;
  collected: boolean;
}

const GameBoard = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 50 });
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const speed = 15;

  // Initialize letters
  useEffect(() => {
    const chars = ["S", "K", "R", "I", "B", "E", "R"];
    const newLetters = chars.map((char) => ({
      char,
      position: {
        x: Math.floor(Math.random() * 300),
        y: Math.floor(Math.random() * 300),
      },
      collected: false,
    }));
    setLetters(newLetters);
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isWinner && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isWinner) {
      setGameOver(true);
    }
  }, [timeLeft, isWinner]);

  const calculateScore = useCallback(() => {
    // Score calculation based on time left
    // Maximum score (1000000) when collecting all letters immediately
    // Minimum score (0) when time is almost up
    const baseScore = Math.floor((timeLeft / 45) * 1000000);
    return Math.max(0, baseScore);
  }, [timeLeft]);

  const checkCollision = useCallback(() => {
    setLetters((prevLetters) => {
      let allCollected = true;
      const newLetters = prevLetters.map((letter) => {
        if (!letter.collected) {
          const distance = Math.sqrt(
            Math.pow(playerPos.x - letter.position.x, 2) +
              Math.pow(playerPos.y - letter.position.y, 2)
          );
          if (distance < 30) {
            return {
              ...letter,
              collected: true,
            };
          }
          allCollected = false;
        }
        return letter;
      });

      if (allCollected) {
        setIsWinner(true);
        setScore(calculateScore());
      }

      return newLetters;
    });
  }, [playerPos, calculateScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setPlayerPos((prev) => {
        let newPos = { ...prev };
        const maxWidth = 300;
        const maxHeight = 300;

        switch (e.key) {
          case "ArrowUp":
            newPos.y = Math.max(0, prev.y - speed);
            break;
          case "ArrowDown":
            newPos.y = Math.min(maxHeight - 30, prev.y + speed);
            break;
          case "ArrowLeft":
            newPos.x = Math.max(0, prev.x - speed);
            break;
          case "ArrowRight":
            newPos.x = Math.min(maxWidth - 30, prev.x + speed);
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-[400px] h-[400px] bg-gradient-to-b from-[#e6e9f0] to-[#eef1f5] overflow-hidden border border-gray-200 rounded-lg shadow-lg">
        <div className="absolute top-4 left-4 text-2xl font-bold text-gray-700">
          {letters.filter((l) => l.collected).length}/{letters.length}
        </div>
        <div className="absolute top-4 right-4 text-2xl font-bold text-gray-700">
          {timeLeft}s
        </div>
        {!isWinner && !gameOver && (
          <>
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
          </>
        )}
        {isWinner && (
          <>
            <WinnerText />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-purple-600 animate-bounce">
              Score: {score.toLocaleString()}
            </div>
          </>
        )}
        {gameOver && !isWinner && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-red-500">Time's Up!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;