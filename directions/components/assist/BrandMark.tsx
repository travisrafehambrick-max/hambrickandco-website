"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { GoldMetalAnd, GoldMetalRim } from "@/components/shared/MetalKit";
import { bindMagnetic } from "@/lib/bind-magnetic";

type Tone = "dark" | "light";

export function BrandMark({ tone = "dark", href = "/" }: { tone?: Tone; href?: string }) {
  const ink = tone === "dark" ? "text-matte" : "text-ink";
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return bindMagnetic(ref.current, 20);
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      data-magnetic="20"
      className={`brand-mark ${ink}`}
      aria-label="Hambrick & Co."
    >
      <GoldMetalRim />
      <span className="brand-mark__lockup">
        <span className="brand-mark__name">Hambrick</span>
        <GoldMetalAnd />
        <span className="brand-mark__house">Co</span>
      </span>
    </Link>
  );
}
