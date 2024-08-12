import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "@/styles/progress-bar.module.css";
import tileStyles from "@/styles/tile.module.css";
import { GameContext } from "@/context/game-context";
import TimerIcon from "@/public/images/Timer5.svg"; // Import your SVG

const countdownTimes: Record<number, number> = {
  4: 5,
  8: 10,
  16: 15,
  32: 20,
  64: 35,
  128: 40,
  256: 45,
  512: 50,
  1024: 55,
  2048: 60,
  4096: 65,
  8192: 70,
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

  const getNextTarget = () => {
    const tiles = getTiles();
    const maxTileValue = Math.max(...tiles.map(tile => tile.value));
    return maxTileValue * 2;
  };

  const progress = ((timeLeft - 1) / (countdownTimes[targetNumber] - 1)) * 100;

  return (
    <div className={styles.progressBarContainer}>
      <div
        className={styles.timeLeft}
        style={{
          flexBasis: "20%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${TimerIcon.src})`, // Use the SVG as background
          backgroundSize: "120% 120%", // Increase the size of the image
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center -5px", // Shift the image upwards
          height: "100%", // Ensure the height scales the image correctly
          padding: "20px", // Optional: add padding to adjust the container size
        }}
      >
        <span className={styles.timeText}>
          {timeLeft > 60 ? `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s` : `${timeLeft}`}
        </span>
      </div>
      <div className={styles.progressBar} style={{ flexBasis: "60%" }}>
        <div
          className={styles.progress}
          style={{ 
            width: `${progress}%`,
            animation: `reverseCountdown ${timeLeft}s linear`,
          }}
        />
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
