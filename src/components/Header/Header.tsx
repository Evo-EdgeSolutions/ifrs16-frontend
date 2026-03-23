import Image from 'next/image';
import { Heading } from '../ui/Heading/Heading'; // Importing your existing Heading component
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSide}>
        <Heading className={styles.headingText}>IFRS16 Calculation</Heading>
      </div>
      <div className={styles.rightSide}>
        {/* Make sure your image is placed in the 'public' folder */}
        <Image 
          src="/images/logo.png" 
          alt="Header Logo" 
          width={200} 
          height={200} 
          // If you don't know the exact dimensions, you can use layout="fill" or standard <img> 
        />
      </div>
    </header>
  );
};