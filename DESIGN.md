# Design

Status: **Assist Pane picked (draft, not live).** Travis chose Assist Pane as the hambrickco.com direction. It is not finished. Purpose = get a client; marketing is primary.

The conversion homepage is `directions/` — served at `/` and `/assist-pane`. Harcourt copy is locked on that page. Society Hall, Solid Proof, Signature Reel, and Balance Object are parked (no churn). Do not publish over production hambrickco.com / Netlify prod. No Higgsfield.

Static root (`index.html`) remains the live bones until Travis asks to publish.

---

Status (static bones, still approved, not the active draft): dark-cinematic second pass.

Live site today: [hambrickco.com](https://hambrickco.com/) may still show the old web-design pitch or the first pearl-metal draft. Keep the **bones**. Change the materials and the motion.

Client demo sites stay in `painter-site-kit`.

## Job of the page

A person who lands here should understand, in a few seconds:

1. Hambrick & Co. helps small agencies get a signed client to kickoff without a week of chasing files, access, and approvals.
2. That stretch — onboarding, done with care — is the work. Write it like a person. Do not decorate the page with SaaS verbs.
3. Websites are still available if that is the leak. Do not lead with them.
4. They can write hello@hambrickco.com or call (434) 260-0823.

They should not think this is a software product, an AI staff, or OpsPatch.

## Human, not generated

Do not throw out the current layout for a 21st.dev / shadcn card grid. That is how sites start looking AI-made.

Keep: one page; sticky header; hero + two offers + process + about + contact; a slim work sample if kept; the editorial type pairing; the `&` as the mark. Travis likes the wordmark. Do not replace it.

Change: the page ground, the materials, the hero field, and the motion. The first draft was warm pearl-paper. This pass is a cinematic dark room.

Banned tells: purple glow, aurora gradients, glassmorphism soup, Inter / Roboto / Space Grotesk / Arial-as-brand, “seamless / elevate / empower / unlock,” three icon cards that say Quality / Experience / Value, fake 3D chrome, jewelry-store gold wash, crypto chrome planet, Lottie explosions, looped hero video.

## Visual north star

Travis sent five stills. They are the look, not assets to paste in:

1. Dark futuristic interface. Monochrome. Carved panels. Rim light. Depth from light, not color.
2. Editorial void. Huge type. Tiny UI in the corners. Film grain. A face of matte black and white drip — atmosphere, not a portrait we invent.
3. Black-on-black mesh or leather. One warm bronze/steel highlight riding a curve. The rest recedes.
4. Pebbled matte slab. Recessed rounded wells with an inner rim. One glossy machined object. Diagonal motion streaks. A capsule well at the bottom.
5. Precision on a black field: hairlines, a single object, serif display type, lots of empty space.

Plus a thin four-point star / compass needle on a vast dark field. Luxury tech-noir. Do not fill the void.

## Materials

Matte black ground. Graphite slabs. Steel rim light. Quiet pearl / nacre as an *inner sheen* — a catch in a well or on the object — not the page ground. Thin antique gold only on the `&` and at most one hairline.

| Token | Hex | Use |
| --- | --- | --- |
| Void | `#070708` | Page ground, hero field |
| Graphite | `#121212` | Raised slabs, header |
| Steel | `#8A8F98` | Hairlines, captions, rim light |
| Pearl | `#F3EEE4` | Type on dark, inner sheen only |
| Gold | `#C4A574` | The `&`. One hairline if needed. Never a fill. Never a gradient wash. |

Think machined metal in a dark room: matte vs gloss, carved recesses, hairline highlights. One object. Not a coin app and not a jewelry counter.

## Type

Editorial pairing, already on the live site:

- Headlines: Instrument Serif
- Body / UI: Hanken Grotesk
- Labels: IBM Plex Mono, wide tracking

The `&` is italic Instrument Serif in antique gold. No hexagon H. Favicon is the `&`.

Kickers and corner UI stay small. Headlines can be large. Do not set fake display words (FOCUS, DISCIPLINE) over the real copy.

## Motion

Physical, short, heavy. Weight and a little inertia. GSAP is required for this pass — not CSS sprinkles.

Use it hard:

- Pin the hero on a wide viewport. Treat the first scroll as a product film, not a jump to the next band.
- SplitText (or an equivalent split) on the hero headline. Words or masked lines. Not a character scramble.
- Scrub the machined object like a turntable: rotation and light, tied to scroll.
- Draw or settle the compass star. Then let it turn a little while pinned.
- Section-to-section eases: once, staggered, short. Timelines, not a bag of `from` tweens with delays.
- Diagonal streaks may drift on the hero scrub. Keep them hair-thin.

Honor `prefers-reduced-motion`: no pin, no scroll-tied spin, no entrance motion, no SplitText. Static object, static star. No Lottie. No looped hero video.

## The object

One machined metal sphere (or a close cousin) in a recessed circular well.

It should feel turned on a lathe: dark steel, an equatorial groove, tight specular, a quiet pearl catch in the midtones. It must not read as a chrome planet, a coin, or a crypto globe.

## Page map (same bones)

1. **Nav** — Hambrick & Co. / Offers / Process / Work / About / Contact
2. **Hero** — signed-to-kickoff, not “we run the website.” Vast dark field. Compass star. Sphere in a well. Secondary: websites still offered. A small 01 / 06 rail is fine.
3. **What we do** — two carved wells. Ops sprint first. Websites second. Not a three-card grid.
4. **How it works** — talk, map the holes, hand back a checklist in their tools. Numbered rail, not icons.
5. **Work** — empty or one labeled sample. Stonefield is a demo mock if kept.
6. **About** — Travis, Charlottesville / Crozet area. Large `&` in a well, not a portrait we do not have.
7. **Contact** — hello@hambrickco.com, (434) 260-0823. Recessed fields. Capsule well for the honest action. Do not fake a send. A mailto compose is honest; a success toast is not.

## Copy rules

- Calm, direct, specific. If a line could sit on any SaaS homepage, cut it.
- No prices on the public page until Travis treats a number as a real quote.
- No OpsPatch. No guaranteed results. No invented clients, reviews, years, or revenue.

## Not in this plan

- A new company name
- A second domain
- A blog, CMS, or React app
- Stripe on the site
- Building painter demos in this repo
- Publishing to Netlify unless Travis asks
- Replacing the wordmark

## Stack

Static `index.html`, `styles.css`, `main.js`. GSAP from a CDN (core, ScrollTrigger, SplitText, DrawSVG). No framework unless Travis asks.
