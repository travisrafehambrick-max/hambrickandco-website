"use client";

import { useRef, useState } from "react";
import { AREA, CTA_AUDIT, CTA_FLOW, EMAIL, PHONE, PHONE_HREF, WEDGE } from "@/lib/facts";
import { AIS_REVEAL, AIS_RISE, AIS_STAGGER, EASE, LINEAR, ScrollTrigger, gsap, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { RibbonSlot } from "@/components/shared/CanvasSlot";

const BEATS = [
  {
    id: "missed",
    verb: "Missed",
    line: "The inbound sat. The ticket stays matte.",
    ink: true,
    at: 0.12,
  },
  {
    id: "callback",
    verb: "Callback",
    line: "First reply out. The route is live.",
    ink: false,
    at: 0.48,
  },
  {
    id: "recovered",
    verb: "Recovered",
    line: "The estimate is back on the board.",
    ink: true,
    at: 0.84,
  },
] as const;

const TICKETS = [
  { id: "T-104", job: "Roof estimate", dead: "No reply", live: "Text returned", col: "Missed" },
  { id: "T-105", job: "Shop inbound", dead: "Voicemail overnight", live: "Booked same morning", col: "Callback" },
  { id: "T-106", job: "Driveway quote", dead: "Tab left open", live: "Follow-up sent", col: "Recovered" },
  { id: "T-107", job: "Studio consult", dead: "Form unread", live: "Slot held", col: "Recovered" },
] as const;

function beatAt(progress: number) {
  if (progress >= BEATS[2].at) return 2;
  if (progress >= BEATS[1].at) return 1;
  return 0;
}

export function SolidProof() {
  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const playhead = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0.22);
  const [beat, setBeat] = useState(0);
  const [ink, setInk] = useState(true);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      if (reduced === null) return;

      const paintHeader = (dark: boolean, immediate = false) => {
        const el = header.current;
        if (!el) return;
        const inkTo = dark ? "#121212" : "#F5F5F5";
        const typeTo = dark ? "#F5F5F5" : "#121212";
        if (immediate) {
          setInk(dark);
          gsap.set(el, { backgroundColor: inkTo, color: typeTo });
          return;
        }
        let flipped = false;
        gsap.to(el, {
          backgroundColor: inkTo,
          color: typeTo,
          duration: 0.75,
          ease: EASE,
          overwrite: "auto",
          onUpdate() {
            if (!flipped && this.progress() >= 0.48) {
              flipped = true;
              setInk(dark);
            }
          },
        });
      };

      const revealBeat = () => {
        gsap.fromTo(
          ".proof-verb, .proof-line",
          { autoAlpha: 0, filter: "blur(8px)" },
          { autoAlpha: 1, filter: "blur(0px)", duration: 0.75, ease: EASE, overwrite: "auto" },
        );
      };

      let lastBeat = 0;
      const applyBeat = (p: number) => {
        setProgress(p);
        const next = beatAt(p);
        if (next !== lastBeat) {
          lastBeat = next;
          setBeat(next);
          paintHeader(BEATS[next].ink);
          requestAnimationFrame(() => requestAnimationFrame(revealBeat));
        }
        gsap.set(playhead.current, { scaleX: p, transformOrigin: "left center" });
      };

      if (reduced) {
        gsap.set(".proof-copy", { autoAlpha: 1, y: 0, filter: "none" });
        gsap.set(".board-ticket", { autoAlpha: 1, y: 0, filter: "none" });
        applyBeat(1);
        paintHeader(true, true);
        return;
      }

      gsap.set(playhead.current, { scaleX: 0.22, transformOrigin: "left center" });
      gsap.set(".proof-verb, .proof-line", { autoAlpha: 1, filter: "none" });
      paintHeader(true, true);

      const pin = gsap.timeline({
        defaults: { ease: LINEAR },
        scrollTrigger: {
          trigger: ".proof-pin",
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 0.85,
        },
      });

      pin.to(
        {},
        {
          duration: 1,
          onUpdate() {
            applyBeat(0.22 + this.progress() * 0.78);
          },
        },
      );

      gsap.fromTo(
        ".board-ticket",
        { y: AIS_RISE, filter: "blur(6px)", autoAlpha: 0 },
        {
          y: 0,
          filter: "blur(0px)",
          autoAlpha: 1,
          duration: AIS_REVEAL,
          ease: EASE,
          stagger: AIS_STAGGER,
          scrollTrigger: { trigger: ".proof-board", start: "top 72%" },
        },
      );

      ScrollTrigger.create({
        trigger: ".proof-board",
        start: "top 28%",
        onEnter: () => paintHeader(false),
        onLeaveBack: () => paintHeader(true),
      });

      ScrollTrigger.create({
        trigger: "#audit",
        start: "top 28%",
        onEnter: () => paintHeader(false),
        onLeaveBack: () => paintHeader(false),
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const current = BEATS[beat];

  return (
    <div
      ref={root}
      className="min-h-screen bg-ink text-matte"
      data-beat={current.id}
      data-ink={ink ? "dark" : "light"}
    >
      <header
        ref={header}
        className={`sticky top-0 z-40 border-b bg-ink text-matte ${ink ? "border-black" : "border-ink"}`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3 md:px-8">
          <Wordmark tone="current" />
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] opacity-40 md:block">
            {current.verb}
          </p>
          <LiveButton href="#audit">{CTA_AUDIT}</LiveButton>
        </div>
        <span ref={playhead} aria-hidden className="signal-line metal-rule block h-px origin-left" />
      </header>

      <section className="mx-auto grid min-h-[100svh] max-w-[1280px] items-end gap-10 px-5 pb-16 pt-10 md:grid-cols-12 md:px-8">
        <div className="proof-copy md:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-matte/40">Gold route</p>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.9]">
            Dead board.
            <br />
            <span className="metal-text">Live board.</span>
          </h1>
          <p className="mt-6 max-w-sm font-sans text-[16px] leading-relaxed text-matte/60">
            {WEDGE} as a working strip. One route. Gold only after the ticket comes back.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:col-span-7">
          <article className="border border-matte/15 bg-ink p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-matte/40">T-104 · Dead</p>
            <h2 className="mt-8 font-display text-3xl">Roof estimate</h2>
            <p className="mt-3 font-sans text-sm text-matte/50">No reply</p>
          </article>
          <article className="metal-edge p-5" style={{ ["--metal-fill" as string]: "#121212" }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] metal-text">T-104 · Live</p>
            <h2 className="mt-8 font-display text-3xl">Roof estimate</h2>
            <p className="mt-3 font-sans text-sm text-matte/60">Text returned</p>
          </article>
        </div>
      </section>

      <section className="proof-pin border-t border-black bg-ink">
        <div className="mx-auto grid min-h-[100svh] max-w-[1280px] md:grid-cols-12">
          <div className="proof-copy flex flex-col justify-center px-5 py-16 md:col-span-5 md:px-8">
            <p className="proof-verb font-mono text-[10px] uppercase tracking-[0.22em] metal-text">{current.verb}</p>
            <p className="proof-line mt-6 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] text-matte">
              {current.line}
            </p>
            <p className="mt-8 max-w-sm font-sans text-[15px] text-matte/55">
              Missed → callback → recovered. The line is the only gold in the room besides the CTA.
            </p>
          </div>
          <div className="relative min-h-[52vh] md:col-span-7 md:min-h-[100svh]">
            <RibbonSlot progress={progress} />
            <p
              className="pointer-events-none absolute bottom-8 left-8 font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{
                transition: reduced ? "none" : "opacity 0.75s cubic-bezier(0.65, 0, 0.35, 1), filter 0.75s cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            >
              <span className={current.verb === "Missed" ? "text-matte/40" : "metal-text"}>
                {current.verb} · route
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="proof-board border-t border-black bg-matte text-ink">
        <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">
            Job types — the shape of the work, not a case study
          </p>
          <div className="mt-10 grid gap-3">
            {TICKETS.map((t, i) => {
              const alive = progress > 0.22 + i * 0.18;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setOpen(i)}
                  className={`board-ticket grid grid-cols-[auto_1fr_auto] items-center gap-4 border px-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                    alive ? "metal-edge" : "border-ink/15 text-ink/45"
                  } ${open === i ? "bg-ink/[0.03]" : ""}`}
                  style={alive ? { ["--metal-fill" as string]: "#F5F5F5" } : undefined}
                >
                  <span className={`font-mono text-[10px] ${alive ? "metal-text" : ""}`}>{t.id}</span>
                  <span className="font-sans text-[15px]">
                    {t.job}
                    <span className="block text-[13px] text-current/70">{alive ? t.live : t.dead}</span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em]">{t.col}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-8 max-w-md font-sans text-[14px] text-ink/55">{AREA}.</p>
        </div>
      </section>

      <section id="audit" className="border-t border-ink bg-matte text-ink">
        <div className="mx-auto grid max-w-[1280px] gap-16 px-5 py-24 md:grid-cols-12 md:px-8">
          <div className="md:col-span-6">
            <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.95]">
              Request a recovery audit.
            </h2>
            <p className="mt-6 max-w-md font-sans text-[16px] text-ink/65">
              We do not invent customer names or counts. Write {EMAIL} or call{" "}
              <a className="metal-text" href={PHONE_HREF}>
                {PHONE}
              </a>
              .
            </p>
            <div className="mt-8">
              <LiveButton href={`mailto:${EMAIL}`}>{CTA_FLOW}</LiveButton>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <AuditForm tone="light" />
          </div>
        </div>
      </section>
    </div>
  );
}
