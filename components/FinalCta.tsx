import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";
import styles from "./FinalCta.module.css";

export default function FinalCta() {
  return (
    <section className={styles.contact} id="contact">
      <div className={`wrap ${styles.wrap}`}>
        <ScrollReveal as="p" className={`eyebrow ${styles.center}`}>
          Get Started
        </ScrollReveal>
        <ScrollReveal as="h2" className={styles.heading}>
          Ready to find out where the pain is?
        </ScrollReveal>
        <ScrollReveal as="p" className={styles.sub}>
          Book a discovery call and we&rsquo;ll start with what&rsquo;s
          actually costing you revenue.
        </ScrollReveal>
        <ScrollReveal className={styles.ctaWrap}>
          <MagneticButton href="mailto:travis@hambrickco.com" size="large">
            Book a Discovery Call
          </MagneticButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
