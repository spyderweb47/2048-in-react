import React, { useEffect, useState } from 'react';
import styles from '@/styles/Leaderboard.module.css';
import axios from 'axios';

interface Player {
  _id: string;
  username: string;
  highScore: number;
  avatar?: string; // Optional avatar field
}

interface LeaderboardProps {
  refresh: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ refresh }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/leaderboard');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchLeaderboard();
    }
  }, [refresh]);

  return (
    <div className={styles.leaderboard}>
      <div className={styles.header}>
        <span className={styles.column}>Rank</span>
        <span className={styles.column}></span>
        <span className={styles.column}>Name</span>
        <span className={styles.column}>Score</span>
      </div>
      {players.map((player, index) => (
        <div key={player._id} className={styles.player}>
          <span className={styles.rank}>{index + 1}.</span>
          <img src={player.avatar || '/images/avatar.png'} alt={`${player.username}'s avatar`} className={styles.avatar} />
          <span className={styles.name}>{player.username}</span>
          <span className={styles.score}>{player.highScore}</span>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
