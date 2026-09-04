"use client";

import dynamic from "next/dynamic";

const GoldFilament = dynamic(
  () => import("@/components/society/GoldFilament").then((m) => m.GoldFilament),
  { ssr: false },
);
const TicketScene = dynamic(
  () => import("@/components/proof/TicketScene").then((m) => m.TicketScene),
  { ssr: false },
);
const ProofRibbon = dynamic(
  () => import("@/components/proof/TicketScene").then((m) => m.ProofRibbon),
  { ssr: false },
);
const FilmGate = dynamic(() => import("@/components/reel/FilmGate").then((m) => m.FilmGate), {
  ssr: false,
});
const SoftObject = dynamic(
  () => import("@/components/balance/SoftObject").then((m) => m.SoftObject),
  { ssr: false },
);
const PeelSheet = dynamic(() => import("@/components/assist/PeelSheet").then((m) => m.PeelSheet), {
  ssr: false,
});

export function FilamentSlot({ progress }: { progress: number }) {
  return <GoldFilament progress={progress} />;
}
export function TicketSlot({ progress }: { progress: number }) {
  return <TicketScene progress={progress} />;
}

export function RibbonSlot({ progress }: { progress: number }) {
  return <ProofRibbon progress={progress} />;
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
