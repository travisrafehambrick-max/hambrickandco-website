"use client";

import Link from "next/link";
import { useRef } from "react";
import { EASE_OUT, gsap, useGSAP } from "@/lib/register-gsap";

type Props = {
  href: string;
  children: React.ReactNode;
  tone?: "gold" | "ghost-light" | "ghost-dark";
  external?: boolean;
};

export function LiveButton({ href, children, tone = "gold", external }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const bar = line.current;
      if (!el || !bar) return;
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

      const enter = () =>
        gsap.to(bar, { scaleX: 1, duration: 0.32, ease: EASE_OUT, overwrite: "auto" });
      const leave = () =>
        gsap.to(bar, { scaleX: 0, duration: 0.28, ease: EASE_OUT, overwrite: "auto" });

      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("focus", enter);
      el.addEventListener("blur", leave);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
        el.removeEventListener("focus", enter);
        el.removeEventListener("blur", leave);
      };
    },
    { scope: ref },
  );

  const skin =
    tone === "gold"
      ? "bg-gold text-ink"
      : tone === "ghost-light"
        ? "bg-transparent text-matte border border-matte/35"
        : "bg-transparent text-ink border border-ink/30";

  const shared = `relative inline-flex items-center justify-center px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] ${skin} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold`;

  const inner = (
    <>
      <span>{children}</span>
      <span
        ref={line}
        aria-hidden
        className="pointer-events-none absolute inset-x-3 bottom-[7px] h-px origin-left bg-ink/70"
      />
    </>
  );

  if (external || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a ref={ref} href={href} className={shared}>
        {inner}
      </a>
    );
  }

  return (
    <Link ref={ref} href={href} className={shared}>
      {inner}
    </Link>
  );
}
