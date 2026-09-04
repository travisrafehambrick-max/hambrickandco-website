"use client";

import { useRef, useState } from "react";
import { bindMagnetic } from "@/lib/bind-magnetic";
import { AREA, CTA_AUDIT, CTA_FLOW, EMAIL, PHONE, PHONE_HREF } from "@/lib/facts";
import { ScrollTrigger, aisEase, gsap, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { ObjectSlot } from "@/components/shared/CanvasSlot";

/** Object lags the copy — slower parallax, not a second scrub story. */
const CARRIER_Y = 28;
const COPY_Y = 86;

export function BalancePage() {
  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const carrier = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const slip = useRef<HTMLElement>(null);
  const turn = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0.48);
  const [face, setFace] = useState<"missed" | "recovered">("missed");
  const [ink, setInk] = useState(true);

  const turnSlip = () => {
    if (reduced) {
      setFace("recovered");
      setProgress(1);
      return;
    }
    setFace((f) => (f === "missed" ? "recovered" : "missed"));
    const el = slip.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { autoAlpha: 0.72 },
      { autoAlpha: 1, duration: 0.7, ease: aisEase, overwrite: "auto" },
    );
  };

  useGSAP(
    () => {
      if (reduced === null) return;

      const paintHeader = (dark: boolean, immediate = false) => {
        setInk(dark);
        const el = header.current;
        if (!el) return;
        gsap.to(el, {
          backgroundColor: dark ? "#121212" : "#F5F5F5",
          color: dark ? "#F5F5F5" : "#121212",
          duration: immediate ? 0 : 0.55,
          ease: aisEase,
          overwrite: "auto",
        });
      };

      if (reduced) {
        gsap.set([carrier.current, copy.current, slip.current], { y: 0, filter: "none", autoAlpha: 1 });
        setProgress(1);
        setFace("recovered");
        paintHeader(true, true);
        return;
      }

      const releaseTurn = turn.current ? bindMagnetic(turn.current, 16) : undefined;
      paintHeader(true, true);

      ScrollTrigger.create({
        trigger: ".balance-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        onUpdate: (self) => {
          const t = self.progress;
          if (carrier.current) gsap.set(carrier.current, { y: t * CARRIER_Y });
          if (copy.current) gsap.set(copy.current, { y: t * -COPY_Y });
          setProgress(0.48 + t * 0.4);
        },
      });

      ScrollTrigger.create({
        trigger: ".balance-turn",
        start: "top 12%",
        onEnter: () => paintHeader(false),
        onLeaveBack: () => paintHeader(true),
      });

      return () => {
        releaseTurn?.();
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="min-h-screen bg-ink text-matte">
      <header
        ref={header}
        className={`sticky top-0 z-40 border-b ${ink ? "border-black bg-ink text-matte" : "border-ink bg-matte text-ink"}`}
      >
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-6">
          <Wordmark tone={ink ? "dark" : "light"} />
          <LiveButton href="#ask">{CTA_AUDIT}</LiveButton>
        </div>
      </header>

      <section className="balance-hero relative min-h-[100svh] overflow-hidden">
        <div
          ref={carrier}
          className="balance-carrier pointer-events-none absolute inset-x-0 top-[12%] h-[56vh]"
        >
          <ObjectSlot progress={progress} />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1100px] flex-col justify-between px-6 pb-28 pt-8">
          <div ref={copy} className="balance-copy max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-matte/40">Quiet field</p>
            <h1 className="mt-8 font-display text-[clamp(3.2rem,9vw,6.4rem)] leading-[0.82] tracking-[-0.03em]">
              A quiet
              <br />
              field.
            </h1>
            <p className="mt-8 font-display italic text-[clamp(2rem,4vw,3.2rem)] leading-none">
              <span className="metal-text">Recovered.</span>
            </p>
            <p className="mt-6 max-w-sm font-sans text-[15px] text-matte/55">
              One object. The slip is already on the table. {AREA}.
            </p>
          </div>

          <article
            ref={slip}
            className="relative z-10 w-[min(100%,340px)] border border-black bg-matte p-6 text-ink"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">Recovery note</p>
            <p className="mt-4 font-display text-[1.55rem] leading-snug">
              {face === "missed" ? "Inbound open. No reply on the estimate." : "First reply out. Estimate back on the board."}
            </p>
            <p className={`mt-5 font-mono text-[10px] uppercase tracking-[0.16em] ${face === "recovered" ? "metal-text" : "text-ink/35"}`}>
              {face === "missed" ? "Missed" : "Recovered"}
            </p>
            <button
              ref={turn}
              type="button"
              onClick={turnSlip}
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] metal-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              Turn the slip
            </button>
          </article>
        </div>
      </section>

      <section className="balance-turn border-t border-black bg-matte text-ink">
        <div className="mx-auto min-h-[88svh] max-w-[1100px] px-6 py-28">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/35">Turning point</p>
          <p className="mt-10 max-w-md font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05]">
            The field goes still. The object keeps the slower current.
          </p>
          <p className="mt-10 max-w-md font-sans text-[15px] text-ink/55">
            No fake KPIs. No partner badges. Just the tactile quiet of a recovery that held its
            balance.
          </p>
          <p className="mt-6 max-w-sm font-sans text-[15px] text-ink/55">
            Write{" "}
            <a className="metal-text" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            {" · "}
            <a className="metal-text" href={PHONE_HREF}>
              {PHONE}
            </a>
            .
          </p>
        </div>
      </section>

      <section id="ask" className="border-t border-ink bg-matte text-ink">
        <div className="mx-auto grid max-w-[1100px] gap-16 px-6 py-24 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95]">
              Request a recovery audit.
            </h2>
            <div className="mt-8">
              <LiveButton href={`mailto:${EMAIL}`}>{CTA_FLOW}</LiveButton>
            </div>
          </div>
          <AuditForm tone="light" />
        </div>
      </section>
    </div>
  );
}
