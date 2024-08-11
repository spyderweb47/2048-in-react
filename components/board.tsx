import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Tile as TileModel } from "@/models/tile";
import styles from "@/styles/board.module.css";
import Tile from "./tile";
import CountdownProgressBar from "./countdown-progress-bar"; // Import the new component
import { GameContext } from "@/context/game-context";
import MobileSwiper, { SwipeInput } from "./mobile-swiper";
import Leaderboard from './Leaderboard'; // Import the Leaderboard component

function GameOverPopup({ onRestart }: { onRestart: () => void }) {
  const touchRef = useRef({ x: 0, y: 0, timeStamp: 0 });

  const registerTouch = (event: React.TouchEvent) => {
    touchRef.current = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
      timeStamp: event.timeStamp,
    };
  };

  const handleTouch = (event: React.TouchEvent, callback: () => void) => {
    const thresholdPx = 20;
    const thresholdMs = 500;

    if (
      Math.abs(event.changedTouches[0].clientX - touchRef.current.x) <= thresholdPx &&
      Math.abs(event.changedTouches[0].clientY - touchRef.current.y) <= thresholdPx &&
      event.timeStamp - touchRef.current.timeStamp <= thresholdMs
    ) {
      event.preventDefault();
      callback();
    }

    touchRef.current = { x: 0, y: 0, timeStamp: 0 };
  };

  return (
    <div
      className={styles.popup}
      onTouchStart={(e) => registerTouch(e)}
      onTouchEnd={(e) => handleTouch(e, onRestart)}
    >
      <div className={styles.popupContent}>
        <h2>Game Over</h2>
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
}

export default function Board() {
  const { getTiles, moveTiles, startGame, isGameOver, score } = useContext(GameContext);
  const initialized = useRef(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [targetNumber, setTargetNumber] = useState(2);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.code) {
        case "ArrowUp":
          moveTiles("move_up");
          break;
        case "ArrowDown":
          moveTiles("move_down");
          break;
        case "ArrowLeft":
          moveTiles("move_left");
          break;
        case "ArrowRight":
          moveTiles("move_right");
          break;
      }
    },
    [moveTiles],
  );

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          moveTiles("move_right");
        } else {
          moveTiles("move_left");
        }
      } else {
        if (deltaY > 0) {
          moveTiles("move_down");
        } else {
          moveTiles("move_up");
        }
      }
    },
    [moveTiles],
  );

  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCellsCount = 16;

    for (let index = 0; index < totalCellsCount; index += 1) {
      cells.push(<div className={styles.cell} key={index} />);
    }

    return cells;
  };

  const renderTiles = () => {
    return getTiles().map((tile: TileModel) => (
      <Tile key={`${tile.id}`} {...tile} />
    ));
  };

  const handleRestart = useCallback(() => {
    setShowGameOver(false);
    setTargetNumber(2);
    startGame(); // Properly reset and start the game
  }, [startGame]);

  useEffect(() => {
    if (initialized.current === false) {
      startGame();
      initialized.current = true;
    }
  }, [startGame]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (isGameOver) {
      setShowGameOver(true);
    }
  }, [isGameOver]);

  // Check if player reached the target number
  useEffect(() => {
    const tiles = getTiles();
    const maxTileValue = Math.max(...tiles.map(tile => tile.value));
    if (maxTileValue >= targetNumber) {
      setTargetNumber(targetNumber * 2);
    }
  }, [getTiles, targetNumber]);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
      <Leaderboard />
      </div>
      <MobileSwiper onSwipe={isGameOver ? () => {} : handleSwipe}>
        <div className={styles.board}>
          <CountdownProgressBar targetNumber={targetNumber} />
          <div style={{ height: '20px' }}></div> {/* Spacer element */}
          <div className={styles.tileContainer}>
            <div className={styles.tiles}>{renderTiles()}</div>
            <div className={styles.grid}>{renderGrid()}</div>
            {showGameOver && <GameOverPopup onRestart={handleRestart} />}
          </div>
        </div>
      </MobileSwiper>
      <div className={styles.sidebar}>
        {/* You can add other components here in the future */}
        {/* <Leaderboard /> */}
      </div>
    </div>
  );
}
