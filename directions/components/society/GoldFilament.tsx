"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.014, 8, false);
  }, [progress]);

  useEffect(() => {
    return () => liveGeom.dispose();
  }, [liveGeom]);

  useEffect(() => {
    if (mat.current) {
      const live = progress > 0.18;
      mat.current.color.set(live ? "#C4A574" : "#F5F5F5");
      mat.current.metalness = live ? 0.72 : 0.08;
      mat.current.roughness = live ? 0.28 : 0.82;
      mat.current.emissive.set(live ? "#C4A574" : "#000000");
      mat.current.emissiveIntensity = live ? 0.18 : 0;
    }
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh geometry={liveGeom}>
      <meshStandardMaterial ref={mat} color="#F5F5F5" roughness={0.82} metalness={0.08} />
    </mesh>
  );
}

export function GoldFilament({ progress }: { progress: number }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.2], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.2, 1.4, 3]} intensity={1.15} color="#F5F5F5" />
      <directionalLight position={[-2, -1, 2]} intensity={0.35} color="#C4A574" />
      <Filament progress={Math.max(0.02, Math.min(1, progress))} />
    </Canvas>
  );
}
