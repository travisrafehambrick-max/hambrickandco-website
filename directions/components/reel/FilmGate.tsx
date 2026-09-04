"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Gate({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const frame = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!frame.current) return;
    const mat = frame.current.material as THREE.MeshStandardMaterial;
    const live = progress > 0.28;
    mat.color.set(live ? "#C4A574" : "#1a1a1a");
    mat.metalness = live ? 0.7 : 0.05;
    mat.roughness = live ? 0.25 : 0.9;
    frame.current.rotation.z = THREE.MathUtils.lerp(0.08, 0, progress);
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh ref={frame} rotation={[0, 0, Math.PI / 4]}>
      <ringGeometry args={[1.05, 1.32, 4]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

export function FilmGate({ progress }: { progress: number }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.6], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[1.5, 2, 3]} intensity={1.2} color="#F5F5F5" />
      <Gate progress={progress} />
    </Canvas>
  );
}
