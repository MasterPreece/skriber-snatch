import React from "react";

const WinnerText = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex space-x-2 animate-winner-text">
        {["S", "K", "R", "I", "B", "E", "R", " ", "W", "I", "N", "N", "E", "R"].map((letter, index) => (
          <span
            key={index}
            className={`text-6xl font-bold ${
              index % 5 === 0
                ? "text-winner1"
                : index % 5 === 1
                ? "text-winner2"
                : index % 5 === 2
                ? "text-winner3"
                : index % 5 === 3
                ? "text-winner4"
                : "text-winner5"
            }`}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WinnerText;