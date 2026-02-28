import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>© {new Date().getFullYear()} Antoine</span>
        <span className={styles.sep}>•</span>
        <a className={styles.link} href="https://github.com/Ratsock6" target="_blank" rel="noopener noreferrer">
          Github
        </a>
        <span className={styles.sep}>•</span>
        <a className={styles.link} href="https://www.linkedin.com/in/antoine-allou/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
    </footer>
  );
}