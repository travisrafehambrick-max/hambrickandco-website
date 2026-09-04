"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power2.inOut", duration: 0.7 });
}

export { gsap, ScrollTrigger, useGSAP };
export { aisEase, AIS_REVEAL, AIS_STAGGER } from "@/lib/ais-ease";

/** Doctrine: no bounce, elastic, back, or breathe. */
export const EASE = "power2.inOut";
export const EASE_OUT = "power2.out";
export const EASE_IN = "power2.in";
export const LINEAR = "none";

/** Stillness-before-climax on the recovered beat, in seconds. */
export const STILLNESS = 0.55;
