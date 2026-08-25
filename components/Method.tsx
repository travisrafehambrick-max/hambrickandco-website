"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import styles from "./Method.module.css";

const STEPS = [
  {
    num: "01",
    title: "Find the Pain",
    body: "We audit reviews, calls, data, and market signals to find where revenue is leaking.",
    tag: "DIAGNOSIS",
  },
  {
    num: "02",
    title: "Build the Fix",
    body: "AI-delivered systems, automations, and growth infrastructure designed around the actual problem.",
    tag: "DELIVERY",
  },
  {
    num: "03",
    title: "Keep It Running",
    body: "Ongoing care, monitoring, and optimization so the fix compounds.",
    tag: "COMPOUNDING",
  },
];

export default function Method() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = refs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section-border ${styles.method}`} id="method">
      <div className="wrap">
        <ScrollReveal as="p" className="eyebrow">
          How It Works
        </ScrollReveal>
        <ScrollReveal as="h2">A three-part method, run start to finish.</ScrollReveal>

        <div className={styles.layout}>
          <div className={styles.sticky}>
            <div className={`glass-panel ${styles.visual}`}>
              <span className={styles.visualTag}>{STEPS[active].tag}</span>
              <span className={styles.visualNum}>{STEPS[active].num}</span>
              <span className={styles.visualTitle}>{STEPS[active].title}</span>
              <div className={styles.progress}>
                {STEPS.map((s, i) => (
                  <span
                    key={s.num}
                    className={i === active ? styles.dotActive : styles.dot}
                  />
                ))}
              </div>
            </div>
          </div>

          <ol className={styles.steps}>
            {STEPS.map((step, i) => (
              <li
                key={step.num}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`${styles.step} ${
                  i === active ? styles.stepActive : ""
                }`}
              >
                <span className={styles.stepNum}>{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
