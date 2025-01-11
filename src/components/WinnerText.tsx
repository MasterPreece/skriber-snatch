import React from "react";

interface WinnerTextProps {
  level: number;
}

const WinnerText = ({ level }: WinnerTextProps) => {
  const getMessage = () => {
    if (level <= 1) return "WOW YOU'RE TERRIBLE AT THIS";
    if (level <= 3) return "STILL PRETTY BAD TBH";
    if (level <= 5) return "MEH, I GUESS THAT'S SOMETHING";
    if (level <= 7) return "OK NOT BAD ACTUALLY";
    if (level <= 9) return "HEY YOU'RE GETTING GOOD!";
    if (level <= 11) return "IMPRESSIVE MOVES!";
    if (level <= 13) return "AMAZING PERFORMANCE!";
    if (level <= 15) return "ABSOLUTELY INCREDIBLE!";
    return "YOU'RE A LEGENDARY PLAYER!";
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
    if (level <= 1) return "text-red-500";
    if (level <= 3) return "text-orange-500";
    if (level <= 5) return "text-yellow-500";
    if (level <= 7) return "text-green-500";
    if (level <= 9) return "text-blue-500";
    return "text-purple-500";
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