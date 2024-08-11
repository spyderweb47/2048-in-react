import React from 'react';
import styles from '@/styles/Leaderboard.module.css';

const players = [
  { id: 1, name: 'Jason W.', score: '20000', avatar: 'path_to_avatar_1' },
  { id: 2, name: 'sasa', score: '10000', avatar: 'path_to_avatar_2' },
  { id: 3, name: 'RJ.', score: '5000', avatar: 'path_to_avatar_3' },
  { id: 4, name: 'Derralle P.', score: '5000', avatar: 'path_to_avatar_4' },
  { id: 5, name: 'Derralle P.', score: '4000', avatar: 'path_to_avatar_4' },
  { id: 6, name: 'Derralle P.', score: '3000', avatar: 'path_to_avatar_4' },
  { id: 7, name: 'Derralle P.', score: '2000', avatar: 'path_to_avatar_4' },
  
];

const Leaderboard = () => {
  return (
    <div className={styles.leaderboard}>
      <div className={styles.header}>
        <span className={styles.column}>Rank</span>
        <span className={styles.column}></span>
        <span className={styles.column}>Name</span>
        <span className={styles.column}>Score</span>
      </div>
      {players.map(player => (
        <div key={player.id} className={styles.player}>
          <span className={styles.rank}>{player.id}.</span>
          <img src='/images/avatar.png' alt={`${player.name}'s avatar`} className={styles.avatar} />
          <span className={styles.name}>{player.name}</span>
          <span className={styles.score}>{player.score}</span>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
