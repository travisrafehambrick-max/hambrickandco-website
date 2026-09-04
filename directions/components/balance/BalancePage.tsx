"use client";

import { useRef, useState } from "react";
import { AREA, CTA_AUDIT, CTA_FLOW, EMAIL, PHONE, PHONE_HREF } from "@/lib/facts";
import { EASE, LINEAR, STILLNESS, gsap, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { ObjectSlot } from "@/components/shared/CanvasSlot";

export function BalancePage() {
  const root = useRef<HTMLDivElement>(null);
  const slip = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [face, setFace] = useState<"missed" | "recovered">("missed");

  useGSAP(
    () => {
      if (reduced === null) return;

      if (reduced) {
        gsap.set(slip.current, { x: 0, y: 0 });
        setProgress(1);
        setFace("recovered");
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: EASE } });
      intro
        .fromTo(slip.current, { x: -48, rotate: -3 }, { x: -8, rotate: -1.2, duration: 0.7 })
        .add(() => setFace("recovered"), 0.45)
        .to({}, { duration: STILLNESS });
      intro.eventCallback("onUpdate", () => setProgress(intro.progress() * 0.32));

      const pin = gsap.timeline({
        defaults: { ease: LINEAR },
        scrollTrigger: {
          trigger: ".balance-pin",
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.75,
        },
      });

      pin
        .to(slip.current, { x: 72, y: 10, rotate: 0, duration: 0.8 })
        .to(
          {},
          {
            duration: 0.8,
            onUpdate() {
              const p = 0.32 + this.progress() * 0.68;
              setProgress(p);
              setFace(p > 0.45 ? "recovered" : "missed");
            },
          },
          0,
        )
        .to({}, { duration: 0.2 });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="min-h-screen bg-matte text-ink">
      <header className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-6">
          <Wordmark tone="light" />
          <LiveButton href="#ask" tone="ghost-dark">
            {CTA_AUDIT}
          </LiveButton>
        </div>
      </header>

      <section className="relative mx-auto flex min-h-[100svh] max-w-[1100px] flex-col justify-between px-6 pb-16 pt-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/40">04 — Balance Object</p>
          <h1 className="mt-8 max-w-xl font-display text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95]">
            A quiet field.
            <br />
            One object.
          </h1>
        </div>
        <article
          ref={slip}
          className="relative z-10 w-[min(100%,340px)] border border-ink/15 bg-matte p-6 shadow-[8px_12px_0_0_#12121208]"
        >
          <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${face === "recovered" ? "text-gold" : "text-ink/40"}`}>
            {face === "recovered" ? "Recovered" : "Missed"}
          </p>
          <p className="mt-6 font-display text-[1.65rem] leading-snug">
            {face === "missed"
              ? "We sent the number. Nobody wrote back."
              : "The estimate came back before the truck left."}
          </p>
          <button
            type="button"
            onClick={() => setFace((f) => (f === "missed" ? "recovered" : "missed"))}
            className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            Turn the slip
          </button>
        </article>
        <p className="max-w-xs font-sans text-[14px] text-ink/50">
          Two faces of one slip. {AREA}.
        </p>
      </section>

      <section className="balance-pin">
        <div className="relative mx-auto min-h-[100svh] max-w-[1100px]">
          <div className="absolute inset-0">
            <ObjectSlot progress={progress} />
          </div>
          <p className="absolute bottom-8 left-6 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/35">
            One object. The slip is the current.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-28">
        <div className="max-w-md">
          <p className="font-display text-[clamp(1.8rem,3vw,2.4rem)] leading-snug">
            No fake KPIs. No partner badges. Just the tactile quiet of a recovery that held its
            balance.
          </p>
          <p className="mt-6 font-sans text-[15px] text-ink/55">
            Hambrick &amp; Co. works the quiet hours between a missed inbound and a reply that lands.{" "}
            <a className="text-gold" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            {" · "}
            <a className="text-gold" href={PHONE_HREF}>
              {PHONE}
            </a>
          </p>
        </div>
      </section>

      <section id="ask" className="border-t border-ink/10 px-6 py-24">
        <div className="mx-auto grid max-w-[1100px] gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95]">
              Request a recovery audit.
            </h2>
            <div className="mt-8">
              <LiveButton href={`mailto:${EMAIL}`} tone="gold">
                {CTA_FLOW}
              </LiveButton>
            </div>
          </div>
          <AuditForm tone="light" />
        </div>
      </section>
    </div>
  );
}
