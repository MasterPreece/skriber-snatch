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
  const [nextLetterIndex, setNextLetterIndex] = useState(0);
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

  const checkCollision = useCallback(() => {
    setLetters((prevLetters) => {
      const newLetters = [...prevLetters];
      const currentLetter = newLetters[nextLetterIndex];

      if (currentLetter && !currentLetter.collected) {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - currentLetter.position.x, 2) +
          Math.pow(playerPos.y - currentLetter.position.y, 2)
        );

        if (distance < 30) {
          newLetters[nextLetterIndex].collected = true;
          setNextLetterIndex((prev) => prev + 1);

          if (nextLetterIndex === letters.length - 1) {
            setIsWinner(true);
          }
        }
      }

      return newLetters;
    });
  }, [playerPos, nextLetterIndex, letters.length]);

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
        {!isWinner && (
          <>
            <Player position={playerPos} />
            {letters.map((letter, index) => (
              !letter.collected && (
                <Letter
                  key={index}
                  position={letter.position}
                  char={letter.char}
                  isNext={index === nextLetterIndex}
                />
              )
            ))}
          </>
        )}
        {isWinner && <WinnerText />}
      </div>
    </div>
  );
};

export default GameBoard;