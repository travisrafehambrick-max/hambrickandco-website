"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Gold page-position bar + glowing dot. Cyan on AIS → metallic gold here. */
export function PageProgress() {
  const pathname = usePathname();
  const fill = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced === null) return;
      const bar = fill.current;
      const bead = dot.current;
      if (!bar || !bead) return;

      const apply = (p: number) => {
        const n = Math.max(0, Math.min(1, p));
        gsap.set(bar, { scaleX: n, transformOrigin: "left center" });
        gsap.set(bead, { left: `${n * 100}%` });
      };

      if (reduced) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        apply(max <= 0 ? 1 : window.scrollY / max);
        gsap.set(bead, { filter: "none", boxShadow: "none" });
        return;
      }

      apply(0);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
    },
    { dependencies: [reduced, pathname], revertOnUpdate: true },
  );

  return (
    <div
      className="page-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      role="progressbar"
      aria-label="Page position"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="absolute inset-0 bg-matte/10" />
      <span ref={fill} className="absolute inset-y-0 left-0 w-full origin-left bg-gold" />
      <span
        ref={dot}
        aria-hidden
        className="progress-dot absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
      />
    </div>
  );
}
