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
  const speed = 15; // Increased speed from 5 to 15

  // Initialize letters
  useEffect(() => {
    const chars = ["S", "K", "R", "I", "B", "E", "R"];
    const newLetters = chars.map((char) => ({
      char,
      position: {
        x: Math.floor(Math.random() * (window.innerWidth * 0.25 - 100)),
        y: Math.floor(Math.random() * (window.innerHeight * 0.25 - 100)),
      },
      collected: false,
    }));
    setLetters(newLetters);
  }, []);

  const generateNewLetterPosition = useCallback(() => {
    return {
      x: Math.floor(Math.random() * (window.innerWidth * 0.25 - 100)),
      y: Math.floor(Math.random() * (window.innerHeight * 0.25 - 100)),
    };
  }, []);

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
      }

      return newLetters;
    });
  }, [playerPos]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setPlayerPos((prev) => {
        let newPos = { ...prev };
        const maxWidth = window.innerWidth * 0.25;
        const maxHeight = window.innerHeight * 0.25;

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
    <div className="relative w-1/4 h-1/4 bg-gradient-to-b from-[#e6e9f0] to-[#eef1f5] overflow-hidden mx-auto">
      <div className="absolute top-4 left-4 text-2xl font-bold text-gray-700">
        {letters.filter((l) => l.collected).length}/{letters.length}
      </div>
      {!isWinner && (
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
      {isWinner && <WinnerText />}
    </div>
  );
};

export default GameBoard;