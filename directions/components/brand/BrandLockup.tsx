"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoTraceMark } from "@/components/brand/LogoTraceMark";
import { GoldMetalAnd, GoldMetalRim } from "@/components/shared/MetalKit";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Tone = "dark" | "light";

const RESOLVE_MS = 900;

export function BrandLockup({ tone = "dark", href = "/" }: { tone?: Tone; href?: string }) {
  const ink = tone === "dark" ? "text-matte" : "text-ink";
  const reduced = useReducedMotion();
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (reduced === null) return;
    if (reduced) {
      setComplete(true);
      return;
    }
    const id = window.setTimeout(() => setComplete(true), RESOLVE_MS);
    return () => window.clearTimeout(id);
  }, [reduced]);

  return (
    <Link href={href} className={`brand-mark brand-lockup ${ink}`} aria-label="Hambrick & Co.">
      <GoldMetalRim />
      <span className="brand-lockup__glyph" aria-hidden>
        <LogoTraceMark size={30} isComplete={complete} decorative />
      </span>
      <span className="brand-mark__lockup brand-lockup__word">
        <span className="brand-mark__name">Hambrick</span>
        <GoldMetalAnd />
        <span className="brand-mark__house">Co</span>
      </span>
    </Link>
  );
}
