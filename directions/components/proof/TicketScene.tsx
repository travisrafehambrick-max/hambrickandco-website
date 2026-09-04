"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MetalCanvas } from "@/components/shared/MetalCanvas";
import { applyMetal } from "@/lib/metal";

function Tickets({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const local = THREE.MathUtils.clamp((progress - i * 0.22) / 0.28, 0, 1);
      mesh.rotation.y = THREE.MathUtils.lerp(Math.PI, 0, local);
      applyMetal(mesh.material as THREE.MeshStandardMaterial, local > 0.55);
    });
    invalidate();
  }, [progress, invalidate]);

  return (
    <group ref={group}>
      {[-1.15, 0, 1.15].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.92, 1.18, 0.06]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.74} metalness={0.38} />
        </mesh>
      ))}
    </group>
  );
}

function Ribbon({ progress }: { progress: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!mesh.current || !mat.current) return;
    const pts: THREE.Vector3[] = [];
    const n = Math.max(3, Math.round(4 + progress * 40));
    for (let i = 0; i <= n; i++) {
      const t = i / 44;
      pts.push(new THREE.Vector3(-2.6 + t * 5.2, 0.35 * Math.sin(t * Math.PI * 1.2), 0.12 * Math.cos(t * 6)));
    }
    const next = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 72, 0.022, 14, false);
    const prev = mesh.current.geometry;
    mesh.current.geometry = next;
    prev.dispose();
    applyMetal(mat.current, progress > 0.12);
    invalidate();
  }, [progress, invalidate]);

  return (
    <mesh ref={mesh} position={[0, -1.15, 0]}>
      <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(-2.6, 0, 0), new THREE.Vector3(2.6, 0, 0)]), 8, 0.022, 8, false]} />
      <meshStandardMaterial ref={mat} color="#2a2a2a" roughness={0.74} metalness={0.38} />
    </mesh>
  );
}

export function TicketScene({ progress }: { progress: number }) {
  return (
    <MetalCanvas camera={{ position: [0, 0.15, 3.4], fov: 32 }}>
      <Tickets progress={progress} />
      <Ribbon progress={progress} />
    </MetalCanvas>
  );
}

export function ProofRibbon({ progress }: { progress: number }) {
  return (
    <MetalCanvas camera={{ position: [0, 0, 3.1], fov: 28 }}>
      <Ribbon progress={Math.max(0.08, progress)} />
    </MetalCanvas>
  );
}
