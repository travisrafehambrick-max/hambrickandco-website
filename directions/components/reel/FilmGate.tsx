"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MetalCanvas } from "@/components/shared/MetalCanvas";
import { applyMetal } from "@/lib/metal";

/** Sole 3D object. MeshStandard + env. Rotation stays mid-handoff. */
function Orb({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!mesh.current) return;
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    applyMetal(mat, progress > 0.28);
    const live = THREE.MathUtils.clamp(progress, 0, 1);
    mesh.current.rotation.y = live * 2.15;
    mesh.current.rotation.x = 0.22 + live * 0.35;
    const s = 0.86 + live * 0.14;
    mesh.current.scale.setScalar(s);
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh ref={mesh} scale={[0.92, 0.92, 0.92]}>
      <sphereGeometry args={[1, 64, 48]} />
      <meshStandardMaterial color="#2a2a2a" roughness={0.74} metalness={0.38} envMapIntensity={0.3} />
    </mesh>
  );
}

export function FilmGate({ progress }: { progress: number }) {
  return (
    <MetalCanvas camera={{ position: [0, 0.1, 3.8], fov: 28 }}>
      <Orb progress={progress} />
    </MetalCanvas>
  );
}
