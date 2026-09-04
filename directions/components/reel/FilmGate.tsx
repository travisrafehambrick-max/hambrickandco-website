"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Sole 3D object. Rotation is cumulative — chapter handoff stays mid-motion. */
function Orb({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!mesh.current) return;
    const live = progress > 0.28;
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    mat.color.set(live ? "#C4A574" : "#1a1a1a");
    mat.metalness = live ? 0.78 : 0.12;
    mat.roughness = live ? 0.22 : 0.86;
    mesh.current.rotation.y = progress * 2.15;
    mesh.current.rotation.x = 0.22 + progress * 0.35;
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh ref={mesh} scale={[0.92, 0.92, 0.92]}>
      <sphereGeometry args={[1, 48, 36]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.86} metalness={0.12} />
    </mesh>
  );
}

export function FilmGate({ progress }: { progress: number }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.1, 3.8], fov: 28 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.32} />
      <directionalLight position={[2, 2.2, 3]} intensity={1.15} color="#F5F5F5" />
      <directionalLight position={[-1.6, -0.8, 1.4]} intensity={0.28} color="#C4A574" />
      <Orb progress={progress} />
    </Canvas>
  );
}
