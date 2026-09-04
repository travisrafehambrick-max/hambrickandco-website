"use client";

import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MetalCanvas } from "@/components/shared/MetalCanvas";
import { applyMetal } from "@/lib/metal";

function Filament({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  const liveGeom = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const n = Math.max(2, Math.round(2 + progress * 46));
    for (let i = 0; i <= n; i++) {
      const t = i / 48;
      pts.push(new THREE.Vector3(-2.4 + t * 4.8, 0.22 * Math.sin(t * Math.PI) * (1 - t * 0.25), 0));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.028, 16, false);
  }, [progress]);

  useEffect(() => {
    return () => liveGeom.dispose();
  }, [liveGeom]);

  useEffect(() => {
    if (mat.current) applyMetal(mat.current, progress > 0.18);
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh geometry={liveGeom}>
      <meshStandardMaterial ref={mat} color="#2a2a2a" roughness={0.74} metalness={0.38} envMapIntensity={0.28} />
    </mesh>
  );
}

export function GoldFilament({ progress }: { progress: number }) {
  return (
    <MetalCanvas camera={{ position: [0, 0, 3.2], fov: 35 }}>
      <Filament progress={Math.max(0.02, Math.min(1, progress))} />
    </MetalCanvas>
  );
}
