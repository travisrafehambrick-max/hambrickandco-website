"use client";

import { useRef, useState } from "react";
import { EMAIL, PHONE_HREF } from "@/lib/facts";
import { AIS_REVEAL, AIS_RISE, AIS_STAGGER, STILLNESS, ScrollTrigger, aisEase, gsap, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BrandMark } from "@/components/assist/BrandMark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { PeelSlot } from "@/components/shared/CanvasSlot";
import { GoldMetalMark, MetalRimCTA } from "@/components/shared/MetalKit";
import { bindMagnetic } from "@/lib/bind-magnetic";
import {
  AREA_CLOSE,
  CLOSE_HEADLINE,
  CTA_AUDIT,
  CTA_BOOK,
  CTA_TALK,
  HERO_HEADLINE,
  HERO_SUB,
  OFFER_LEAD,
  OFFER_STACK,
  OFFER_WEDGE,
  PROBLEM_CLOSE,
  PROBLEM_LEAD,
  PROBLEM_LEAKS,
  PROOF_BEATS,
  PROOF_BODY,
  PROOF_LEAD,
  PROOF_MATH_CLOSE,
  PROOF_NOTE,
  PROOF_TRAVIS,
} from "@/components/assist/copy";

const STEPS = [
  {
    verb: "Missed",
    line: "Can you still do the estimate this week?",
    peel: 0.28,
    live: false,
  },
  {
    verb: "Alert",
    line: "Sheet sits on the lock screen.",
    peel: 0.38,
    live: false,
  },
  {
    verb: "Callback",
    line: "Yes — we can hold Thursday morning. Confirm the address?",
    peel: 0.7,
    live: true,
  },
  {
    verb: "Recovered",
    line: "Same street. After 9 is fine.",
    peel: 1,
    live: true,
  },
] as const;

const MAIL_AUDIT = `mailto:${EMAIL}?subject=${encodeURIComponent("Recovery audit request")}`;

export function AssistPane() {
  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const goStepRef = useRef<(i: number, immediate?: boolean) => void>(() => {});
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0.28);
  const [active, setActive] = useState(0);
  const [ink, setInk] = useState(true);

  useGSAP(
    () => {
      if (reduced === null) return;
      const peel = { v: 0.28 };

      const goStep = (i: number, immediate = false) => {
        const next = STEPS[i];
        setActive(i);
        if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          peel.v = next.peel;
          setProgress(next.peel);
          return;
        }
        gsap.to(peel, {
          v: next.peel,
          duration: 0.72,
          ease: aisEase,
          overwrite: "auto",
          onUpdate: () => setProgress(peel.v),
        });
      };
      goStepRef.current = goStep;

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
        gsap.set(".assist-display", { autoAlpha: 1, y: 0, filter: "none" });
        goStep(STEPS.length - 1, true);
        paintHeader(false, true);
        return;
      }

      const releaseMarks = Array.from(root.current?.querySelectorAll<HTMLElement>(".assist-mark") ?? []).map((el) =>
        bindMagnetic(el, 14),
      );

      const intro = gsap.timeline({ defaults: { ease: aisEase } });
      intro
        .fromTo(
          ".assist-display",
          { y: AIS_RISE, filter: "blur(6px)", autoAlpha: 0 },
          { y: 0, filter: "blur(0px)", autoAlpha: 1, duration: AIS_REVEAL, stagger: AIS_STAGGER },
        )
        .to({}, { duration: STILLNESS });

      STEPS.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.assist-step[data-step="${i}"]`,
          start: i === 0 ? "top 12%" : "top 48%",
          end: "bottom 48%",
          onToggle: (self) => {
            if (self.isActive) goStep(i);
          },
        });
      });

      ScrollTrigger.create({
        trigger: ".assist-pin",
        start: "top 12%",
        onEnter: () => {
          paintHeader(false);
          goStep(0);
        },
        onLeaveBack: () => paintHeader(true),
      });
      ScrollTrigger.create({
        trigger: "#request",
        start: "top 72%",
        end: "bottom bottom",
        onToggle: (self) => paintHeader(self.isActive),
      });

      return () => {
        releaseMarks.forEach((fn) => fn());
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const step = STEPS[active];

  return (
    <div ref={root} className="min-h-screen bg-ink text-matte">
      <header
        ref={header}
        className={`assist-header sticky top-0 z-40 border-b ${ink ? "border-black bg-ink text-matte" : "border-ink bg-matte text-ink"}`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <BrandMark tone={ink ? "dark" : "light"} />
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <LiveButton href={PHONE_HREF}>{CTA_TALK}</LiveButton>
            <span className="hidden sm:inline-flex">
              <LiveButton href={MAIL_AUDIT} tone={ink ? "ghost-light" : "ghost-dark"}>
                {CTA_AUDIT}
              </LiveButton>
            </span>
          </div>
        </div>
      </header>

      <section className="assist-pin border-t border-black bg-matte pb-[12vh] text-ink">
        <div className="mx-auto flex max-w-[1280px] flex-col md:flex-row">
          <div className="md:w-[42%]">
            <div className="assist-hero flex flex-col justify-center border-b border-ink px-5 py-10 md:min-h-[calc(100svh-4.25rem)] md:px-8">
              <h1 className="assist-display font-display text-[clamp(2rem,4.6vw,3.15rem)] leading-[0.95] tracking-[-0.02em]">
                {HERO_HEADLINE}
              </h1>
              <p className="assist-display mt-6 max-w-md font-sans text-[15px] leading-relaxed text-ink/70 md:text-[16px]">
                {HERO_SUB}
              </p>
              <div className="assist-display mt-8 flex flex-wrap items-center gap-3">
                <MetalRimCTA href={PHONE_HREF} className="inline-flex px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em]">
                  {CTA_TALK}
                </MetalRimCTA>
                <LiveButton href={MAIL_AUDIT} tone="ghost-dark">
                  {CTA_AUDIT}
                </LiveButton>
              </div>
            </div>
            <ol>
              {STEPS.map((s, i) => {
                const on = i === active;
                return (
                  <li
                    key={s.verb}
                    data-step={i}
                    className={`assist-step flex flex-col justify-center border-b border-ink px-5 py-10 md:px-8 ${
                      i === STEPS.length - 1 ? "min-h-[48vh] md:min-h-[70vh]" : "min-h-[52vh] md:min-h-[78vh]"
                    }`}
                  >
                    <button
                      type="button"
                      aria-current={on ? "step" : undefined}
                      onClick={() => goStepRef.current(i)}
                      className="assist-mark max-w-md text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                    >
                      <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${on ? "metal-text" : "text-ink/35"}`}>
                        {s.verb}
                      </span>
                      <span className={`mt-5 block font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] ${on ? "text-ink" : "text-ink/40"}`}>
                        {s.line}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <aside className="assist-media order-first sticky top-[4.25rem] z-10 h-[46svh] w-full shrink-0 self-start border-b border-ink bg-matte md:order-none md:h-[calc(100svh-4.25rem)] md:w-[58%] md:border-b-0 md:border-l">
            <div className="relative flex h-full flex-col">
              <div className="relative min-h-0 flex-1">
                <PeelSlot progress={progress} step={active} />
                <div className="pointer-events-none absolute inset-x-4 top-[10%] z-10 md:inset-x-8">
                  <div className={`assist-glass max-w-md px-5 py-4 ${step.live ? "assist-glass--live" : ""}`}>
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                      {step.live ? <GoldMetalMark /> : <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ink/20" />}
                      <span className={step.live ? "metal-text" : "text-ink/45"}>{step.verb}</span>
                    </div>
                    <p className="mt-3 font-display text-[clamp(1.2rem,2.2vw,1.65rem)] leading-[1.15]">{step.line}</p>
                  </div>
                </div>
              </div>
              <p className="border-t border-ink px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em]">
                <span className={step.live ? "metal-text" : "text-ink/45"}>{step.verb}</span>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <div className="assist-convert border-t border-black bg-matte text-ink">
        <section id="problem" className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <div className="assist-panel max-w-3xl">
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.02em]">{PROBLEM_LEAD}</h2>
            <ul className="mt-10 grid gap-3">
              {PROBLEM_LEAKS.map((leak) => (
                <li key={leak} className="assist-glass px-5 py-4 font-sans text-[16px] leading-relaxed text-ink/80 md:px-6 md:py-5">
                  {leak}
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-xl font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.12]">{PROBLEM_CLOSE}</p>
          </div>
        </section>

        <section id="offer" className="border-t border-ink">
          <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
            <div className="assist-panel max-w-3xl">
              <h2 className="font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.02em]">{OFFER_LEAD}</h2>
            </div>
            <ol className="mt-12 grid gap-3">
              {OFFER_STACK.map((item) => (
                <li
                  key={item.n}
                  className={`assist-panel assist-glass flex gap-5 px-5 py-5 md:items-baseline md:gap-8 md:px-8 md:py-7 ${
                    item.wedge ? "assist-glass--live" : ""
                  }`}
                >
                  <span className={`font-mono text-[11px] uppercase tracking-[0.2em] ${item.wedge ? "metal-text" : "text-ink/40"}`}>
                    {item.n}.
                  </span>
                  <p className="font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.15]">
                    {item.name}
                    <span className="text-ink/45"> — </span>
                    <span className="font-sans text-[15px] leading-relaxed text-ink/70 md:text-[16px]">{item.line}</span>
                  </p>
                </li>
              ))}
            </ol>
            <div className="assist-panel mt-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
              <GoldMetalMark />
              <span className="metal-text">{OFFER_WEDGE}</span>
            </div>
          </div>
        </section>

        <section id="proof" className="border-t border-ink">
          <div className="assist-panel mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
            <div className="assist-glass assist-glass--live max-w-3xl px-6 py-10 md:px-10 md:py-14">
              <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.08]">{PROOF_LEAD}</h2>
              <ul className="mt-8 grid gap-3">
                {PROOF_BEATS.map((beat) => (
                  <li key={beat} className="assist-glass px-5 py-4 font-sans text-[16px] leading-relaxed text-ink/80 md:px-6 md:py-5">
                    {beat}
                  </li>
                ))}
              </ul>
              <p className="mt-10 font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.12]">{PROOF_MATH_CLOSE}</p>
              <p className="mt-8 max-w-xl font-sans text-[16px] leading-relaxed text-ink/80">{PROOF_BODY}</p>
              <p className="mt-8 max-w-xl font-sans text-[16px] leading-relaxed text-ink/70">{PROOF_TRAVIS}</p>
              <p className="mt-6 max-w-xl font-sans text-[14px] leading-relaxed text-ink/45">{PROOF_NOTE}</p>
            </div>
          </div>
        </section>
      </div>

      <section id="request" className="border-t border-black bg-ink text-matte">
        <div className="mx-auto grid max-w-[1280px] gap-16 px-5 py-24 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.92]">{CLOSE_HEADLINE}</h2>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MetalRimCTA href={PHONE_HREF} className="inline-flex px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em]">
                {CTA_BOOK}
              </MetalRimCTA>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-matte/50">{AREA_CLOSE}</span>
            </div>
          </div>
          <AuditForm tone="dark" />
        </div>
      </section>
    </div>
  );
}
