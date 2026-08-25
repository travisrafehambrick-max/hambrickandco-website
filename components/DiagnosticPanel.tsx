"use client";

import { useEffect, useState } from "react";
import styles from "./DiagnosticPanel.module.css";

const STATES = [
  {
    label: "SIGNAL DETECTED",
    detail: "Anomaly in customer response pattern",
  },
  {
    label: "REVENUE LEAK",
    detail: "Isolated in pipeline handoff",
  },
  {
    label: "SYSTEM RESPONSE",
    detail: "Fix deployed, monitoring engaged",
  },
];

const BAR_COUNT = 24;

export default function DiagnosticPanel() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % STATES.length);
    }, 3400);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const current = STATES[index];

  return (
    <div className={`${styles.panel} glass-panel`}>
      <div className={styles.head}>
        <span className={styles.dot} />
        <span className={styles.label}>{current.label}</span>
      </div>
      <p className={styles.detail}>{current.detail}</p>
      <div className={styles.wave} aria-hidden="true">
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <span
            key={i}
            className={styles.bar}
            style={
              reduceMotion
                ? { height: `${20 + ((i * 37) % 60)}%`, animationPlayState: "paused" }
                : { animationDelay: `${(i % 8) * 0.11}s` }
            }
          />
        ))}
      </div>
      <div className={styles.states} role="list">
        {STATES.map((s, i) => (
          <span
            key={s.label}
            role="listitem"
            className={i === index ? styles.stateActive : styles.state}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
