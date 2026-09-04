"use client";

import { useRef, useState } from "react";
import { AREA, CTA_AUDIT, CTA_FLOW, EMAIL, PHONE, PHONE_HREF } from "@/lib/facts";
import { AIS_REVEAL, AIS_RISE, LINEAR, STILLNESS, aisEase, gsap, useGSAP } from "@/lib/register-gsap";
import { bindAiasLive, freezeAiasLive } from "@/lib/bind-aias-live";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/shared/Wordmark";
import { LiveButton } from "@/components/shared/LiveButton";
import { AuditForm } from "@/components/shared/AuditForm";
import { PeelSlot } from "@/components/shared/CanvasSlot";
import { bindMagnetic } from "@/lib/bind-magnetic";

const THREAD = [
  { t: "14:02", who: "Missed", text: "Can you still do the estimate this week?", state: "missed" as const },
  { t: "14:02", who: "Alert", text: "Sheet sits on the lock screen.", state: "missed" as const },
  { t: "14:04", who: "Callback", text: "Yes — we can hold Thursday morning. Confirm the address?", state: "live" as const },
  { t: "14:06", who: "Recovered", text: "Same street. After 9 is fine.", state: "live" as const },
];

const CONSOLE = [
  "queue.open  inbound.sms",
  "wait        2h 14m  — dead",
  "recover     first_reply",
  "send        estimate_hold",
  "state       recovered",
];

export function AssistPane() {
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0.18);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (reduced === null) return;

      if (reduced) {
        gsap.set(sheet.current, { rotateX: 0, y: 0, filter: "none" });
        gsap.set(".assist-msg", { autoAlpha: 1, x: 0, y: 0, filter: "none" });
        gsap.set(".console-line", { autoAlpha: 1 });
        if (root.current) freezeAiasLive(root.current);
        setProgress(1);
        setActive(THREAD.length - 1);
        return;
      }

      if (root.current) bindAiasLive(root.current);
      const releaseMarks = Array.from(root.current?.querySelectorAll<HTMLElement>(".assist-mark") ?? []).map((el) =>
        bindMagnetic(el, 14),
      );

      const intro = gsap.timeline({ defaults: { ease: aisEase } });
      intro
        .fromTo(
          sheet.current,
          { rotateX: 62, y: AIS_RISE, filter: "blur(6px)" },
          { rotateX: 28, y: 8, filter: "blur(0px)", duration: AIS_REVEAL },
        )
        .fromTo(".assist-msg.missed", { x: -12 }, { x: 0, duration: 0.4 }, 0)
        .fromTo(".assist-msg.live", { autoAlpha: 0.15 }, { autoAlpha: 0.85, duration: 0.45 }, 0.25)
        .to({}, { duration: STILLNESS });
      intro.eventCallback("onUpdate", () => setProgress(intro.progress() * 0.35));
      intro.eventCallback("onComplete", () => setActive(2));

      const pin = gsap.timeline({
        defaults: { ease: LINEAR },
        scrollTrigger: {
          trigger: ".assist-pin",
          start: "top top",
          end: "+=72%",
          pin: true,
          scrub: 0.7,
        },
      });

      pin
        .to(sheet.current, { rotateX: 0, y: 0, duration: 0.7 })
        .to(
          {},
          {
            duration: 0.7,
            onUpdate() {
              const p = 0.35 + this.progress() * 0.65;
              setProgress(p);
              setActive(Math.min(THREAD.length - 1, Math.floor(p * THREAD.length)));
            },
          },
          0,
        )
        .fromTo(".console-line", { x: -20 }, { x: 0, stagger: 0.08, duration: 0.4 }, 0.1)
        .to({}, { duration: 0.18 });

      return () => {
        releaseMarks.forEach((fn) => fn());
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="min-h-screen bg-ink text-matte">
      <header className="sticky top-0 z-40 border-b border-black bg-ink">
        <div className="grid grid-cols-2">
          <div className="flex items-center justify-between border-r border-black px-5 py-3 md:px-8">
            <Wordmark tone="dark" kicker="Assist" />
          </div>
          <div className="flex items-center justify-between px-5 py-3 md:px-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-matte/45">Console</span>
            <LiveButton href="#request">{CTA_AUDIT}</LiveButton>
          </div>
        </div>
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-2 border-t border-black px-5 py-2 md:px-8"
        >
          {(["Missed", "Alert", "Callback", "Recovered"] as const).map((verb, i) => {
            const on = i === active;
            const live = on && (verb === "Callback" || verb === "Recovered");
            return (
              <button
                key={verb}
                type="button"
                onClick={() => setActive(i)}
                className={`assist-mark font-mono text-[10px] uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                  live ? "metal-text" : on ? "text-matte" : "text-matte/35"
                }`}
              >
                {verb}
              </button>
            );
          })}
        </div>
      </header>

      <section className="grid min-h-[100svh] md:grid-cols-2">
        <div className="flex flex-col justify-end border-b border-black px-5 py-12 md:border-b-0 md:border-r md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-matte/40">Missed</p>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.9]">
            Missed
            <br />
            thread.
          </h1>
          <p className="intro-beat mt-6 max-w-sm font-sans text-[15px] text-matte/60">
            A person on the left. The quiet machine on the right.
          </p>
          <div className="mt-10 space-y-4">
            {THREAD.filter((m) => m.state === "missed").map((m) => (
              <p key={m.t + m.text} className="assist-msg missed max-w-sm border-l border-matte/20 pl-4">
                <span className="font-mono text-[10px] text-matte/40">
                  {m.t} · {m.who}
                </span>
                <span className="mt-1 block font-sans text-[15px]">{m.text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col justify-end px-5 py-12 md:px-8">
          <div className="pointer-events-none absolute right-4 top-6 h-40 w-[46%]">
            <PeelSlot progress={Math.max(progress, 0.18)} />
          </div>
          <p className="metal-text font-display italic text-3xl md:text-5xl">Recovered thread.</p>
          <div className="mt-10 space-y-4">
            {THREAD.filter((m) => m.state === "live").map((m) => (
              <p key={m.t + m.text} className="assist-msg live max-w-sm border-l-2 pl-4" style={{ borderImage: "linear-gradient(180deg, #6e5a3a, #f3eee4, #c4a574) 1" }}>
                <span className="font-mono text-[10px] metal-text">
                  {m.t} · {m.who}
                </span>
                <span className="mt-1 block font-sans text-[15px]">{m.text}</span>
              </p>
            ))}
          </div>
          <article
            ref={sheet}
            style={{ transformStyle: "preserve-3d", perspective: 800 }}
            className="absolute left-0 top-10 z-10 w-[min(240px,68%)] origin-top -translate-x-1/2 border border-ink/10 bg-matte p-5 text-ink max-md:left-auto max-md:right-5 max-md:translate-x-0"
          >
            <p className="font-display text-xl leading-tight">
              {progress > 0.4 ? "Recovered" : "Missed"}
            </p>
            <p className="mt-2 font-sans text-[14px] text-ink/60">
              {progress > 0.4 ? "Estimate hold · Thursday" : "2h 14m on the lock screen"}
            </p>
          </article>
        </div>
      </section>

      <section className="assist-pin border-t border-black">
        <div className="grid min-h-[100svh] md:grid-cols-2">
          <div className="relative border-r border-black">
            <div data-depth="device" className="h-[36vh] md:h-full">
              <PeelSlot progress={progress} />
            </div>
          </div>
          <div className="px-5 py-10 md:px-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-matte/40">
              {AREA}
            </p>
            <ol className="mt-8 space-y-3">
              {THREAD.map((m, i) => {
                const on = i <= active;
                const live = m.state === "live" && on;
                return (
                  <li key={m.text}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className={`assist-mark w-full px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                        live ? "metal-edge" : "border border-matte/15"
                      } ${on ? "text-matte" : "text-matte/35"}`}
                    >
                      <span className={`font-mono text-[10px] ${live ? "metal-text" : ""}`}>
                        {m.t} · {m.who}
                      </span>
                      <span className="mt-1 block font-sans text-[14px]">{m.text}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <pre data-depth="mid" className="mt-10 overflow-x-auto font-mono text-[11px] leading-6 text-matte/50">
              {CONSOLE.map((line, i) => (
                <div key={line} className={`console-line ${progress > 0.55 && i >= 2 ? "metal-text" : ""}`}>
                  {line}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </section>

      <section id="request" className="border-t border-black px-5 py-24 md:px-10">
        <div className="mx-auto grid max-w-[1200px] gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.95]">
              Request a recovery audit.
            </h2>
            <p className="mt-6 max-w-md font-sans text-matte/60">
              Split pane is the work: a person on the left, the quiet machine on the right. Write {EMAIL} or call{" "}
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
