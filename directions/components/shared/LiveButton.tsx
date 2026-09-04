"use client";

import Link from "next/link";
import { useRef } from "react";
import { aisEase, gsap, useGSAP } from "@/lib/register-gsap";
import { bindMagnetic } from "@/lib/bind-magnetic";

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
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      if (reduce) return;

      const releaseMagnetic = bindMagnetic(el, 20);

      const enter = () => {
        gsap.to(bar, { scaleX: 1, duration: 0.32, ease: aisEase, overwrite: "auto" });
      };
      const leave = () => {
        gsap.to(bar, { scaleX: 0, duration: 0.28, ease: aisEase, overwrite: "auto" });
      };

      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("focus", enter);
      el.addEventListener("blur", leave);
      return () => {
        releaseMagnetic();
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
      ? "metal-cta"
      : tone === "ghost-light"
        ? "metal-cta-ghost text-matte"
        : "metal-cta-ghost text-ink";

  const shared = `relative inline-flex items-center justify-center px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] ${skin} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold`;

  const inner = (
    <>
      <span>{children}</span>
      <span
        ref={line}
        aria-hidden
        className="pointer-events-none absolute inset-x-3 bottom-[7px] h-px origin-left metal-rule"
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
