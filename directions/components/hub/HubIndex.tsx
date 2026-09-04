"use client";

import { useRef } from "react";
import Link from "next/link";
import { AREA, DIRECTIONS, EMAIL, PHONE, PHONE_HREF, WEDGE } from "@/lib/facts";
import { AIS_REVEAL, AIS_RISE, AIS_STAGGER, aisEase, gsap, useGSAP } from "@/lib/register-gsap";
import { bindAiasLive, freezeAiasLive } from "@/lib/bind-aias-live";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { CallPhone } from "@/components/shared/CallPhone";

export function HubIndex() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced === null) return;
      if (reduced) {
        gsap.set(line.current, { scaleX: 1, filter: "none", y: 0, autoAlpha: 1 });
        gsap.set(".hub-row", { autoAlpha: 1, x: 0, y: 0, filter: "none" });
        if (root.current) freezeAiasLive(root.current);
        return;
      }
      if (root.current) bindAiasLive(root.current);
      gsap.set(line.current, { scaleX: 0, transformOrigin: "left center" });
      const tl = gsap.timeline({ defaults: { ease: aisEase } });
      tl.fromTo(
        line.current,
        { scaleX: 0, filter: "blur(6px)", y: AIS_RISE, autoAlpha: 0 },
        { scaleX: 1, filter: "blur(0px)", y: 0, autoAlpha: 1, duration: AIS_REVEAL },
      ).fromTo(
        ".hub-row",
        { y: AIS_RISE, filter: "blur(6px)", autoAlpha: 0 },
        { y: 0, filter: "blur(0px)", autoAlpha: 1, stagger: AIS_STAGGER, duration: 0.85 },
        AIS_STAGGER,
      );
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="min-h-screen bg-ink text-matte">
      <header className="sticky top-0 z-30 border-b border-black bg-ink">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5">
          <Wordmark tone="dark" kicker="Directions" />
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-matte/45 md:block">{WEDGE}</p>
        </div>
        <span ref={line} aria-hidden className="signal-line metal-rule block h-px origin-left" />
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] metal-text">Draft index · not live</p>
        <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.8rem,7vw,6.2rem)] leading-[0.88] tracking-[-0.03em]">
          Five halls.
          <br />
          One recovery.
        </h1>
        <p className="intro-beat mt-8 max-w-lg font-sans text-[16px] leading-relaxed text-matte/65">
          Hambrick &amp; Co. — AI automation. {WEDGE}. {AREA}. These routes are stacked Next / R3F / GSAP drafts.
          Production hambrickco.com stays on the static root.
        </p>

        <div className="mt-12">
          <CallPhone compact />
        </div>

        <ol className="mt-16">
          {DIRECTIONS.map((d) => (
            <li key={d.slug} className="hub-row signal-related border-t border-black">
              <Link
                href={`/${d.slug}`}
                className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-7 md:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1.1fr)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                <span className="font-mono text-[11px] text-matte/35">{d.n}</span>
                <span className="font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-none">
                  {d.name}
                </span>
                <span className="col-span-2 mt-2 font-sans text-[14px] text-matte/50 md:col-span-1 md:mt-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] metal-text">{d.carrier}</span>
                  <span className="mt-1 block">{d.line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <footer className="mt-24 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-matte/45">
          <a className="hover:opacity-80" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <a className="hover:opacity-80" href={PHONE_HREF}>
            {PHONE}
          </a>
          <span>{AREA}</span>
        </footer>
      </main>
    </div>
  );
}
