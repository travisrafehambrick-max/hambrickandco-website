"use client";

import { useEffect, useRef, useState } from "react";
import { GoldMetalTrace } from "@/components/shared/MetalKit";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const LOGO_VIEW_BOX = "-8 -8 329 310";

const TRACE_PATH =
  "M68.6484 121.746L112.751 21.0823C118.355 8.29253 131.211 0 145.436 0H169.659C183.884 0 196.74 8.29253 202.344 21.0823L246.447 121.746L306.119 209.304C313.198 219.69 314.044 232.99 308.338 244.155L293.469 273.244C286.624 286.636 271.786 294.241 256.634 292.123L157.548 278.277L58.0126 293.577C43.0841 295.871 28.3036 288.686 21.1586 275.661L4.31779 244.96C-2.02676 233.393 -1.17512 219.319 6.51994 208.565L68.6484 121.746Z";

const FILL_PATHS = [
  "M58.0126 293.577L157.548 278.277L68.6484 121.746L6.51994 208.565C-1.17512 219.319 -2.02676 233.393 4.31779 244.96L21.1586 275.661C28.3036 288.686 43.0841 295.871 58.0126 293.577Z",
  "M112.751 21.0823L68.6484 121.746H246.447L202.344 21.0823C196.74 8.29253 183.884 0 169.659 0H145.436C131.211 0 118.355 8.29253 112.751 21.0823Z",
  "M246.447 121.746L157.548 278.277L256.634 292.123C271.786 294.241 286.624 286.636 293.469 273.244L308.338 244.155C314.044 232.99 313.198 219.69 306.119 209.304L246.447 121.746Z",
] as const;

type Phase = "loop" | "closingOutline" | "fadingFill" | "done";

type Props = {
  isComplete?: boolean;
  size?: number;
  strokeWidth?: number;
  loopDurationSeconds?: number;
  fillFadeSeconds?: number;
  closeSeconds?: number;
  className?: string;
  ariaLabel?: string;
  decorative?: boolean;
  onDone?: () => void;
};

function reducedNow() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LogoTraceMark({
  isComplete = false,
  size = 30,
  strokeWidth = 6,
  loopDurationSeconds = 1.05,
  fillFadeSeconds = 0.32,
  closeSeconds = 0.36,
  className = "",
  ariaLabel = "Loading",
  decorative = false,
  onDone,
}: Props) {
  const reduced = useReducedMotion();
  const announced = useRef(false);
  const [phase, setPhase] = useState<Phase>(() => (reducedNow() ? "done" : "loop"));

  useEffect(() => {
    if (reduced === true || (isComplete && reducedNow() && reduced !== false)) {
      setPhase("done");
      return;
    }
    if (reduced === null) return;
    if (!isComplete) {
      setPhase("loop");
      return;
    }

    let fillTimer = 0;
    setPhase("closingOutline");
    const closeTimer = window.setTimeout(() => {
      setPhase("fadingFill");
      fillTimer = window.setTimeout(() => setPhase("done"), fillFadeSeconds * 1000);
    }, closeSeconds * 1000);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(fillTimer);
    };
  }, [reduced, isComplete, closeSeconds, fillFadeSeconds]);

  useEffect(() => {
    if (phase !== "done" || announced.current) return;
    announced.current = true;
    onDone?.();
  }, [phase, onDone]);

  const showFills = phase === "fadingFill" || phase === "done";
  const resolved = phase === "done";
  const ghostWidth = Math.max(1, strokeWidth / 2);

  return (
    <span
      className={`logo-trace-mark text-gold ${className}`.trim()}
      data-phase={phase}
      data-logo-trace="16834"
      style={{ width: size, height: size, color: "#C4A574" }}
    >
      <svg
        role={decorative ? undefined : resolved ? "img" : "status"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : resolved ? "Hambrick & Co." : ariaLabel}
        viewBox={LOGO_VIEW_BOX}
        width={size}
        height={size}
        fill="none"
        className="logo-trace-mark__svg"
      >
        <g opacity="0.18">
          <path
            d={TRACE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={ghostWidth}
            strokeLinejoin="round"
          />
        </g>
        {phase === "loop" ? (
          <path
            className="logo-trace-mark__loop"
            d={TRACE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="0.16 0.84"
            style={{
              animation: `logo-trace-loader-loop ${loopDurationSeconds}s linear infinite`,
            }}
          />
        ) : null}
        {phase === "closingOutline" ? (
          <path
            className="logo-trace-mark__close"
            d={TRACE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1}
            style={{
              animation: `logo-trace-loader-close ${closeSeconds}s ease-out forwards`,
            }}
          />
        ) : null}
        {showFills
          ? FILL_PATHS.map((d) => (
              <path
                key={d}
                className="logo-trace-mark__fills"
                d={d}
                fill="currentColor"
                style={
                  phase === "fadingFill"
                    ? { animation: `logo-trace-loader-fill ${fillFadeSeconds}s ease-out both` }
                    : undefined
                }
              />
            ))
          : null}
        <style>{`
          @keyframes logo-trace-loader-loop {
            to { stroke-dashoffset: -1; }
          }
          @keyframes logo-trace-loader-close {
            to { stroke-dashoffset: 0; }
          }
          @keyframes logo-trace-loader-fill {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </svg>
      {showFills ? <GoldMetalTrace /> : null}
    </span>
  );
}
