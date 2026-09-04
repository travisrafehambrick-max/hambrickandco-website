"use client";

const FRAMES = [
  { src: "/hero/missed-call.png", crop: "50% 42%" },
  { src: "/hero/estimate.png", crop: "32% 68%" },
  { src: "/hero/recovery.png", crop: "18% 42%" },
  { src: "/hero/booked.png", crop: "52% 28%" },
] as const;

export function HeroStory({ step }: { step: number }) {
  const shown = Math.min(Math.max(step, 0), FRAMES.length - 1);

  return (
    <div className="hero-story" aria-hidden>
      {FRAMES.map((frame, i) => (
        <img
          key={frame.src}
          src={frame.src}
          alt=""
          className={`hero-story__frame${i === shown ? " is-on" : ""}`}
          style={{ objectPosition: frame.crop }}
        />
      ))}
    </div>
  );
}
