import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        {/* <Link href="/">2048</Link> */}
        {/* <button onClick={toggleMenu} className={styles.menuButton}>
          ☰
        </button> */}
      </div>
      <w3m-button />
{/* 
      <ul className={`${styles.navLinks} ${isOpen ? styles.show : ''}`}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul> */}
    </nav>
  );
};

export default Navbar;
