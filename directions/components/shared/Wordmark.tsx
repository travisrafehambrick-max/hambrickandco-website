import Link from "next/link";

type Tone = "dark" | "light";

export function Wordmark({
  tone = "dark",
  href = "/",
  kicker,
}: {
  tone?: Tone;
  href?: string;
  kicker?: string;
}) {
  const ink = tone === "dark" ? "text-matte" : "text-ink";
  return (
    <Link href={href} className={`group inline-flex items-baseline gap-3 ${ink}`}>
      <span className="font-display text-[1.15rem] leading-none tracking-tight">
        Hambrick <em className="text-gold font-display italic">{"&"}</em> Co.
      </span>
      {kicker ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold/80">
          {kicker}
        </span>
      ) : null}
    </Link>
  );
}
