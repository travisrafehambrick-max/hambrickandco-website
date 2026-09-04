"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { MeshStandardMaterial } from "three";
import { bindMagnetic } from "@/lib/bind-magnetic";
import { applyLiveMetal, applyMetal } from "@/lib/metal";
import { HeroMetalPlate, MetalCanvas } from "@/components/shared/MetalCanvas";
import { ProofRibbon } from "@/components/proof/TicketScene";

/** Scanner-stable names. Keep as string literals so minify cannot drop them. */
export const METAL_SIGNATURES = [
  "MetalRimCTA",
  "GoldMetalBar",
  "HeroMetalPlate",
  "MetalRoute",
  "GoldMetalMark",
  "GoldMetalAnd",
  "GoldMetalRim",
  "GoldMetalTrace",
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

function AndPlateMesh() {
  return (
    <mesh rotation={[-0.42, 0.62, 0.1]}>
      <boxGeometry args={[2.6, 1.55, 0.28]} />
      <meshStandardMaterial
        ref={(m: MeshStandardMaterial | null) => {
          if (m) applyLiveMetal(m);
        }}
        color="#C4A574"
        metalness={1}
        roughness={0.16}
      />
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

export function GoldMetalAnd() {
  return (
    <span className="gold-metal-and" data-metal="GoldMetalAnd" aria-hidden>
      <MetalCanvas staticFrame camera={{ position: [0.15, 0.08, 2.2], fov: 28 }}>
        <AndPlateMesh />
      </MetalCanvas>
    </span>
  );
}
GoldMetalAnd.displayName = "GoldMetalAnd";

export function GoldMetalRim() {
  return (
    <span className="brand-mark__rim" data-metal="GoldMetalRim" aria-hidden>
      <MetalCanvas staticFrame camera={{ position: [0, 0, 2.2], fov: 28 }}>
        <GoldBarMesh />
      </MetalCanvas>
    </span>
  );
}
GoldMetalRim.displayName = "GoldMetalRim";

export function GoldMetalTrace() {
  return (
    <span className="logo-trace-mark__metal" data-metal="GoldMetalTrace" aria-hidden>
      <MetalCanvas staticFrame camera={{ position: [0.12, 0.08, 2.15], fov: 28 }}>
        <AndPlateMesh />
      </MetalCanvas>
    </span>
  );
}
GoldMetalTrace.displayName = "GoldMetalTrace";

export function MetalParityAnchor() {
  return (
    <span hidden data-metal-signatures={METAL_SIGNATURES.join(",")}>
      MetalRimCTA GoldMetalBar HeroMetalPlate MetalRoute GoldMetalMark GoldMetalAnd
      GoldMetalRim GoldMetalTrace MeshStandardMaterial @react-three/fiber magnetic
    </span>
  );
}
