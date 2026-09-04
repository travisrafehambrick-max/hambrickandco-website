"use client";

import { useRef } from "react";
import { AIS_STACK_SCALE, LINEAR, gsap, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const OUTCOMES = [
  {
    n: "01",
    verb: "Missed",
    body: "The inbound sat. A voicemail, an estimate left open, a shop that did not write back.",
    live: false,
  },
  {
    n: "02",
    verb: "Alert",
    body: "The sheet stays on the lock screen until someone marks it. The wait is the leak.",
    live: false,
  },
  {
    n: "03",
    verb: "Callback",
    body: "A sentence sent back on the tools already in the truck. First reply out.",
    live: true,
  },
  {
    n: "04",
    verb: "Recovered",
    body: "The estimate hold is on the calendar. The current held. Gold only here.",
    live: true,
  },
] as const;

/** Incoming card climbs over the prior. Prior scales to ~.95 and darkens. */
export function StackedOutcomes() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced === null) return;
      const cards = Array.from(root.current?.querySelectorAll<HTMLElement>(".outcome-card") ?? []);
      if (reduced) {
        gsap.set(cards, { scale: 1, filter: "none" });
        return;
      }
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(
          card,
          { scale: 1, filter: "brightness(1)" },
          {
            scale: AIS_STACK_SCALE,
            filter: "brightness(0.42)",
            ease: LINEAR,
            scrollTrigger: {
              trigger: next,
              start: "top 82%",
              end: "top 28%",
              scrub: 0.55,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="seam-black border-t bg-ink px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[760px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-matte/40">Outcomes</p>
        <ol className="mt-8">
          {OUTCOMES.map((card, i) => (
            <li key={card.n} className="relative" style={{ zIndex: i + 1 }}>
              <article className="outcome-card sticky top-[18vh] mb-6 min-h-[52vh] origin-top border border-black bg-[#161616] p-8 md:p-12">
                <p
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                    card.live && card.verb === "Recovered" ? "text-gold" : "text-matte/40"
                  }`}
                >
                  {card.n} · {card.verb}
                </p>
                <p className="mt-8 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.08]">
                  {card.body}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
