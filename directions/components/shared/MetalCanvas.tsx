"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

function MetalRig({ staticFrame = false }: { staticFrame?: boolean }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
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
    if (staticFrame) {
      gl.render(scene, camera);
      const id = requestAnimationFrame(() => gl.render(scene, camera));
      return () => {
        cancelAnimationFrame(id);
        scene.environment = null;
        env.dispose();
        pmrem.dispose();
      };
    }
    invalidate();

    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, camera, invalidate, staticFrame]);

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
  /** One MeshStandard frame. Used for the header mark and reduced-motion. */
  staticFrame?: boolean;
};

/** R3F metal plate. `frameloop="never"` when offscreen — no demand ticks. */
export function HeroMetalPlate({ children, camera, staticFrame = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (staticFrame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOn(entry.isIntersecting && entry.intersectionRatio > 0),
      { root: null, rootMargin: "0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [staticFrame]);

  const freeze = staticFrame;

  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        frameloop={freeze ? "never" : on ? "demand" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: camera?.position ?? [0, 0.1, 3.4], fov: camera?.fov ?? 32 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <MetalRig staticFrame={freeze} />
        {children}
      </Canvas>
    </div>
  );
}

export function MetalCanvas(props: Props) {
  return <HeroMetalPlate {...props} />;
}
