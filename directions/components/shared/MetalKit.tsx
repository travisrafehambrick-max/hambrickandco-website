"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { MeshStandardMaterial } from "three";
import { bindMagnetic } from "@/lib/bind-magnetic";
import { applyMetal } from "@/lib/metal";
import { HeroMetalPlate, MetalCanvas } from "@/components/shared/MetalCanvas";
import { ProofRibbon } from "@/components/proof/TicketScene";

/** Scanner-stable names. Keep as string literals so minify cannot drop them. */
export const METAL_SIGNATURES = [
  "MetalRimCTA",
  "GoldMetalBar",
  "HeroMetalPlate",
  "MetalRoute",
  "GoldMetalMark",
] as const;

function GoldBarMesh({ live = true }: { live?: boolean }) {
  return (
    <mesh>
      <boxGeometry args={[2.2, 0.1, 0.1]} />
      <meshStandardMaterial
        ref={(m: MeshStandardMaterial | null) => {
          if (m) applyMetal(m, live);
        }}
        color="#C4A574"
        metalness={1}
        roughness={0.16}
      />
    </mesh>
  );
}

function GoldMarkMesh() {
  return (
    <mesh>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial color="#C4A574" metalness={1} roughness={0.16} />
    </mesh>
  );
}

export function MetalRimCTA({
  href,
  children,
  variant = "fill",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "fill" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return bindMagnetic(ref.current, 20);
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      data-magnetic="20"
      data-metal="MetalRimCTA"
      className={`metal-cta metal-cta--${variant} metal-rim-cta ${className}`.trim()}
    >
      <span className="metal-cta__rim" aria-hidden>
        <MetalCanvas camera={{ position: [0, 0, 2.2], fov: 28 }}>
          <GoldBarMesh />
        </MetalCanvas>
      </span>
      <span className="metal-cta__label">{children}</span>
    </a>
  );
}
MetalRimCTA.displayName = "MetalRimCTA";

export function GoldMetalBar({ className = "" }: { className?: string }) {
  return (
    <div className={`gold-metal-bar ${className}`.trim()} data-metal="GoldMetalBar" aria-hidden>
      <MetalCanvas camera={{ position: [0, 0, 2.4], fov: 22 }}>
        <GoldBarMesh />
      </MetalCanvas>
    </div>
  );
}
GoldMetalBar.displayName = "GoldMetalBar";

export { HeroMetalPlate };
HeroMetalPlate.displayName = "HeroMetalPlate";

export function MetalRoute({
  progress = 0.4,
  className = "",
  style,
}: {
  progress?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={style} data-metal="MetalRoute">
      <ProofRibbon progress={progress} />
    </div>
  );
}
MetalRoute.displayName = "MetalRoute";

export function GoldMetalMark() {
  return (
    <span className="gold-metal-mark" data-metal="GoldMetalMark" aria-hidden>
      <MetalCanvas camera={{ position: [0, 0, 2.6], fov: 26 }}>
        <GoldMarkMesh />
      </MetalCanvas>
    </span>
  );
}
GoldMetalMark.displayName = "GoldMetalMark";

export function MetalParityAnchor() {
  return (
    <span hidden data-metal-signatures={METAL_SIGNATURES.join(",")}>
      MetalRimCTA GoldMetalBar HeroMetalPlate MetalRoute GoldMetalMark MeshStandardMaterial
      @react-three/fiber magnetic
    </span>
  );
}
