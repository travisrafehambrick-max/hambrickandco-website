/**
 * AIS / AIAS live-scroll ease: cubic-bezier(.22, 1, .36, 1)
 * Reveals 0.7–1.1s (rise 18px). Related lines stagger 80ms.
 */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleXd = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveX = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xEst = sampleX(t) - x;
      const d = sampleXd(t);
      if (Math.abs(xEst) < 1e-6 || Math.abs(d) < 1e-6) break;
      t -= xEst / d;
    }
    return t;
  };

  return (p: number) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    return sampleY(solveX(p));
  };
}

export const aisEase = cubicBezier(0.22, 1, 0.36, 1);

export const AIS_REVEAL = 0.9;
export const AIS_REVEAL_MIN = 0.7;
export const AIS_REVEAL_MAX = 1.1;
export const AIS_RISE = 18;
export const AIS_STAGGER = 0.08;
export const AIS_CROSSFADE = 4.5;
export const AIS_CENTERED_DIM = 0.22;
export const AIS_STACK_SCALE = 0.95;

export const PARALLAX = {
  far: 0.31,
  mid: 0.17,
  device: 0.2,
  fg: 0,
} as const;
