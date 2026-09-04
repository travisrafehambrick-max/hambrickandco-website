"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MetalCanvas } from "@/components/shared/MetalCanvas";
import { applyMetal } from "@/lib/metal";

function Pebble({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!mesh.current) return;
    mesh.current.rotation.y = progress * 0.85;
    mesh.current.rotation.x = 0.18 + progress * 0.12;
    applyMetal(mesh.current.material as THREE.MeshStandardMaterial, progress > 0.35);
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh ref={mesh} scale={[1.15, 0.82, 1]}>
      <sphereGeometry args={[1, 64, 48]} />
      <meshStandardMaterial color="#2a2a2a" roughness={0.74} metalness={0.38} />
    </mesh>
  );
}

export function SoftObject({ progress }: { progress: number }) {
  return (
    <MetalCanvas camera={{ position: [0, 0.15, 3.8], fov: 28 }}>
      <Pebble progress={progress} />
    </MetalCanvas>
  );
}
