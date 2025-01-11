import React from "react";

interface WinnerTextProps {
  level: number;
}

const WinnerText = ({ level }: WinnerTextProps) => {
  const getMessage = () => {
    if (level <= 1) return "BARELY A WIN";
    if (level <= 3) return "GETTING BETTER";
    if (level <= 5) return "NOW WE'RE TALKING";
    if (level <= 7) return "IMPRESSIVE MOVES";
    if (level <= 9) return "ABSOLUTELY AMAZING";
    return "LEGENDARY PLAYER";
  };

  const getAnimationClasses = () => {
    if (level <= 1) return "animate-none";
    if (level <= 3) return "animate-bounce";
    if (level <= 5) return "animate-pulse";
    if (level <= 7) return "animate-bounce animate-pulse";
    if (level <= 9) return "animate-winner-text";
    return "animate-winner-text scale-110 transition-all duration-300";
  };

  const getTextColor = () => {
    if (level <= 1) return "text-gray-400";
    if (level <= 3) return "text-winner1";
    if (level <= 5) return "text-winner2";
    if (level <= 7) return "text-winner3";
    if (level <= 9) return "text-winner4";
    return "text-winner5";
  };

  const message = getMessage();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-fade-in">
      <div className="flex flex-col items-center space-y-4 px-4">
        <div className={`flex flex-wrap justify-center gap-2 ${getAnimationClasses()} max-w-[300px]`}>
          {message.split("").map((letter, index) => (
            <span
              key={index}
              className={`text-4xl font-bold transform hover:scale-125 transition-transform ${getTextColor()}`}
              style={{
                animationDelay: `${index * 0.1}s`,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          {[...Array(Math.min(5, Math.ceil(level/2)))].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-ping"
              style={{
                backgroundColor: i % 2 === 0 ? "#8B5CF6" : "#F97316",
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinnerText;