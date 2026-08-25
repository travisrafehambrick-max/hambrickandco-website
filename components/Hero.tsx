import OrbitField from "./OrbitField";
import DiagnosticPanel from "./DiagnosticPanel";
import MagneticButton from "./MagneticButton";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.field}>
        <OrbitField />
      </div>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="eyebrow">Growth Partner</p>
          <h1 className={styles.headline}>
            We find the pain your business is losing money on. Then we fix
            it.
          </h1>
          <p className={styles.sub}>
            Hambrick &amp; Co. is a growth partner for revenue businesses. We
            identify what&rsquo;s leaking revenue, build the system to fix
            it, and stay on to keep it running.
          </p>
          <div className={styles.ctaRow}>
            <MagneticButton href="mailto:travis@hambrickco.com">
              Book a Discovery Call
            </MagneticButton>
            <MagneticButton href="#method" variant="secondary">
              See How It Works
            </MagneticButton>
          </div>
        </div>
        <div className={styles.panelSlot}>
          <DiagnosticPanel />
        </div>
      </div>
    </section>
  );
}
