"use client";

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
export function PeelSlot({ progress }: { progress: number }) {
  return <PeelSheet progress={progress} />;
}
