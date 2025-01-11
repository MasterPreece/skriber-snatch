import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Player from "./Player";
import Letter from "./Letter";
import WinnerText from "./WinnerText";
import BadDot from "./BadDot";
import Leaderboard from "./Leaderboard";
import LeaderboardEntry from "./LeaderboardEntry";
import { useToast } from "@/components/ui/use-toast";

interface Position {
  x: number;
  y: number;
}

interface LetterState {
  char: string;
  position: Position;
  collected: boolean;
}

interface BadDotState {
  position: Position;
}

interface Score {
  alias: string;
  score: number;
  date: string;
}

const GameBoard = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 30, y: 30 });
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [badDots, setBadDots] = useState<BadDotState[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const { toast } = useToast();
  const speed = 15;
  const badDotSpeed = 1;

  const initializeGame = useCallback(() => {
    const chars = ["S", "K", "R", "I", "B", "E", "R"];
    const newLetters = chars.map((char) => ({
      char,
      position: {
        x: Math.floor(Math.random() * 300),
        y: Math.floor(Math.random() * 300),
      },
      collected: false,
    }));

    // Define quadrants (excluding top-left which is for player)
    const quadrants = [
      { minX: 150, maxX: 300, minY: 0, maxY: 150 },    // top-right
      { minX: 0, maxX: 150, minY: 150, maxY: 300 },    // bottom-left
      { minX: 150, maxX: 300, minY: 150, maxY: 300 },  // bottom-right
    ];

    const newBadDots: BadDotState[] = [];
    const minDistance = 50;

    // Place one bad dot in each remaining quadrant
    quadrants.forEach(quadrant => {
      let placed = false;
      while (!placed) {
        const newPosition = {
          x: Math.floor(Math.random() * (quadrant.maxX - quadrant.minX)) + quadrant.minX,
          y: Math.floor(Math.random() * (quadrant.maxY - quadrant.minY)) + quadrant.minY,
        };

        const isTooClose = newBadDots.some(dot => {
          const dx = dot.position.x - newPosition.x;
          const dy = dot.position.y - newPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < minDistance;
        });

        if (!isTooClose) {
          newBadDots.push({ position: newPosition });
          placed = true;
        }
      }
    });

    setLetters(newLetters);
    setBadDots(newBadDots);
    setPlayerPos({ x: 30, y: 30 });
    setTimeLeft(30);
    setScore(0);
    setIsWinner(false);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isWinner && gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isWinner && gameStarted) {
      setGameOver(true);
    }
  }, [timeLeft, isWinner, gameStarted]);

  // Bad dots movement logic
  useEffect(() => {
    if (!gameStarted || gameOver || isWinner) return;

    const moveInterval = setInterval(() => {
      setBadDots((prevDots) =>
        prevDots.map((dot) => {
          const dx = playerPos.x - dot.position.x;
          const dy = playerPos.y - dot.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 1) return dot;

          const newX = dot.position.x + (dx / distance) * badDotSpeed;
          const newY = dot.position.y + (dy / distance) * badDotSpeed;

          return {
            position: {
              x: Math.max(0, Math.min(300, newX)),
              y: Math.max(0, Math.min(300, newY)),
            },
          };
        })
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [playerPos, gameStarted, gameOver, isWinner]);

  // Check for collision with bad dots
  useEffect(() => {
    if (!gameStarted || gameOver || isWinner) return;

    const checkBadDotCollision = () => {
      const collision = badDots.some((dot) => {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - dot.position.x, 2) +
          Math.pow(playerPos.y - dot.position.y, 2)
        );
        return distance < 20;
      });

      if (collision) {
        setGameOver(true);
      }
    };

    checkBadDotCollision();
  }, [playerPos, badDots, gameStarted, gameOver, isWinner]);

  const calculateScore = useCallback(() => {
    const baseScore = Math.floor((timeLeft / 30) * 1000000);
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
      if (!gameStarted || gameOver || isWinner) return;
      
      setPlayerPos((prev) => {
        let newPos = { ...prev };
        const maxWidth = 350;  // Increased from 300 to account for board size
        const maxHeight = 350; // Increased from 300 to account for board size

        switch (e.key) {
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

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, gameOver, isWinner, speed]);

  useEffect(() => {
    checkCollision();
  }, [playerPos, checkCollision]);

  const handleSaveScore = (alias: string) => {
    const newScore = {
      alias,
      score,
      date: new Date().toISOString(),
    };
    
    const newScores = [...scores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setScores(newScores);
    setShowEntryForm(false);
    
    toast({
      title: "Score Saved!",
      description: `${alias} - ${score.toLocaleString()} points`,
    });
  };

  useEffect(() => {
    if (isWinner && !showEntryForm) {
      const lowestScore = scores[9]?.score || 0;
      if (scores.length < 10 || score > lowestScore) {
        setShowEntryForm(true);
      }
    }
  }, [isWinner, score, scores, showEntryForm]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-[400px] h-[400px] bg-gradient-to-b from-[#e6e9f0] to-[#eef1f5] overflow-hidden border border-gray-200 rounded-lg shadow-lg">
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
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
