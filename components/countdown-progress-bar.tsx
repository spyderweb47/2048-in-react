import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "@/styles/progress-bar.module.css";
import tileStyles from "@/styles/tile.module.css";
import { GameContext } from "@/context/game-context";

// Define a mapping of target numbers to their respective countdown times
const countdownTimes: Record<number, number> = {
  4: 5,
  8: 10,
  16: 15,
  32: 20, // Add more targets as needed
  // Default to 30 seconds for any number not specified
};

export default function CountdownProgressBar({ targetNumber }: { targetNumber: number }) {
  const { isGameOver, onGameOver, getTiles } = useContext(GameContext);
  const [timeLeft, setTimeLeft] = useState(countdownTimes[targetNumber] || 30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          onGameOver();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isGameOver) return;

    const countdownTime = countdownTimes[targetNumber] || 30;
    setTimeLeft(countdownTime);
    startTimer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGameOver, targetNumber]);

  useEffect(() => {
    setTimeLeft(countdownTimes[targetNumber] || 30);
  }, [targetNumber]);

  // Determine the highest number on the board and calculate the next target
  const getNextTarget = () => {
    const tiles = getTiles();
    const maxTileValue = Math.max(...tiles.map(tile => tile.value));
    return maxTileValue * 2; // Next target is double the highest current tile
  };

  const progress = ((timeLeft - 1) / (countdownTimes[targetNumber] - 1)) * 100;

  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.timeLeft} style={{ flexBasis: "20%" }}>
        {timeLeft > 60
          ? `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`
          : `${timeLeft}s`}
      </div>
      <div className={styles.progressBar} style={{ flexBasis: "60%" }}>
        <div className={styles.progress} style={{ 
    width: `${progress}%`, 
    animation: `reverseCountdown ${timeLeft}s linear` 
  }} />
      </div>
      <div
        className={`${tileStyles.tile} ${tileStyles[`tile${getNextTarget()}`]}`}
        style={{
          position: "relative", 
          transform: "scale(0.5)",
          flexBasis: "20%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {getNextTarget()}
      </div>
    </div>
  );
}
