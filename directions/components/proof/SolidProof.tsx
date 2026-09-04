"use client";

import { useRef, useState } from "react";
import { AREA, CTA_AUDIT, CTA_FLOW, EMAIL, WEDGE } from "@/lib/facts";
import { EASE, LINEAR, STILLNESS, gsap, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { TicketSlot } from "@/components/shared/CanvasSlot";

const TICKETS = [
  { id: "T-104", job: "Roof estimate", dead: "No reply · 2h 14m", live: "Text returned · 4 min", col: "Missed" },
  { id: "T-105", job: "Shop inbound", dead: "Voicemail · overnight", live: "Booked · same morning", col: "Queue" },
  { id: "T-106", job: "Driveway quote", dead: "Tab left open", live: "Follow-up sent", col: "Recovered" },
  { id: "T-107", job: "Studio consult", dead: "Form unread", live: "Slot held", col: "Recovered" },
];

export function SolidProof() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      if (reduced === null) return;

      if (reduced) {
        gsap.set(".ticket-card", { x: 0, autoAlpha: 1 });
        gsap.set(".ticket-card", { "--alive": 1 });
        setProgress(1);
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: EASE } });
      intro
        .fromTo(".ticket-pair .dead-face", { autoAlpha: 1 }, { autoAlpha: 0.4, duration: 0.4 })
        .fromTo(".ticket-pair .live-face", { autoAlpha: 0.2, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.55 }, 0.15)
        .to({}, { duration: STILLNESS });

      intro.eventCallback("onUpdate", () => setProgress(intro.progress() * 0.28));

      const pin = gsap.timeline({
        defaults: { ease: LINEAR },
        scrollTrigger: {
          trigger: ".proof-pin",
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.7,
        },
      });

      pin
        .to(
          {},
          {
            duration: 0.8,
            onUpdate() {
              setProgress(0.28 + this.progress() * 0.72);
            },
          },
        )
        .fromTo(".board-ticket", { x: -36 }, { x: 0, stagger: 0.1, duration: 0.5 }, 0)
        .to({}, { duration: 0.2 });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="min-h-screen bg-matte text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-matte">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3 md:px-8">
          <Wordmark tone="light" kicker="Proof" />
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45 md:block">
            Board · {TICKETS.length} tickets
          </p>
          <LiveButton href="#audit" tone="gold">
            {CTA_AUDIT}
          </LiveButton>
        </div>
      </header>

      <section className="mx-auto grid min-h-[100svh] max-w-[1280px] grid-cols-1 items-stretch gap-0 px-5 py-10 md:grid-cols-12 md:px-8">
        <div className="flex flex-col justify-end border-b border-ink/10 pb-10 md:col-span-5 md:border-b-0 md:border-r md:pr-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/40">02 — Solid Proof</p>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.9]">
            Dead board.
            <br />
            <span className="text-gold">Live board.</span>
          </h1>
          <p className="mt-6 max-w-sm font-sans text-[16px] leading-relaxed text-ink/65">
            {WEDGE} as a working strip — not a speech. First screen already holds both states. Gold only after a
            ticket comes back.
          </p>
        </div>
        <div className="ticket-pair grid grid-cols-2 gap-4 py-10 md:col-span-7 md:pl-10">
          <article className="dead-face border border-ink/15 bg-ink p-5 text-matte">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-matte/40">T-104 · Dead</p>
            <h2 className="mt-8 font-display text-3xl">Roof estimate</h2>
            <p className="mt-3 font-sans text-sm text-matte/55">No reply · 2h 14m</p>
          </article>
          <article className="live-face border border-gold bg-matte p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">T-104 · Live</p>
            <h2 className="mt-8 font-display text-3xl">Roof estimate</h2>
            <p className="mt-3 font-sans text-sm text-ink/60">Text returned · 4 min</p>
          </article>
        </div>
      </section>

      <section className="proof-pin border-t border-ink/10 bg-ink text-matte">
        <div className="mx-auto grid min-h-[100svh] max-w-[1280px] md:grid-cols-12">
          <div className="relative md:col-span-5">
            <div className="h-[38vh] md:h-full">
              <TicketSlot progress={progress} />
            </div>
          </div>
          <div className="md:col-span-7 px-5 py-10 md:px-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-matte/40">
              Carrier · tickets dead → alive
            </p>
            <div className="mt-8 grid gap-3">
              {TICKETS.map((t, i) => {
                const alive = progress > 0.2 + i * 0.18;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setOpen(i)}
                    className={`board-ticket grid grid-cols-[auto_1fr_auto] items-center gap-4 border px-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                      alive ? "border-gold text-matte" : "border-matte/15 text-matte/45"
                    } ${open === i ? "bg-matte/5" : ""}`}
                  >
                    <span className={`font-mono text-[10px] ${alive ? "text-gold" : ""}`}>{t.id}</span>
                    <span className="font-sans text-[15px]">
                      {t.job}
                      <span className="block text-[13px] text-current/70">{alive ? t.live : t.dead}</span>
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em]">{t.col}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-8 max-w-md font-sans text-[14px] text-matte/55">
              Click a live ticket. Inspection stays on the board — no modal theater. {AREA}.
            </p>
          </div>
        </div>
      </section>

      <section id="audit" className="border-t border-ink/10 px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">Proof notes</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.95]">
              See the recovery flow on a real board.
            </h2>
            <p className="mt-6 max-w-md font-sans text-[16px] text-ink/65">
              We do not invent customer names. The tickets above are job types — the shape of the work, not a case
              study. Write {EMAIL}.
            </p>
            <div className="mt-8">
              <LiveButton href={`mailto:${EMAIL}`} tone="gold">
                {CTA_FLOW}
              </LiveButton>
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
