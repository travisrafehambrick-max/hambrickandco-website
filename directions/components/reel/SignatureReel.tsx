"use client";

import { useRef, useState } from "react";
import { AREA, CTA_AUDIT, CTA_FLOW, EMAIL, PHONE, PHONE_HREF } from "@/lib/facts";
import { ScrollTrigger, aisEase, gsap, useGSAP } from "@/lib/register-gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { GateSlot } from "@/components/shared/CanvasSlot";
import { GoldMetalMark } from "@/components/shared/MetalKit";

const CONTROL = 0.45;

const CHAPTERS = [
  {
    n: "01",
    title: "Empty desk",
    body: "The inbound sat. Nobody marked it. The still is the miss.",
    mark: "empty",
  },
  {
    n: "02",
    title: "Reply in the same light",
    body: "Same chair. The still holds while the copy walks.",
    mark: "reply",
  },
  {
    n: "03",
    title: "Estimate on the table",
    body: "Not a campaign. A number that made it back to the person who asked.",
    mark: "quote",
  },
] as const;

function ChapterStill({ mark, live }: { mark: string; live: boolean }) {
  const rule = live ? "metal-rule" : "bg-matte/25";
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <span className={`absolute left-6 top-6 h-px w-16 ${rule}`} />
      <span className={`absolute right-6 top-6 h-16 w-px ${rule}`} />
      {mark === "empty" && <div className="absolute inset-[22%] border border-matte/15" />}
      {mark === "reply" && (
        <div className="absolute inset-[18%] metal-edge" style={{ ["--metal-fill" as string]: "#121212" }}>
          <div className="absolute left-4 top-4 h-8 w-24 metal-rule" />
          <div className="absolute bottom-6 left-4 right-4 h-px metal-rule" />
        </div>
      )}
      {mark === "quote" && (
        <div
          className="absolute inset-x-[16%] inset-y-[20%] metal-edge bg-matte/[0.04] p-5"
          style={{ ["--metal-fill" as string]: "#121212" }}
        >
          <div className="h-px w-2/3 metal-rule" />
          <div className="mt-4 h-px w-full bg-matte/20" />
          <div className="mt-3 h-px w-5/6 bg-matte/20" />
          <div className="mt-3 h-px w-1/2 bg-matte/20" />
        </div>
      )}
    </div>
  );
}

function DashMark() {
  return <span aria-hidden className="metal-rule inline-block h-px w-8 shrink-0" />;
}

export function SignatureReel() {
  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0.32);
  const [chapter, setChapter] = useState(0);

  useGSAP(
    () => {
      if (reduced === null) return;

      if (reduced) {
        gsap.set(".reel-stage", { scale: 1, filter: "none", y: 0 });
        gsap.set(header.current, { yPercent: 0 });
        setProgress(1);
        setChapter(CHAPTERS.length - 1);
        return;
      }

      let last = 0;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: () => {
          const y = window.scrollY;
          const hide = y > last && y > 72;
          last = y;
          gsap.to(header.current, {
            yPercent: hide ? -100 : 0,
            duration: CONTROL,
            ease: aisEase,
            overwrite: "auto",
          });
        },
      });

      CHAPTERS.forEach((_, i) => {
        const stage = root.current?.querySelector<HTMLElement>(`.reel-stage[data-ch="${i}"]`);
        ScrollTrigger.create({
          trigger: `.reel-chapter[data-ch="${i}"]`,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.65,
          onToggle: (self) => {
            if (self.isActive) setChapter(i);
          },
          onUpdate: (self) => {
            if (!self.isActive) return;
            const p = self.progress;
            if (stage) {
              gsap.set(stage, {
                scale: 0.96 + p * 0.04,
                filter: "none",
                y: 0,
                autoAlpha: 1,
              });
            }
            setProgress((i + p) / CHAPTERS.length);
          },
        });
      });

      ScrollTrigger.create({
        trigger: ".reel-track",
        start: "top top",
        end: "bottom bottom",
        onToggle: (self) => {
          gsap.to(orb.current, {
            autoAlpha: self.isActive ? 1 : 0,
            duration: CONTROL,
            ease: aisEase,
            overwrite: "auto",
          });
        },
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="min-h-screen bg-ink text-matte">
      <header ref={header} className="reel-header sticky top-0 z-40 border-b border-black bg-ink">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <Wordmark tone="dark" />
          <LiveButton href="#colophon" tone="ghost-light">
            {CTA_AUDIT}
          </LiveButton>
        </div>
      </header>

      <div className="reel-track">
        <div
          ref={orb}
          className="reel-orb pointer-events-none sticky top-[22vh] z-20 mx-auto h-[min(36vh,320px)] w-[min(36vh,320px)] md:fixed md:right-[6%] md:top-[22vh] md:mx-0 md:h-[min(40vh,380px)] md:w-[min(40vh,380px)]"
        >
          <GateSlot progress={progress} />
        </div>

        <section className="relative mx-auto min-h-[100svh] max-w-[1440px] px-6 pb-20 pt-8 md:pr-[38%]">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-matte/40">
            <span aria-hidden className="h-px w-8 bg-matte/25" />
            Missed still
          </p>
          <h1 className="mt-6 font-display text-[clamp(3.4rem,10vw,8.4rem)] leading-[0.8] tracking-[-0.035em]">
            Missed
            <br />
            still.
          </h1>
          <p className="mt-8 flex items-center gap-3 font-display italic text-[clamp(2rem,4vw,3.4rem)] leading-none">
            <GoldMetalMark />
            <span className="metal-text">Recovered still.</span>
          </p>
          <p className="mt-6 max-w-sm font-sans text-[15px] text-matte/55">
            One gold object through the cut. {AREA}.
          </p>
          <nav className="mt-8 flex flex-wrap gap-5" aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.n}
                type="button"
                onClick={() =>
                  document.querySelector<HTMLElement>(`.reel-chapter[data-ch="${i}"]`)?.scrollIntoView({ behavior: "smooth" })
                }
                className="reel-calm flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-matte/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                <DashMark />
                {c.n}
              </button>
            ))}
          </nav>

          <div className="mt-14 grid items-end gap-6 md:grid-cols-2">
            <figure className="relative aspect-[16/9] border border-matte/15">
              <ChapterStill mark="empty" live={false} />
              <figcaption className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.2em] text-matte/50">
                Inbox empty
              </figcaption>
            </figure>
            <figure className="relative aspect-[4/5] max-w-[280px] metal-edge md:justify-self-start" style={{ ["--metal-fill" as string]: "#121212" }}>
              <ChapterStill mark="reply" live />
              <figcaption className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.2em] metal-text">
                Recovered frame
              </figcaption>
            </figure>
          </div>
        </section>

        {CHAPTERS.map((c, i) => (
          <div key={c.n}>
            {i > 0 ? (
              <div className="reel-hold flex min-h-[46svh] items-center justify-center border-y border-black bg-ink" aria-hidden>
                <span className="block h-px w-16 bg-matte/20" />
              </div>
            ) : (
              <div className="reel-hold min-h-[28svh] border-t border-black bg-ink" aria-hidden />
            )}
            <section
              data-ch={i}
              className="reel-chapter min-h-[100svh] bg-ink"
              aria-hidden={chapter !== i}
            >
              <div
                className="mx-auto grid min-h-[100svh] max-w-[1440px] md:grid-cols-12 md:pr-[32%]"
                style={{ opacity: chapter === i ? 1 : 0, pointerEvents: chapter === i ? "auto" : "none" }}
              >
                <div className="flex items-center justify-center px-6 py-16 md:col-span-6">
                  <figure
                    data-ch={i}
                    className={`reel-stage aspect-[4/5] w-[min(100%,420px)] bg-ink ${
                      chapter === i && progress > 0.22 ? "metal-edge" : "border border-matte/20"
                    }`}
                    style={{ ["--metal-fill" as string]: "#121212" }}
                  >
                    <ChapterStill mark={c.mark} live={chapter === i && progress > 0.22} />
                  </figure>
                </div>
                <div className="flex flex-col justify-center px-6 py-16 md:col-span-6 md:px-12">
                  <p className="flex items-center gap-3">
                    <DashMark />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] metal-text">{c.n}</span>
                  </p>
                  <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-matte">
                    {c.title}
                  </h2>
                  <p className="mt-4 max-w-sm font-sans text-[15px] text-matte/60">{c.body}</p>
                </div>
              </div>
            </section>
          </div>
        ))}
      </div>

      <section id="colophon" className="border-t border-black px-6 py-24">
        <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="flex items-center gap-3">
              <DashMark />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] metal-text">Colophon</span>
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.95] text-matte">
              Request a recovery audit.
            </h2>
            <p className="mt-6 max-w-md font-sans text-matte/65">
              No named customers. No stills of work we have not done. No invented counts. Write {EMAIL} or call{" "}
              <a className="reel-calm metal-text" href={PHONE_HREF}>
                {PHONE}
              </a>
              .
            </p>
            <div className="mt-8">
              <a className="reel-calm font-mono text-[11px] uppercase tracking-[0.18em] metal-text" href={`mailto:${EMAIL}`}>
                {CTA_FLOW}
              </a>
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
