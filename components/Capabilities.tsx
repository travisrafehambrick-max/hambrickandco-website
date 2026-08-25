import ScrollReveal from "./ScrollReveal";
import styles from "./Capabilities.module.css";

const ITEMS = [
  {
    title: "Revenue Operations",
    body: "We fix the pipeline, reporting, and handoffs that quietly cost you closed deals.",
  },
  {
    title: "Marketing Systems",
    body: "We build acquisition and retention engines that run without constant babysitting.",
  },
  {
    title: "Tech & Automation",
    body: "We automate the manual work that's capping your team's output.",
  },
  {
    title: "Strategy",
    body: "We set the direction and priorities so every build serves the same goal.",
  },
];

export default function Capabilities() {
  return (
    <section
      className={`section-border ${styles.capabilities}`}
      id="capabilities"
    >
      <div className="wrap">
        <ScrollReveal as="p" className="eyebrow">
          What We Do
        </ScrollReveal>
        <ScrollReveal as="h2">
          Full-stack support, applied where the pain actually is.
        </ScrollReveal>

        <div className={styles.grid}>
          {ITEMS.map((item, i) => (
            <ScrollReveal
              key={item.title}
              delay={i * 80}
              className={`glass-panel ${styles.card}`}
            >
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
