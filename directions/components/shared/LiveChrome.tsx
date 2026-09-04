"use client";

import { MetalParityAnchor, MetalRimCTA } from "@/components/shared/MetalKit";
import { PageProgress } from "@/components/shared/PageProgress";
import { SmoothScroll } from "@/components/shared/SmoothScroll";

export function LiveChrome() {
  return (
    <>
      <SmoothScroll />
      <PageProgress />
      <MetalParityAnchor />
      <div className="metal-parity-cta">
        <MetalRimCTA href="#request">Request a recovery audit</MetalRimCTA>
      </div>
    </>
  );
}
