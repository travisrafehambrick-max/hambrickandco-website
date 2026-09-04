# Design reads — five draft directions

**Travis skill lock:** `design-taste-frontend` **V2 only** (`design-taste-frontend/SKILL.md`).
Do **not** use `design-taste-frontend-v1` or `taste-skill-v1`.
Craft gate on every route: taste V2 + impeccable (hierarchy, type, spacing, motion purpose, a11y).

Taste V2 + Winslow motion laws. Written **before** UI authoring.
Inspo studied for pattern, not clone: AIS hall energy, Solidroad product strip,
Austin Werner editorial stills, Ballance airy object, SiteAssist split pane.

Palette only: metallic gold `#C4A574` · matte white `#F5F5F5` · matte black `#121212`.
Gold is a living signal, never a wash. Dead states stay matte.

Banned: Inter-only, three equal feature cards, purple AI mesh, glassmorphism soup,
idle wobble, bounce/elastic/breathe loops, Framer Motion, fake customers, prices,
partner-pitch language, Crozet-centering, Higgsfield spend.

## Cross-site laws (every route)

1. First screenful already performs the missed→recovered beat.
2. One carrier across seams — no crossfades.
3. Scroll scrubs a story; sections do not fade in one by one.
   Assist is the exception: one pinned media carrier, discrete landmark swaps, no continuous scrub.
4. Sticky chrome + one pinned chapter (~1 viewport) then release.
5. Gold only on living signal.
6. No idle wobble.
7. `prefers-reduced-motion` → recovered end-state (readable, static).

Doctrine: one current (LEFT → forward). Ledger seams before authoring.
Cut mid-motion. Stillness-before-climax 0.3–0.75s on the recovered beat.

## Winslow steal-list (live scroll → structure)

All five live inspo briefs are **closed**. Each direction keeps its own carrier.

1. **Society Hall / AIS** — sticky chrome; product stage *is* the recovery board; gold only on the active lane and live signal.
2. **Solid Proof / Solidroad** — ONE gold route/line as missed→callback→recovered. Sticky header inverts dark↔white by chapter. Gold only on progress/route/CTA; dead tickets matte. Full-screen ribbon carrier; slow crossfade on the beat label. Proof board breathes (opacity/blur, no ambient loop). Heavy ease-in-out (`power2.inOut`); left copy stable. No bounce. No invented counts.
3. **Signature Reel / Austin Werner** — one gold orb through missed→recovered (statue→orb handoff mapped to our still + orb). Pin one full-viewport stage per chapter; scrub depth/scale/blur. Black holds between chapters; white type stays stable. Nav hide on scroll-down / show on scroll-up. Controls 0.3–0.7s ease-out. Gold markers before headings. Calm contact hover only. No invented counters.
4. **Balance Object / Ballance** — first screen composed (no autoplay). One hero pebble with slower parallax than the copy. Hard black→white seam at the turning point. One tactile slip control; high stillness. No KPI count-ups. GSAP / ScrollTrigger / R3F only — no Framer Motion. Reduced-motion = recovered still.
5. **Assist Pane / SiteAssist** — header morphs black→white (gold only on active step + CTA). Pin one peel for missed→alert→callback→recovered. Module list left / media right; media swaps on scroll landmarks. Oversized type reveal; staggered job-type cards; discrete carousel OK. No heavy parallax. Clear black/white seams. Weighted ease-out (`aisEase`).

## AIS hard numbers (progress / signal line carriers)

Where a line is the attention carrier (Society Hall rail, Solid Proof playhead, hub rail):

- Ease: `cubic-bezier(.22, 1, .36, 1)` (`aisEase`)
- Reveals 0.7–1.1s (default 0.9s), rise 18px
- Top progress line is the attention carrier — metallic gold, never cyan
- Reveal = blur→sharp + rise + opacity; related lines stagger 80ms
- The rail leads the intro, then scrubs left→full across the pin
- `prefers-reduced-motion` strips transitions, parallax, opacity, and transforms
- Hover = slight lift / brighten only — no bounce

## Motion raise (craft host)

Living gold is metal, never a flat `#C4A574` fill. One system per viewport:
R3F `MeshStandardMaterial` + `RoomEnvironment` PMREM + rim lights, or a metal
gradient/rim on DOM carriers. Magnetic CTAs pull ≤20px (GSAP). Reduced-motion
freezes a static metal frame at the recovered end-state. No Framer Motion.
No Higgsfield.

## AIAS live pass (final additions)

- Weighted Lenis-style scroll, same AIS ease
- Page-position bar + glowing gold dot (cyan on AIS → gold here)
- Parallax: far ~.31, mid ~.17, device ~.20, foreground fixed
- Intro copy brightens when centered, dims to ~22% off-center
- Four outcome cards sticky-stack on Society Hall: incoming climbs; prior scale ~.95 + darken
- Recurring call phone auto-crossfades 4.5s — never scroll-scrubbed
- CTA lift 1px + soft gold glow
- Reduced-motion: transitions / parallax off; reveals immediate; gradients freeze
- Steal: one phone/call carrier; centered-beat; stacked outcomes; black seams; gold only on progress / active / recovered

---

### 01 Society Hall — gold signal line

Kinetic manifesto / membership energy. AIS live-scroll, closed on this hall:
sticky chrome; the product stage *is* the recovery board; gold on the active
lane, the rail, and Recovered. Carrier is a gold filament (not Solid Proof’s
straight route). First screen: dead type under “The lead went quiet.” already
igniting toward “Recovered.” Structure: hall → thesis roll → stacked outcomes
→ pledge. R3F is the filament volume. Call phone auto-crossfades — never
scroll-scrubbed. `prefers-reduced-motion` → recovered rail, last thesis.

### 02 Solid Proof — gold route

Product-proof strip. Solidroad live-scroll, closed — steal the route, not a
second gold object:

- ONE gold route: the header playhead and one R3F ribbon share the same
  `progress` (missed → callback → recovered). No hero ribbon. No 3D ticket
  stack on this route.
- Sticky header inverts dark↔white by chapter (`power2.inOut`, 0.75s).
- Gold only on the route, live ticket marks, and the CTA. Dead states stay matte.
  No Proof kicker.
- Full-screen ribbon in the pin. Beat label slow-fades. Left copy is stable
  (no opacity/y scrub on the heading).
- Proof board breathes once on enter (blur→sharp, stagger 80ms). No ambient loop.
- Heavy ease-in-out. No bounce. No `bindAiasLive`.
- First screen composed: dead ticket + live ticket already on stage; playhead
  already at `0.22`.
- `prefers-reduced-motion` → recovered, playhead full, header dark.

Carrier: the gold route. R3F is that ribbon, pin only.

### 03 Signature Reel — chapter still mid-pin

Editorial asymmetric portfolio. Austin Werner live-scroll, closed — steal the
stage, never the `100+` counters:

- One gold carrier through missed→recovered. The DOM still is the “statue”; the
  R3F orb takes living gold and keeps rotating across chapter cuts (handoff
  mid-motion). One `GateSlot` only — no second 3D object.
- Pin one full-viewport stage per chapter (`end: +=100%`). Scrub the still:
  depth / scale / blur. White type does not fade or wobble.
- Black holds between chapters for the miss (dead hairline, no gold).
- Nav hides on scroll-down, shows on scroll-up (`0.45s`, `aisEase`).
- Controls 0.3–0.7s ease-out. No spring. No count-ups.
- Gold chapter markers (metal-rule + index) sit before headings.
- Colophon is calm: `reel-calm` 1px hover only — no magnetic pull.
- First screen is composed: missed still + recovered still + orb already mid-story.
  No load autoplay. No `bindAiasLive`.
- `prefers-reduced-motion` → last chapter, progress `1`, stills sharp, header shown.

Carrier: the chapter still. R3F is the orb, one instance through the track.

### 04 Balance Object — quote slip

Airy calm. Ballance live-scroll, closed — steal the stillness, never the counters:

- First screen is composed on paint. No load timeline, no autoplay flip, no idle spin.
- One hero carrier: the R3F pebble. It parallax-lags the copy (`scrub: 1.2`, ~28px vs ~86px). No `bindAiasLive`. No second 3D object after the seam.
- Hard `#121212` → `#F5F5F5` seam at the turning point (`border-t border-black`). Header morphs with that seam. Gold only on recovered type, the turn control, and the CTA.
- One tactile control (“Turn the slip”). After a turn, stillness (`STILLNESS`) — do not chain more motion.
- No KPI count-ups, no invented %, hours, or 10x. Truth only: area, email, phone, the missed/recovered sentences.
- GSAP / ScrollTrigger / R3F only. No Framer Motion.
- `prefers-reduced-motion` → recovered still, progress `1`, parallax off.

Carrier: the quote slip on the table. R3F is the pebble, hero only.

### 05 Assist Pane — phone sheet peel

Split assist / console recovery thread. SiteAssist live-scroll, closed:

- Sticky header morphs `#121212` → `#F5F5F5` on the white pin, back to black at `#request`. Gold only on the living step, the recovered word, and the CTA. No Assist kicker.
- One media carrier, pinned. Four landmarks (Missed / Alert / Callback / Recovered) tween the peel to `0.14 / 0.38 / 0.7 / 1`. Not a continuous scrub.
- Module list left / sticky media right. On a narrow viewport the same carrier pins above the list.
- Hero is oversized type (“Missed thread.” / metal “Recovered.”) plus a DOM lock-screen sheet already mid-story. No second 3D peel in the hero.
- Evidence is a discrete job-type carousel (shape of the work, not a case study), staggered in.
- No `bindAiasLive` / no `data-depth` on this route.
- Seams are hard black/white. Ease is `cubic-bezier(.22,1,.36,1)`.

Carrier: one phone notification sheet. R3F is that sheet, only in the pin.

---

Impeccable pass (after each build): hierarchy, type, spacing, motion purpose, a11y.
Fix before calling the direction done.
