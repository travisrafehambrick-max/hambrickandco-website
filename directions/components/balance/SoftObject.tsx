"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Pebble({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!mesh.current) return;
    mesh.current.rotation.y = progress * 0.85;
    mesh.current.rotation.x = 0.18 + progress * 0.12;
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    const live = progress > 0.35;
    mat.color.set(live ? "#C4A574" : "#1c1c1c");
    mat.roughness = live ? 0.55 : 0.92;
    mat.metalness = live ? 0.22 : 0.02;
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh ref={mesh} scale={[1.15, 0.82, 1]}>
      <sphereGeometry args={[1, 48, 32]} />
      <meshStandardMaterial color="#1c1c1c" roughness={0.92} metalness={0.02} />
    </mesh>
  );
}

export function SoftObject({ progress }: { progress: number }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.15, 3.8], fov: 28 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.4, 2.8, 2]} intensity={0.95} color="#F5F5F5" />
      <directionalLight position={[-2, -1, 1.5]} intensity={0.25} color="#C4A574" />
      <Pebble progress={progress} />
    </Canvas>
  );
}
