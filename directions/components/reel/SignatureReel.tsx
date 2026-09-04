"use client";

import { useRef, useState } from "react";
import { AREA, CTA_AUDIT, CTA_FLOW, EMAIL } from "@/lib/facts";
import { EASE, LINEAR, STILLNESS, gsap, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { GateSlot } from "@/components/shared/CanvasSlot";

const CHAPTERS = [
  { n: "01", title: "Empty desk at 16:12", body: "The inbound sat. Nobody marked it. The still is the miss." },
  { n: "02", title: "Reply in the same light", body: "Four minutes. Same chair. The still holds while the copy walks." },
  { n: "03", title: "Estimate on the table", body: "Not a campaign. A number that made it back to the person who asked." },
];

export function SignatureReel() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState(0);

  useGSAP(
    () => {
      if (reduced === null) return;
      if (reduced) {
        gsap.set(".reel-recovered", { autoAlpha: 1, x: 0 });
        gsap.set(".reel-caption", { y: 0, autoAlpha: 1 });
        setProgress(1);
        setChapter(2);
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: EASE } });
      intro
        .fromTo(".reel-missed", { x: 0 }, { x: -12, duration: 0.5 })
        .fromTo(".reel-recovered", { x: 40, autoAlpha: 0.2 }, { x: 0, autoAlpha: 1, duration: 0.65 }, 0.1)
        .to({}, { duration: STILLNESS });
      intro.eventCallback("onUpdate", () => setProgress(intro.progress() * 0.3));

      const pin = gsap.timeline({
        defaults: { ease: LINEAR },
        scrollTrigger: {
          trigger: ".reel-pin",
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.6,
        },
      });

      pin
        .to(
          {},
          {
            duration: 1,
            onUpdate() {
              const p = 0.3 + this.progress() * 0.7;
              setProgress(p);
              setChapter(Math.min(2, Math.floor(this.progress() * 3)));
            },
          },
        )
        .fromTo(".reel-caption", { y: 48 }, { y: 0, stagger: 0.15, duration: 0.4 }, 0)
        .to({}, { duration: 0.18 });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const still = CHAPTERS[chapter];

  return (
    <div ref={root} className="min-h-screen bg-ink text-matte">
      <header className="sticky top-0 z-40 mix-blend-difference">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5">
          <Wordmark tone="dark" kicker="Reel" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-matte">
            Folio 0{chapter + 1} / 03
          </p>
          <LiveButton href="#colophon" tone="ghost-light">
            {CTA_AUDIT}
          </LiveButton>
        </div>
      </header>

      <section className="mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 items-end px-6 pb-16 pt-8 md:grid-cols-12">
        <div className="reel-missed md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-matte/40">03 — Signature Reel</p>
          <h1 className="mt-6 font-display text-[clamp(3.4rem,10vw,9rem)] leading-[0.8] tracking-[-0.035em]">
            Missed
            <br />
            still.
          </h1>
          <div className="mt-10 aspect-[16/9] max-w-xl border border-matte/15 bg-[linear-gradient(135deg,#121212_0%,#2a2a2a_48%,#121212_100%)]">
            <div className="flex h-full items-end p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-matte/50">16:12 · inbox empty</span>
            </div>
          </div>
        </div>
        <div className="reel-recovered mt-12 md:col-span-5 md:mt-0 md:translate-y-16">
          <p className="font-display italic text-3xl text-gold md:text-5xl">Recovered still.</p>
          <div className="mt-8 aspect-[3/4] border border-gold bg-[linear-gradient(180deg,#1a1a1a_0%,#121212_60%,#C4A574_160%)]">
            <div className="flex h-full items-end justify-between p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">16:16 · reply filed</span>
            </div>
          </div>
        </div>
      </section>

      <section className="reel-pin border-t border-matte/10">
        <div className="mx-auto grid min-h-[100svh] max-w-[1440px] md:grid-cols-12">
          <div className="relative md:col-span-6">
            <div className="absolute inset-0">
              <GateSlot progress={progress} />
            </div>
            <figure className="relative z-10 mx-auto mt-[18vh] aspect-[4/5] w-[min(72%,420px)] border border-matte/20 bg-ink">
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{still.n}</p>
                <p className="mt-2 font-display text-3xl leading-tight">{still.title}</p>
              </figcaption>
            </figure>
            <p className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.2em] text-matte/40">
              Carrier · chapter still
            </p>
          </div>
          <div className="flex flex-col justify-center gap-16 px-6 py-16 md:col-span-6 md:px-16">
            {CHAPTERS.map((c) => (
              <button
                key={c.n}
                type="button"
                onClick={() => setChapter(Number(c.n) - 1)}
                className="reel-caption text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                <span className={`font-mono text-[10px] tracking-[0.2em] ${chapter === Number(c.n) - 1 ? "text-gold" : "text-matte/35"}`}>
                  CHAPTER {c.n}
                </span>
                <span className="mt-2 block font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05]">{c.title}</span>
                <span className="mt-3 block max-w-sm font-sans text-[15px] text-matte/60">{c.body}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-matte/10 px-6 py-28">
        <div className="mx-auto max-w-[1440px] md:w-7/12 md:ml-[8%]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-matte/40">{AREA}</p>
          <p className="mt-6 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.05]">
            Editorial, not a gallery of three equal frames. The still stays. The copy walks past it.
          </p>
        </div>
      </section>

      <section id="colophon" className="border-t border-matte/10 px-6 py-24">
        <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Colophon</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]">
              Request a recovery audit.
            </h2>
            <p className="mt-6 max-w-md font-sans text-matte/65">
              No named customers. No stills of work we have not done. Write {EMAIL}.
            </p>
            <div className="mt-8">
              <LiveButton href={`mailto:${EMAIL}`}>{CTA_FLOW}</LiveButton>
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
