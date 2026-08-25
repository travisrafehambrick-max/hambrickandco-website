import ScrollReveal from "./ScrollReveal";
import styles from "./WhyUs.module.css";

const ITEMS = [
  {
    title: "Pain-first, not service-first",
    body: "We don't sell a fixed package. We start with what's actually costing you revenue and build from there.",
  },
  {
    title: "AI-delivered, founder-overseen",
    body: "AI handles 80%+ of delivery. Travis handles strategy, judgment, and the relationship.",
  },
  {
    title: "Skin in the game",
    body: "Retainer, equity, or revenue share — structured around the scope, so incentives stay aligned.",
  },
];

export default function WhyUs() {
  return (
    <section className={`section-border ${styles.why}`} id="why">
      <div className="wrap">
        <ScrollReveal as="p" className="eyebrow">
          Why Hambrick &amp; Co.
        </ScrollReveal>
        <ScrollReveal as="h2">Built differently, on purpose.</ScrollReveal>

        <div className={styles.grid}>
          {ITEMS.map((item, i) => (
            <ScrollReveal
              key={item.title}
              delay={i * 80}
              className={styles.item}
            >
              <span className={styles.mark} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
