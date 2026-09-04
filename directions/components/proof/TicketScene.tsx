"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Tickets({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const local = THREE.MathUtils.clamp((progress - i * 0.22) / 0.28, 0, 1);
      mesh.rotation.y = THREE.MathUtils.lerp(Math.PI, 0, local);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const live = local > 0.55;
      mat.color.set(live ? "#C4A574" : "#2a2a2a");
      mat.roughness = live ? 0.32 : 0.88;
      mat.metalness = live ? 0.55 : 0.04;
    });
    invalidate();
  }, [progress, invalidate]);

  return (
    <group ref={group}>
      {[-1.15, 0, 1.15].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.92, 1.18, 0.04]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.88} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

export function TicketScene({ progress }: { progress: number }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.15, 3.4], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 2, 4]} intensity={1.1} color="#F5F5F5" />
      <Tickets progress={progress} />
    </Canvas>
  );
}
