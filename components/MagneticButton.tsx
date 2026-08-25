"use client";

import { useRef, type ReactNode } from "react";
import styles from "./MagneticButton.module.css";

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  size = "regular",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "regular" | "large";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const px = (relX / rect.width) * 100;
    const py = (relY / rect.height) * 100;

    const offsetX = ((relX - rect.width / 2) / rect.width) * 14;
    const offsetY = ((relY - rect.height / 2) / rect.height) * 14;

    el.style.setProperty("--mx", `${px}%`);
    el.style.setProperty("--my", `${py}%`);
    el.style.setProperty("--tx", `${offsetX}px`);
    el.style.setProperty("--ty", `${offsetY}px`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  };

  const classes = [
    styles.btn,
    variant === "secondary" ? styles.secondary : "",
    size === "large" ? styles.large : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      ref={ref}
      href={href}
      className={classes}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        &rarr;
      </span>
    </a>
  );
}
