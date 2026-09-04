"use client";

import Link from "next/link";
import { GoldMetalAnd, GoldMetalRim } from "@/components/shared/MetalKit";

type Tone = "dark" | "light";

export function BrandMark({ tone = "dark", href = "/" }: { tone?: Tone; href?: string }) {
  const ink = tone === "dark" ? "text-matte" : "text-ink";

  return (
    <Link href={href} className={`brand-mark ${ink}`} aria-label="Hambrick & Co.">
      <GoldMetalRim />
      <span className="brand-mark__lockup">
        <span className="brand-mark__name">Hambrick</span>
        <GoldMetalAnd />
        <span className="brand-mark__house">Co.</span>
      </span>
    </Link>
  );
}
