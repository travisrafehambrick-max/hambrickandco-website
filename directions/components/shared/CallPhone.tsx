"use client";

import { useEffect, useState } from "react";
import { AIS_CROSSFADE } from "@/lib/ais-ease";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const FACES = [
  { verb: "Missed", line: "2h 14m on the lock screen", live: false },
  { verb: "Alert", line: "Sheet sits. Nobody marked it.", live: false },
  { verb: "Callback", line: "First reply out · 14:04", live: true },
  { verb: "Recovered", line: "Estimate hold · Thursday", live: true },
] as const;

/** Recurring call carrier. Auto-crossfade 4.5s — never scroll-scrubbed. */
export function CallPhone({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(reduced ? FACES.length - 1 : 0);

  useEffect(() => {
    if (reduced === null) return;
    if (reduced) {
      setI(FACES.length - 1);
      return;
    }
    const id = window.setInterval(() => {
      setI((n) => (n + 1) % FACES.length);
    }, AIS_CROSSFADE * 1000);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <figure
      data-depth="device"
      className={`relative overflow-hidden border border-black bg-ink text-matte ${
        compact ? "w-[min(100%,220px)]" : "w-[min(100%,260px)]"
      }`}
    >
      <p className="border-b border-black px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-matte/40">
        Call
      </p>
      <div className={`relative ${compact ? "h-[168px]" : "h-[210px]"}`}>
        {FACES.map((face, n) => {
          const on = n === i;
          return (
            <div
              key={face.verb}
              className="phone-face absolute inset-0 flex flex-col justify-between p-5"
              style={{
                opacity: on ? 1 : 0,
                transition: reduced ? "none" : `opacity ${AIS_CROSSFADE * 0.22}s cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
              aria-hidden={!on}
            >
              <p
                className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                  face.live ? "metal-text" : "text-matte/40"
                }`}
              >
                {face.verb}
              </p>
              <p className="font-display text-[1.55rem] leading-[1.1]">{face.line}</p>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
