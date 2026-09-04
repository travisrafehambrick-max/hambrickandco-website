"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

function MetalRig() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.12;
    gl.outputColorSpace = THREE.SRGBColorSpace;

    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    room.dispose();
    invalidate();

    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, invalidate]);

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[2.6, 2.2, 3.2]} intensity={1.35} color="#F5F5F5" />
      <directionalLight position={[-2.4, 0.4, 1.6]} intensity={0.55} color="#E8D5B0" />
      <spotLight position={[0.2, 3.4, 1.2]} intensity={0.7} angle={0.55} penumbra={0.7} color="#FFFFFF" />
    </>
  );
}

type Props = {
  children: ReactNode;
  camera?: { position?: [number, number, number]; fov?: number };
};

export function MetalCanvas({ children, camera }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOn(entry.isIntersecting),
      { root: null, rootMargin: "10% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="h-full w-full">
      {on ? (
        <Canvas
          frameloop="demand"
          dpr={[1, 1.75]}
          camera={{ position: camera?.position ?? [0, 0.1, 3.4], fov: camera?.fov ?? 32 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <MetalRig />
          {children}
        </Canvas>
      ) : null}
    </div>
  );
}
