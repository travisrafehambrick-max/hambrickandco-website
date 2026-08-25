"use client";

import { useEffect, useRef } from "react";
import styles from "./OrbitField.module.css";

type Node = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  z: number;
  pulse: number;
};

type Pulse = {
  from: number;
  progress: number;
  speed: number;
};

const NODE_COUNT = 22;
const CONNECT_DIST = 0.42;

export default function OrbitField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    let reduceMotion = reduceMotionQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const radius = 0.18 + (i / NODE_COUNT) * 0.78 + Math.random() * 0.05;
      return {
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: (0.06 + Math.random() * 0.1) * (i % 2 === 0 ? 1 : -1),
        size: 1.4 + Math.random() * 2.2,
        z: Math.random(),
        pulse: Math.random() * Math.PI * 2,
      };
    });

    const pulses: Pulse[] = [];

    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    function resize() {
      if (!canvas || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function handlePointerMove(e: PointerEvent) {
      if (isTouch) return;
      const rect = wrap!.getBoundingClientRect();
      pointerX = (e.clientX - rect.left) / rect.width;
      pointerY = (e.clientY - rect.top) / rect.height;
      targetTiltX = (pointerX - 0.5) * 2;
      targetTiltY = (pointerY - 0.5) * 2;
    }

    function handlePointerLeave() {
      targetTiltX = 0;
      targetTiltY = 0;
    }

    let raf = 0;
    let t = 0;

    function drawStatic() {
      if (!ctx) return;
      const cx = width / 2;
      const cy = height / 2;
      const minDim = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);

      const positions = nodes.map((n) => ({
        x: cx + Math.cos(n.angle) * n.radius * minDim * 0.5,
        y: cy + Math.sin(n.angle) * n.radius * minDim * 0.5,
        n,
      }));

      ctx.strokeStyle = "rgba(198, 165, 109, 0.16)";
      ctx.lineWidth = 1;
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i];
          const b = positions[j];
          const dx = (a.x - b.x) / minDim;
          const dy = (a.y - b.y) / minDim;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = "rgba(237, 233, 226, 0.9)";
      positions.forEach(({ x, y, n }) => {
        ctx.beginPath();
        ctx.arc(x, y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(198, 165, 109, 0.85)";
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(cx, cy, minDim * 0.045, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(237, 233, 226, 0.95)";
      ctx.fill();
    }

    function drawFrame() {
      if (!ctx) return;
      t += 1;
      tiltX += (targetTiltX - tiltX) * 0.04;
      tiltY += (targetTiltY - tiltY) * 0.04;

      const cx = width / 2 + tiltX * 18;
      const cy = height / 2 + tiltY * 12;
      const minDim = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);

      const positions = nodes.map((n) => {
        n.angle += n.speed * 0.006;
        n.pulse += 0.02;
        const wobble = Math.sin(n.pulse) * 0.01;
        const r = (n.radius + wobble) * minDim * 0.5;
        return {
          x: cx + Math.cos(n.angle) * r,
          y: cy + Math.sin(n.angle) * r * 0.82,
          n,
        };
      });

      ctx.lineWidth = 1;
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i];
          const b = positions[j];
          const dx = (a.x - b.x) / minDim;
          const dy = (a.y - b.y) / minDim;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.22;
            ctx.strokeStyle = `rgba(198, 165, 109, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (!isTouch && Math.random() < 0.02 && pulses.length < 4) {
        pulses.push({
          from: Math.floor(Math.random() * positions.length),
          progress: 0,
          speed: 0.012 + Math.random() * 0.01,
        });
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const from = positions[p.from];
        const cx2 = width / 2;
        const cy2 = height / 2;
        const x = from.x + (cx2 - from.x) * p.progress;
        const y = from.y + (cy2 - from.y) * p.progress;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237, 214, 165, ${0.9 * (1 - p.progress)})`;
        ctx.fill();
      }

      positions.forEach(({ x, y, n }) => {
        const dx = x / width - pointerX;
        const dy = y / height - pointerY;
        const distToPointer = isTouch ? 1 : Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - distToPointer * 3.2);
        const glow = 0.55 + proximity * 0.45 + Math.sin(n.pulse) * 0.08;

        ctx.beginPath();
        ctx.arc(x, y, n.size + proximity * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198, 165, 109, ${Math.min(glow, 1)})`;
        ctx.fill();

        if (proximity > 0.15) {
          ctx.beginPath();
          ctx.arc(x, y, n.size + 5 + proximity * 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(198, 165, 109, ${proximity * 0.12})`;
          ctx.fill();
        }
      });

      const corePulse = 1 + Math.sin(t * 0.02) * 0.06;
      const coreRadius = minDim * 0.045 * corePulse;

      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        coreRadius * 4
      );
      gradient.addColorStop(0, "rgba(237, 233, 226, 0.35)");
      gradient.addColorStop(1, "rgba(237, 233, 226, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(237, 233, 226, 0.95)";
      ctx.fill();

      raf = requestAnimationFrame(drawFrame);
    }

    const smallScreenQuery = window.matchMedia("(max-width: 640px)");
    const shouldAnimate = () =>
      !reduceMotion && !(isTouch && smallScreenQuery.matches);

    resize();

    if (shouldAnimate()) {
      raf = requestAnimationFrame(drawFrame);
      wrap.addEventListener("pointermove", handlePointerMove);
      wrap.addEventListener("pointerleave", handlePointerLeave);
    } else {
      drawStatic();
    }

    const handleResize = () => {
      resize();
      if (!shouldAnimate()) drawStatic();
    };
    window.addEventListener("resize", handleResize);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      if (!shouldAnimate()) {
        cancelAnimationFrame(raf);
        wrap.removeEventListener("pointermove", handlePointerMove);
        wrap.removeEventListener("pointerleave", handlePointerLeave);
        drawStatic();
      } else {
        raf = requestAnimationFrame(drawFrame);
        wrap.addEventListener("pointermove", handlePointerMove);
        wrap.addEventListener("pointerleave", handlePointerLeave);
      }
    };
    reduceMotionQuery.addEventListener("change", handleMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      wrap.removeEventListener("pointermove", handlePointerMove);
      wrap.removeEventListener("pointerleave", handlePointerLeave);
      reduceMotionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
