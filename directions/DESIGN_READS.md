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
4. Sticky chrome + one pinned chapter (~1 viewport) then release.
5. Gold only on living signal.
6. No idle wobble.
7. `prefers-reduced-motion` → recovered end-state (readable, static).

Doctrine: one current (LEFT → forward). Ledger seams before authoring.
Cut mid-motion. Stillness-before-climax 0.3–0.75s on the recovered beat.

## Winslow steal-list (live scroll → structure)

1. **Society Hall / AIS** — sticky chrome; product stage *is* the recovery board; gold only on the active lane and live signal.
2. **Solid Proof / Solidroad** — gold signal line scrubs missed→recovered across sticky chrome; tickets still the carrier.
3. **Signature Reel / Austin Werner** — one metallic orb as the sole 3D; rotation hands off mid-motion. Chapter still stays the DOM carrier.
4. **Balance Object / Ballance** — restraint; the slip is UI that behaves (GSAP only — no Framer Motion).
5. **Assist Pane / SiteAssist** — sticky diagnostic band; the verb flip *is* the revival. Phone peel stays the carrier.

---

### 01 Society Hall — gold signal line

Kinetic manifesto / membership energy. A dark hall of theses, not a SaaS landing.
The carrier is a gold filament that draws left→forward through ledger seams.
First screen: dead hairline under “The lead went quiet.” already igniting toward
“Recovered.” Structure: hall → thesis roll → pledge. R3F is the filament volume.

### 02 Solid Proof — board tickets dead→alive

Product-proof strip. A working board, not a manifesto. Carrier: tickets that
turn from matte-dead to gold-live as the strip scrubs. First screen: a dead
ticket and a live ticket already on stage. Structure: pair → pinned board →
asymmetric proof notes. R3F is shallow ticket planes.

### 03 Signature Reel — chapter still mid-pin

Editorial asymmetric portfolio. Magazine spread, huge serif, uneven columns.
Carrier: one chapter still that stays pinned mid-viewport while copy slides.
First screen: missed still vs recovered still as a spread. R3F is a film gate.

### 04 Balance Object — quote slip

Airy calm. Almost empty matte white. One soft R3F object (pebble/lens, not a
chrome planet). Carrier: a paper quote slip that travels left→forward.
First screen: the slip already showing missed quote / recovered estimate.

### 05 Assist Pane — phone sheet peel

Split assist / console recovery thread. Left is the human thread, right is the
machine console. Carrier: a phone notification sheet that peels missed→recovered.
First screen: peel already mid-story. R3F is the peeling sheet.

---

Impeccable pass (after each build): hierarchy, type, spacing, motion purpose, a11y.
Fix before calling the direction done.
