import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Copyright Notice */}
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} EvoEdge Solutions. All rights reserved.
        </div>

        {/* App Version with Status Dot */}
        <div className={styles.versionContainer}>
          {/* Subtle glowing dot to indicate "system online" */}
          <span className={styles.statusDotContainer}>
            <span className={styles.ping}></span>
            <span className={styles.dot}></span>
          </span>
          <span className={styles.versionText}>
            v1.0.0
          </span>
        </div>

      </div>
    </footer>
  );
};