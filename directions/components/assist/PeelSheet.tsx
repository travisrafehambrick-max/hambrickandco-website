"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MetalCanvas } from "@/components/shared/MetalCanvas";
import { applyMetal } from "@/lib/metal";

function Sheet({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!mesh.current) return;
    const peel = THREE.MathUtils.clamp(progress, 0, 1);
    mesh.current.rotation.x = THREE.MathUtils.lerp(-1.15, -0.08, peel);
    mesh.current.position.y = THREE.MathUtils.lerp(0.35, 0, peel);
    applyMetal(mesh.current.material as THREE.MeshStandardMaterial, peel > 0.4);
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[1.7, 2.3, 1, 1]} />
      <meshStandardMaterial
        color="#2a2a2a"
        roughness={0.74}
        metalness={0.38}
        envMapIntensity={0.28}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function PeelSheet({ progress }: { progress: number }) {
  return (
    <MetalCanvas camera={{ position: [0, 0.1, 3.6], fov: 32 }}>
      <Sheet progress={progress} />
    </MetalCanvas>
  );
}
