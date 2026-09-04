import { aisEase, gsap } from "@/lib/register-gsap";

const MAX_PULL = 20;

/** Magnetic pull ≤20px, then spring settle. GSAP only. */
export function bindMagnetic(el: HTMLElement, max = MAX_PULL) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return () => {};

  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const reach = Math.max(r.width, r.height) * 0.9 + 36;
    if (dist > reach) {
      gsap.to(el, { x: 0, y: 0, duration: 0.42, ease: aisEase, overwrite: "auto" });
      return;
    }
    const t = 1 - dist / reach;
    const pull = Math.min(max, t * max);
    gsap.to(el, {
      x: (dx / dist) * pull,
      y: (dy / dist) * pull,
      duration: 0.18,
      ease: aisEase,
      overwrite: "auto",
    });
  };

  const settle = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.48, ease: aisEase, overwrite: "auto" });
  };

  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", settle);
  el.addEventListener("blur", settle);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", settle);
    el.removeEventListener("blur", settle);
  };
}
