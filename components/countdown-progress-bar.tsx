import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "@/styles/progress-bar.module.css";
import { GameContext } from "@/context/game-context";

const countdown_time = 5 ; // 5 in seconds
export default function CountdownProgressBar({ targetNumber }: { targetNumber: number }) {
  const { isGameOver, onGameOver } = useContext(GameContext);
  const [timeLeft, setTimeLeft] = useState(countdown_time); // 30 seconds countdown
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

    setTimeLeft(countdown_time); // Reset to 30 seconds when the component mounts
    startTimer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGameOver]);

  useEffect(() => {
    setTimeLeft(countdown_time); // Reset the timer when the target number changes
  }, [targetNumber]);

  
  let new_timeleft = timeLeft - 1
  let new_progress_countdown = countdown_time -1 
  const progress = (new_timeleft / new_progress_countdown) * 100;

  return (
    <div className={styles.progressBar}>
      <div className={styles.progress} style={{ width: `${progress}%` }} />
    </div>
  );
}
