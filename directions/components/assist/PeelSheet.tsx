"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Sheet({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!mesh.current) return;
    const peel = THREE.MathUtils.clamp(progress, 0, 1);
    mesh.current.rotation.x = THREE.MathUtils.lerp(-1.15, -0.08, peel);
    mesh.current.position.y = THREE.MathUtils.lerp(0.35, 0, peel);
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    const live = peel > 0.4;
    mat.color.set(live ? "#C4A574" : "#F5F5F5");
    mat.roughness = live ? 0.4 : 0.78;
    mat.metalness = live ? 0.35 : 0.02;
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[1.7, 2.3, 1, 1]} />
      <meshStandardMaterial color="#F5F5F5" roughness={0.78} metalness={0.02} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function PeelSheet({ progress }: { progress: number }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.1, 3.6], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[1.6, 2.4, 3]} intensity={1.05} color="#F5F5F5" />
      <Sheet progress={progress} />
    </Canvas>
  );
}
