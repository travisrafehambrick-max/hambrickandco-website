"use client";

import { useRef, useState } from "react";
import { AREA, CTA_AUDIT, CTA_FLOW, EMAIL, PHONE, PHONE_HREF } from "@/lib/facts";
import { AIS_REVEAL, AIS_RISE, AIS_STAGGER, STILLNESS, ScrollTrigger, aisEase, gsap, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { PeelSlot } from "@/components/shared/CanvasSlot";
import { bindMagnetic } from "@/lib/bind-magnetic";

const STEPS = [
  {
    verb: "Missed",
    time: "14:02",
    line: "Can you still do the estimate this week?",
    caption: "2h 14m on the lock screen",
    peel: 0.14,
    live: false,
  },
  {
    verb: "Alert",
    time: "14:02",
    line: "Sheet sits on the lock screen.",
    caption: "Nobody marked it",
    peel: 0.38,
    live: false,
  },
  {
    verb: "Callback",
    time: "14:04",
    line: "Yes — we can hold Thursday morning. Confirm the address?",
    caption: "First reply out",
    peel: 0.7,
    live: true,
  },
  {
    verb: "Recovered",
    time: "14:06",
    line: "Same street. After 9 is fine.",
    caption: "Estimate hold · Thursday",
    peel: 1,
    live: true,
  },
] as const;

const EVIDENCE = [
  { n: "01", trade: "Roof estimate", line: "The inbound sat. The sheet is the miss." },
  { n: "02", trade: "Shop inbound", line: "Voicemail overnight. Alert on the lock screen." },
  { n: "03", trade: "Studio consult", line: "A sentence sent back. Same chair." },
  { n: "04", trade: "Driveway quote", line: "The hold is on the calendar." },
] as const;

export function AssistPane() {
  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const goStepRef = useRef<(i: number, immediate?: boolean) => void>(() => {});
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0.14);
  const [active, setActive] = useState(0);
  const [ink, setInk] = useState(true);
  const [slide, setSlide] = useState(0);

  useGSAP(
    () => {
      if (reduced === null) return;
      const peel = { v: 0.14 };

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
        gsap.set(".evidence-card", { autoAlpha: 1, y: 0, filter: "none" });
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
          { y: 0, filter: "blur(0px)", autoAlpha: 1, duration: AIS_REVEAL },
        )
        .fromTo(".assist-sheet", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, AIS_STAGGER)
        .to({}, { duration: STILLNESS });

      STEPS.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.assist-step[data-step="${i}"]`,
          start: "top 48%",
          end: "bottom 48%",
          onToggle: (self) => {
            if (self.isActive) goStep(i);
          },
        });
      });

      ScrollTrigger.create({
        trigger: ".assist-pin",
        start: "top 10%",
        onEnter: () => paintHeader(false),
        onLeaveBack: () => paintHeader(true),
      });
      ScrollTrigger.create({
        trigger: "#request",
        start: "top 72%",
        end: "bottom bottom",
        onToggle: (self) => paintHeader(self.isActive),
      });

      gsap.fromTo(
        ".evidence-card",
        { y: AIS_RISE, filter: "blur(6px)", autoAlpha: 0 },
        {
          y: 0,
          filter: "blur(0px)",
          autoAlpha: 1,
          duration: 0.8,
          ease: aisEase,
          stagger: AIS_STAGGER,
          scrollTrigger: { trigger: ".assist-evidence", start: "top 72%" },
        },
      );

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
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-8">
          <Wordmark tone={ink ? "dark" : "light"} />
          <LiveButton href="#request">{CTA_AUDIT}</LiveButton>
        </div>
      </header>

      <section className="relative mx-auto min-h-[100svh] max-w-[1280px] px-5 pb-16 pt-10 md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-matte/40">Missed thread</p>
        <h1 className="assist-display mt-6 font-display text-[clamp(4.2rem,14vw,9.4rem)] leading-[0.78] tracking-[-0.04em]">
          Missed
          <br />
          thread.
        </h1>
        <p className="assist-display mt-8 max-w-md font-display italic text-[clamp(2rem,5vw,3.6rem)] leading-none">
          <span className="metal-text">Recovered.</span>
        </p>
        <p className="assist-display mt-6 max-w-sm font-sans text-[16px] text-matte/60">
          One sheet. Four landmarks. {AREA}.
        </p>
        <article className="assist-sheet mt-12 w-[min(280px,80%)] border border-black bg-matte p-5 text-ink">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">14:02 · Missed</p>
          <p className="mt-3 font-display text-2xl leading-tight">2h 14m on the lock screen</p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] metal-text">14:04 · first reply out</p>
        </article>
      </section>

      <section className="assist-pin border-t border-black bg-matte text-ink">
        <div className="mx-auto grid max-w-[1280px] md:grid-cols-12">
          <ol className="md:col-span-5">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li
                  key={s.verb}
                  data-step={i}
                  className="assist-step flex min-h-[52vh] flex-col justify-center border-b border-ink px-5 py-16 md:min-h-[78vh] md:px-8"
                >
                  <button
                    type="button"
                    aria-current={on ? "step" : undefined}
                    onClick={() => goStepRef.current(i)}
                    className="assist-mark max-w-md text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                  >
                    <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${on ? "metal-text" : "text-ink/35"}`}>
                      {s.time} · {s.verb}
                    </span>
                    <span className={`mt-5 block font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] ${on ? "text-ink" : "text-ink/40"}`}>
                      {s.line}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <aside className="assist-media order-first sticky top-[4.25rem] z-10 h-[46svh] border-b border-ink bg-matte md:order-none md:col-span-7 md:h-[calc(100svh-4.25rem)] md:border-b-0 md:border-l">
            <div className="flex h-full flex-col">
              <div className="min-h-0 flex-1">
                <PeelSlot progress={progress} />
              </div>
              <p className="border-t border-ink px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em]">
                <span className={step.live ? "metal-text" : "text-ink/45"}>
                  {step.verb} · {step.caption}
                </span>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="assist-evidence border-t border-ink border-b border-ink bg-matte text-ink">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">
            Job types — the shape of the work, not a case study
          </p>
          <div className="mt-10 overflow-hidden">
            <div
              className="flex gap-4"
              style={{
                transform: `translateX(calc(-${slide} * (min(86%, 34rem) + 1rem)))`,
                transition: reduced ? "none" : "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {EVIDENCE.map((card, i) => {
                const featured = i === slide;
                return (
                  <article
                    key={card.n}
                    className={`evidence-card w-[min(86%,34rem)] shrink-0 border border-ink p-6 md:p-8 ${
                      featured ? "bg-matte" : "bg-matte"
                    }`}
                  >
                    <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${featured ? "metal-text" : "text-ink/40"}`}>
                      {card.n} · {card.trade}
                    </p>
                    <p className="mt-6 font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]">{card.line}</p>
                    {featured ? <span aria-hidden className="metal-rule mt-8 block h-px w-16" /> : null}
                  </article>
                );
              })}
            </div>
          </div>
          <div className="mt-8 flex gap-2">
            {EVIDENCE.map((card, i) => (
              <button
                key={card.n}
                type="button"
                aria-label={card.trade}
                aria-pressed={slide === i}
                onClick={() => setSlide(i)}
                className={`h-1.5 w-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                  slide === i ? "metal-rule" : "bg-ink/15"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="border-t border-black bg-ink text-matte">
        <div className="mx-auto grid max-w-[1280px] gap-16 px-5 py-24 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.92]">
              Request a recovery audit.
            </h2>
            <p className="mt-6 max-w-md font-sans text-matte/60">
              Split pane is the work: the list on the left, one sheet on the right. Write {EMAIL} or call{" "}
              <a className="metal-text" href={PHONE_HREF}>
                {PHONE}
              </a>
              .
            </p>
            <div className="mt-8">
              <LiveButton href={`mailto:${EMAIL}`}>{CTA_FLOW}</LiveButton>
            </div>
          </div>
          <AuditForm tone="dark" />
        </div>
      </section>
    </div>
  );
}
