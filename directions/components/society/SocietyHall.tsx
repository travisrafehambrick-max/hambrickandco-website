"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AREA, CTA_FLOW, EMAIL, PHONE, PHONE_HREF, WEDGE } from "@/lib/facts";
import { AIS_REVEAL, AIS_RISE, AIS_STAGGER, LINEAR, STILLNESS, ScrollTrigger, aisEase, gsap, useGSAP } from "@/lib/register-gsap";
import { bindAiasLive, freezeAiasLive } from "@/lib/bind-aias-live";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { FilamentSlot } from "@/components/shared/CanvasSlot";
import { CallPhone } from "@/components/shared/CallPhone";
import { StackedOutcomes } from "@/components/shared/StackedOutcomes";

const THESES = [
  { n: "01", t: "A lead that waits is a lead that leaves." },
  { n: "02", t: "The estimate is the job before the job." },
  { n: "03", t: "Reply on the tools you already keep in the truck." },
  { n: "04", t: "Charlottesville, and forty miles of quiet inboxes." },
  { n: "05", t: "Recovery is a sentence sent back — not a dashboard." },
  { n: "06", t: "The hall keeps the hours someone else dropped." },
  { n: "07", t: "Membership here is a working current, not a newsletter." },
];

export function SocietyHall() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [liveThesis, setLiveThesis] = useState(0);
  const [lane, setLane] = useState<"hall" | "stage" | "pledge">("hall");

  useGSAP(
    () => {
      if (reduced === null) return;
      const path = line.current;
      if (!path) return;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

      if (reduced) {
        gsap.set(path, { strokeDashoffset: 0, stroke: "#C4A574", filter: "none", y: 0, autoAlpha: 1 });
        gsap.set(rail.current, { scaleX: 1, filter: "none", y: 0, autoAlpha: 1 });
        gsap.set(".hall-recovered", { autoAlpha: 1, y: 0, filter: "none" });
        gsap.set(".thesis-row", { autoAlpha: 1, x: 0, y: 0, filter: "none" });
        if (root.current) freezeAiasLive(root.current);
        setProgress(1);
        setLiveThesis(THESES.length - 1);
        setLane("stage");
        return;
      }

      if (root.current) bindAiasLive(root.current);

      gsap.set(rail.current, { scaleX: 0, transformOrigin: "left center" });

      const intro = gsap.timeline({ defaults: { ease: aisEase } });
      intro
        .fromTo(
          rail.current,
          { scaleX: 0, filter: "blur(6px)", y: AIS_RISE, autoAlpha: 0 },
          { scaleX: 0.42, filter: "blur(0px)", y: 0, autoAlpha: 1, duration: AIS_REVEAL },
        )
        .fromTo(
          path,
          { strokeDashoffset: len, stroke: "#F5F5F5", filter: "blur(8px)", y: AIS_RISE, autoAlpha: 0 },
          {
            strokeDashoffset: len * 0.55,
            stroke: "#C4A574",
            filter: "blur(0px)",
            y: 0,
            autoAlpha: 1,
            duration: AIS_REVEAL,
          },
          AIS_STAGGER,
        )
        .fromTo(
          ".hall-recovered",
          { autoAlpha: 0, y: AIS_RISE, filter: "blur(6px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
          AIS_STAGGER * 2,
        )
        .to({}, { duration: STILLNESS });

      intro.eventCallback("onUpdate", () => {
        const p = 0.38 * intro.progress();
        setProgress(p);
      });

      const chapter = gsap.timeline({
        defaults: { ease: LINEAR },
        scrollTrigger: {
          trigger: ".hall-pin",
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.65,
        },
      });

      chapter
        .to(rail.current, { scaleX: 1, duration: 0.7 }, 0)
        .to(path, { strokeDashoffset: 0, stroke: "#C4A574", duration: 0.7 }, 0)
        .to(
          {},
          {
            duration: 0.3,
            onUpdate() {
              const p = 0.38 + this.progress() * 0.62;
              setProgress(p);
              setLiveThesis(Math.min(THESES.length - 1, Math.floor(p * THESES.length)));
            },
          },
          0,
        )
        .fromTo(".thesis-row", { x: -28 }, { x: 0, stagger: AIS_STAGGER, duration: 0.5 }, 0.05)
        .to({}, { duration: 0.22 });

      ScrollTrigger.create({
        trigger: ".hall-pin",
        start: "top 20%",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) setLane("stage");
        },
        onLeaveBack: () => setLane("hall"),
      });
      ScrollTrigger.create({
        trigger: "#pledge",
        start: "top 45%",
        onEnter: () => setLane("pledge"),
        onLeaveBack: () => setLane("stage"),
      });

      return () => {
        intro.kill();
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="bg-ink text-matte min-h-screen">
      <header className="sticky top-0 z-40 border-b border-black bg-ink">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
          <Wordmark tone="dark" kicker="Hall" />
          <nav className="hidden gap-8 font-mono text-[10px] uppercase tracking-[0.2em] md:flex">
            {(
              [
                ["hall", "Hall", "#top"],
                ["stage", "Stage", "#stage"],
                ["pledge", "Pledge", "#pledge"],
              ] as const
            ).map(([id, label, href]) => (
              <a
                key={id}
                href={href}
                className={lane === id ? "text-gold" : "text-matte/45 hover:text-matte"}
              >
                {label}
              </a>
            ))}
            <Link href="/" className="text-matte/45 hover:text-matte">
              Index
            </Link>
          </nav>
          <LiveButton href="#pledge">{CTA_FLOW}</LiveButton>
        </div>
        <span ref={rail} aria-hidden className="signal-line block h-px origin-left bg-gold" />
      </header>

      <svg data-depth="far" className="pointer-events-none fixed inset-x-0 top-[28%] z-20 h-24 w-full" viewBox="0 0 1200 80" fill="none" aria-hidden>
        <path
          ref={line}
          d="M40 48 C 220 12, 380 70, 560 36 S 900 10, 1160 44"
          stroke="#F5F5F5"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <section id="top" className="relative mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 items-end gap-10 px-5 pb-16 pt-10 md:grid-cols-12 md:px-10">
        <div className="md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-matte/40">01 — Society Hall</p>
          <h1 className="mt-6 font-display text-[clamp(3.2rem,9vw,8.4rem)] leading-[0.86] tracking-[-0.03em]">
            The lead
            <br />
            went quiet.
          </h1>
          <p className="hall-missed intro-beat mt-8 max-w-md font-sans text-[17px] leading-relaxed text-matte/70">
            Missed at 14:02. A voicemail, an estimate left open, a shop that did not write back. The current is
            already moving left.
          </p>
        </div>
        <div className="md:col-span-5 md:justify-self-end md:text-right">
          <p className="hall-recovered signal-related font-display italic text-[clamp(2rem,4vw,3.4rem)] leading-none text-gold">
            Recovered.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-matte/50">14:04 · first reply out</p>
          <p className="intro-beat mt-6 max-w-sm md:ml-auto font-sans text-[15px] text-matte/65">
            {WEDGE}. {AREA}.
          </p>
          <div className="mt-10 md:ml-auto md:w-fit">
            <CallPhone />
          </div>
        </div>
      </section>

      <section id="stage" className="hall-pin relative border-t border-black">
        <div className="mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 md:grid-cols-12">
          <div className="relative md:col-span-5 border-r border-black">
            <div data-depth="mid" className="h-[42vh] md:h-full">
              <FilamentSlot progress={progress} />
            </div>
            <p className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
              Live
            </p>
          </div>
          <div className="md:col-span-7 px-5 py-10 md:px-12 md:py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-matte/45">
              Recovery board
            </p>
            <ol className="mt-8">
              {THESES.map((row, i) => {
                const live = i <= liveThesis;
                return (
                  <li key={row.n} className="thesis-row border-t border-black py-5">
                    <button
                      type="button"
                      onClick={() => setLiveThesis(i)}
                      className="flex w-full items-baseline gap-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                    >
                      <span className={`font-mono text-[11px] ${live ? "text-gold" : "text-matte/35"}`}>{row.n}</span>
                      <span className={`font-display text-[clamp(1.4rem,3vw,2.15rem)] leading-[1.1] ${live ? "text-matte" : "text-matte/40"}`}>
                        {row.t}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <StackedOutcomes />

      <section id="pledge" className="border-t border-black px-5 py-24 md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">Pledge</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">
              Request a recovery audit.
            </h2>
            <p className="mt-6 max-w-md font-sans text-[16px] leading-relaxed text-matte/70">
              Hambrick &amp; Co. is an AI automation practice. We put the missed inbound and the open estimate back
              into motion. Write {EMAIL} or call{" "}
              <a className="text-gold" href={PHONE_HREF}>
                {PHONE}
              </a>
              .
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LiveButton href={`mailto:${EMAIL}`}>{CTA_FLOW}</LiveButton>
              <LiveButton href="/" tone="ghost-light">
                Back to the index
              </LiveButton>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <AuditForm tone="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
