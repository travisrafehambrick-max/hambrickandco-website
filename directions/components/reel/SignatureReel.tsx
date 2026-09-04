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
  {
    n: "01",
    title: "Empty desk at 16:12",
    body: "The inbound sat. Nobody marked it. The still is the miss.",
    mark: "empty",
  },
  {
    n: "02",
    title: "Reply in the same light",
    body: "Four minutes. Same chair. The still holds while the copy walks.",
    mark: "reply",
  },
  {
    n: "03",
    title: "Estimate on the table",
    body: "Not a campaign. A number that made it back to the person who asked.",
    mark: "quote",
  },
];

function ChapterStill({ mark, live }: { mark: string; live: boolean }) {
  const rule = live ? "bg-gold" : "bg-matte/25";
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <span className={`absolute left-6 top-6 h-px w-16 ${rule}`} />
      <span className={`absolute right-6 top-6 h-16 w-px ${rule}`} />
      {mark === "empty" && (
        <div className="absolute inset-[22%] border border-matte/15" />
      )}
      {mark === "reply" && (
        <div className="absolute inset-[18%] border border-gold">
          <div className="absolute left-4 top-4 h-8 w-24 bg-gold" />
          <div className="absolute bottom-6 left-4 right-4 h-px bg-gold/70" />
        </div>
      )}
      {mark === "quote" && (
        <div className="absolute inset-x-[16%] inset-y-[20%] border border-gold/80 bg-matte/[0.04] p-5">
          <div className="h-px w-2/3 bg-gold" />
          <div className="mt-4 h-px w-full bg-matte/20" />
          <div className="mt-3 h-px w-5/6 bg-matte/20" />
          <div className="mt-3 h-px w-1/2 bg-matte/20" />
        </div>
      )}
    </div>
  );
}

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
      <header className="sticky top-0 z-40 border-b border-matte/10 bg-ink">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <Wordmark tone="dark" kicker="Reel" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-matte/70">
            Folio 0{chapter + 1} / 03
          </p>
          <LiveButton href="#colophon" tone="ghost-light">
            {CTA_AUDIT}
          </LiveButton>
        </div>
      </header>

      <section className="mx-auto min-h-[100svh] max-w-[1440px] px-6 pb-16 pt-8">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="reel-missed md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-matte/40">03 — Signature Reel</p>
            <h1 className="mt-6 font-display text-[clamp(3.4rem,10vw,8.4rem)] leading-[0.8] tracking-[-0.035em]">
              Missed
              <br />
              still.
            </h1>
          </div>
          <div className="reel-recovered md:col-span-5 md:text-right">
            <p className="font-display italic text-3xl text-gold md:text-5xl">Recovered still.</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">16:16 · reply filed</p>
          </div>
        </div>
        <div className="mt-12 grid items-end gap-6 md:grid-cols-12">
          <div className="reel-missed relative aspect-[16/9] border border-matte/15 md:col-span-7">
            <ChapterStill mark="empty" live={false} />
            <p className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.2em] text-matte/50">
              16:12 · inbox empty
            </p>
          </div>
          <div className="reel-recovered relative aspect-[4/5] border border-gold md:col-span-5">
            <ChapterStill mark="reply" live />
            <p className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
              Recovered frame
            </p>
          </div>
        </div>
      </section>

      <section className="reel-pin border-t border-matte/10">
        <div className="mx-auto grid min-h-[100svh] max-w-[1440px] md:grid-cols-12">
          <div className="relative md:col-span-6">
            <div className="absolute inset-0">
              <GateSlot progress={progress} />
            </div>
            <figure className={`relative z-10 mx-auto mt-[14vh] aspect-[4/5] w-[min(72%,420px)] bg-ink ${progress > 0.28 ? "border border-gold" : "border border-matte/20"}`}>
              <ChapterStill mark={still.mark} live={progress > 0.28} />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{still.n}</p>
                <p className="mt-2 font-display text-3xl leading-tight">{still.title}</p>
              </figcaption>
            </figure>
            <p className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.2em] text-matte/40">
              Still holds
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
