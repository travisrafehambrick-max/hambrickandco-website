import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <span>Hambrick &amp; Co.</span>
        <span className={styles.divider} aria-hidden="true">
          /
        </span>
        <span>Growth Partner</span>
        <span className={styles.divider} aria-hidden="true">
          /
        </span>
        <span>Charlottesville, VA</span>
      </div>
    </footer>
  );
}
