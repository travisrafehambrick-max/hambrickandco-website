"use client";

import { HeroStory } from "@/components/assist/HeroStory";
import { PeelSheet } from "@/components/assist/PeelSheet";
import { SoftObject } from "@/components/balance/SoftObject";
import { TicketScene } from "@/components/proof/TicketScene";
import { FilmGate } from "@/components/reel/FilmGate";
import { MetalRoute } from "@/components/shared/MetalKit";
import { GoldFilament } from "@/components/society/GoldFilament";

export function FilamentSlot({ progress }: { progress: number }) {
  return <GoldFilament progress={progress} />;
}
export function TicketSlot({ progress }: { progress: number }) {
  return <TicketScene progress={progress} />;
}

export function RibbonSlot({ progress }: { progress: number }) {
  return <MetalRoute progress={progress} />;
}
export function GateSlot({ progress }: { progress: number }) {
  return <FilmGate progress={progress} />;
}
export function ObjectSlot({ progress }: { progress: number }) {
  return <SoftObject progress={progress} />;
}
export function PeelSlot({ progress, step = 0 }: { progress: number; step?: number }) {
  return (
    <div className="peel-slot">
      <HeroStory step={step} />
      <div className="peel-slot__accent" aria-hidden>
        <PeelSheet progress={progress} />
      </div>
    </div>
  );
}
