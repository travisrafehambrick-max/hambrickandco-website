import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#top" className={styles.logo}>
          Hambrick <span>&amp; Co.</span>
        </a>
        <nav className={styles.nav} aria-label="Primary">
          <a href="#method">How It Works</a>
          <a href="#capabilities">What We Do</a>
          <a href="#why">Why Us</a>
          <a href="mailto:travis@hambrickco.com" className={styles.navCta}>
            Book a Call
          </a>
        </nav>
      </div>
    </header>
  );
}
