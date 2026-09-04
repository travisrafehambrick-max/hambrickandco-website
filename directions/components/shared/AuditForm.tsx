"use client";

import { FormEvent, useState } from "react";
import { auditMailto, CTA_AUDIT, EMAIL, PHONE, PHONE_HREF } from "@/lib/facts";

export function AuditForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("");
  const [note, setNote] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = auditMailto(name, trade, note);
  };

  const field =
    tone === "dark"
      ? "bg-transparent border-b border-matte/25 text-matte placeholder:text-matte/35"
      : "bg-transparent border-b border-ink/20 text-ink placeholder:text-ink/35";
  const label = tone === "dark" ? "text-matte/55" : "text-ink/50";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 max-w-md" noValidate>
      <p className={`font-mono text-[10px] uppercase tracking-[0.22em] ${label}`}>
        Opens your mail app. Nothing is sent from this page.
      </p>
      <label className="grid gap-2">
        <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${label}`}>Name</span>
        <input
          className={`${field} py-2 font-sans text-[15px] focus-visible:outline-none focus-visible:border-gold`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </label>
      <label className="grid gap-2">
        <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${label}`}>
          Kind of work
        </span>
        <input
          className={`${field} py-2 font-sans text-[15px] focus-visible:outline-none focus-visible:border-gold`}
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          placeholder="Roofing, shop, studio…"
        />
      </label>
      <label className="grid gap-2">
        <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${label}`}>
          Where leads go quiet
        </span>
        <textarea
          className={`${field} py-2 font-sans text-[15px] min-h-[88px] resize-y focus-visible:outline-none focus-visible:border-gold`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="justify-self-start bg-gold text-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        {CTA_AUDIT}
      </button>
      <p className={`font-mono text-[11px] tracking-wide ${label}`}>
        <a className="underline decoration-gold/70 underline-offset-4" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        {" · "}
        <a className="underline decoration-gold/70 underline-offset-4" href={PHONE_HREF}>
          {PHONE}
        </a>
      </p>
    </form>
  );
}
