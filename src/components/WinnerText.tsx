import React from "react";

const WinnerText = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-fade-in">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-2 animate-winner-text">
          {["S", "K", "R", "I", "B", "E", "R", " ", "W", "I", "N", "N", "E", "R"].map((letter, index) => (
            <span
              key={index}
              className={`text-6xl font-bold transform hover:scale-125 transition-transform ${
                index % 5 === 0
                  ? "text-winner1 animate-bounce"
                  : index % 5 === 1
                  ? "text-winner2 animate-pulse"
                  : index % 5 === 2
                  ? "text-winner3 animate-bounce"
                  : index % 5 === 3
                  ? "text-winner4 animate-pulse"
                  : "text-winner5 animate-bounce"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full animate-ping"
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