"use client";

import {
  AIS_CENTERED_DIM,
  PARALLAX,
  ScrollTrigger,
  gsap,
} from "@/lib/register-gsap";

const DEPTH = PARALLAX;

/**
 * Centered-beat brighten + depth parallax inside a page root.
 * Reduced-motion callers should skip this and freeze layers instead.
 */
export function bindAiasLive(root: HTMLElement) {
  const beats = Array.from(root.querySelectorAll<HTMLElement>(".intro-beat"));
  const depths = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));

  beats.forEach((el) => {
    const apply = () => {
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const viewMid = window.innerHeight / 2;
      const span = window.innerHeight * 0.48;
      const t = Math.max(0, 1 - Math.abs(mid - viewMid) / span);
      gsap.set(el, { opacity: AIS_CENTERED_DIM + (1 - AIS_CENTERED_DIM) * t });
    };
    apply();
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: apply,
      onRefresh: apply,
    });
  });

  depths.forEach((el) => {
    const key = el.dataset.depth as keyof typeof DEPTH;
    const rate = DEPTH[key];
    if (!rate) return;
    const fixed = getComputedStyle(el).position === "fixed";
    if (fixed || key === "far") {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        scrub: 0.55,
        onUpdate: (self) => {
          gsap.set(el, { y: (self.progress - 0.5) * window.innerHeight * rate });
        },
      });
      return;
    }
    gsap.fromTo(
      el,
      { y: () => window.innerHeight * rate * 0.35 },
      {
        y: () => -window.innerHeight * rate * 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.55,
        },
      },
    );
  });
}

export function freezeAiasLive(root: HTMLElement) {
  gsap.set(root.querySelectorAll(".intro-beat"), { opacity: 1, y: 0, filter: "none" });
  gsap.set(root.querySelectorAll("[data-depth]"), { y: 0, filter: "none" });
}
