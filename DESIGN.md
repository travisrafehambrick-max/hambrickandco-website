# Design

Status: **approved to build.** Draft 3 offer on the live editorial theme. This file is the live direction.

Live site today: [hambrickco.com](https://hambrickco.com/) already uses the paper-and-ink system, the missed-call headline, and the before/after enquiry story. Keep that **visual language**. Change the offer copy, strip every dollar amount, and raise the craft (WebGL, GSAP, reactive UI). Do not invent a new brand.

Client demo sites stay in `painter-site-kit`.

## Job of the page

A person who lands here should understand, in a few seconds:

1. Missed calls and unanswered estimates cost local trades booked work they already won.
2. Hambrick & Co. does one thing: Lead Response and Estimate Recovery for home services and trades (landscaping, HVAC, plumbing, electrical first).
3. An unanswered call gets a text within seconds that knows the business, asks what the job is, offers a booking, and puts it in front of the owner. Every unanswered estimate gets a timed, job-specific follow-up that stops the moment they reply.
4. We look first, free. If we find nothing worth fixing, we say so. The quote comes in writing after the look. No prices on the page.
5. They can write hello@hambrickco.com or call (434) 260-0823.

They should not think this is a growth partner agency, a software product, an AI staff, or OpsPatch.

## Human, not generated

Do not throw out the live layout for a 21st.dev / shadcn card grid. That is how sites start looking AI-made.

Keep: one page; sticky header; hero with the enquiry story; two-column process with the phone; about with the gold rule; contact; the editorial type pairing; the `&` as the mark. Travis likes the wordmark. Do not replace it.

Change: the offer (only Lead Response and Estimate Recovery), the territory line (Charlottesville and a 40-mile radius — Crozet is inside it, not the center), every dollar amount, the "growth partner" line, and the 3D / motion craft.

Banned tells: purple glow, aurora gradients, glassmorphism soup, Inter / Roboto / Space Grotesk / Arial-as-brand, “seamless / elevate / empower / unlock,” three icon cards that say Quality / Experience / Value, fake 3D chrome, jewelry-store gold wash, crypto chrome planet, Lottie explosions, looped hero video, invented metrics dashboards.

## Visual north star

Match the current live theme. Do not switch back to the dark cinematic draft unless Travis asks.

The page is a quiet paper studio: warm off-white, ink type, one antique gold. The enquiry browser and the phone are the objects. The `&` is italic and gold.

## Materials

| Token | Hex | Use |
| --- | --- | --- |
| Paper | `#FBFBF9` | Page ground |
| Ink | `#0F1115` | Type, dark band, near-black |
| Gold | `#A98F45` | The `&`, buttons, toggle, 3D light |
| Wash | `#F4EFE0` | First offer well, contact ground |
| Copy | `#3A3F47` | Body |
| Gray | `#5F646B` | Captions, mono |
| Rust | `#F9ECEA` / `#913C35` | Leak / fail state |
| Surface | `#FFFFFF` | Cards, browser |

Think letterpress on paper, not a SaaS dashboard. Gold is an accent, never a gradient wash.

## Type

The live pairing, already on hambrickco.com:

- Headlines: Source Serif 4
- Body / UI: Hanken Grotesk
- Labels: JetBrains Mono, wide tracking

The `&` is italic Source Serif 4 in gold `#A98F45`. No hexagon H. Favicon is the `&`.

Kickers stay small. Headlines can be large. Do not set fake display words (FOCUS, DISCIPLINE) over the real copy.

## Motion

Winslow only. If a move does not show a missed call or dead quote dying or coming back to life, cut it. Ink and paper waking. No SaaS bounce, no neon, no section-wide fade.

What moves:

- Hero illustration: the before-thread settles and dims; the after-thread lifts and the status chip wakes. Lost work vs booked work.
- Meaningful state: leak vs fix, quote dead vs alive, form submit → honest mail-app confirmation.
- Micro-interactions only on commitment (primary CTAs, phone/email, form focus/submit). 120–200ms ease-outs. No bounce.
- One 3D object: the phone. Depth sells “this call is real and unanswered.” Tilt and lift only along the unread → revive arc. No idle spin, no second artifact.
- Scroll-linked revelation only to finish that revival, and only if the visitor has not locked Without us / With us. Do not pin. Do not autoplay the hero.

What never moves: body copy, numbers, legal, contact details except a focus ring or underline, nav chrome, particles, loops, logo flourish, hover that does not change state.

Honor `prefers-reduced-motion` as a kill switch: instant swap to the booked / alive end state. No WebGL. The 2D phone still tells the story. No essential information only in motion.

## The object

One phone. Lazy-init WebGL only when the process well is near the viewport. Cap pixel ratio, run frames only while the revive pose is moving, dispose on teardown.

If WebGL is missing, the GPU is weak, or reduced motion is on, show the same thread as a still 2D phone. Mid-laptop 60fps on that path. It must not read as a floating blob, a chrome planet, or a crypto globe.

## Page map (same bones as the live site)

1. **Nav** — Hambrick & Co. / What we do / How it works / Proof / About / Contact. CTA: Ask for a look. Never "See the price."
2. **Hero** — "Someone called. & Nobody called back." Territory is Charlottesville and a 40-mile radius, not Crozet and not "growth partner." Enquiry browser with Without us / With us. Illustration only — no customer names.
3. **What we do** — One offer: the unanswered-call text and the estimate follow-up. The free look is how we sell, not a second product. No dollar amounts. No "starting at."
4. **How it works** — look first, written quote after. Numbered steps plus the phone / ticket scene.
5. **Proof** — no case studies yet. Do not invent scores, logos, or a research run.
6. **About** — Travis Hambrick. Charlottesville, Virginia and a 40-mile radius. The `&` is you.
7. **Contact** — hello@hambrickco.com, (434) 260-0823. Recessed fields. Do not fake a send. A real form post or a mailto compose is honest; a success toast with no send is not.

## Copy rules

- Calm, direct, specific. If a line could sit on any SaaS homepage, cut it.
- Lead with the money they are losing. Never lead with AI, automation, or "growth partner."
- No prices on the public page. No "starting at." Quote comes in writing after the free look.
- No OpsPatch. No guaranteed results. No invented clients, reviews, years, revenue, or scores.
- No fake urgency. No AI-powered headline.
- Do not mention internal staff, Alfred, Manor, or n8n.
- Family name on purpose: Hambrick & Co.

## Not in this plan

- A new company name
- A second domain
- A blog, CMS, or React app (vanilla HTML / CSS / JS unless Travis asks)
- Stripe on the site
- Building painter demos in this repo
- Publishing to Netlify or connecting a custom domain unless Travis asks
- Replacing the wordmark

## Stack

Static `index.html`, `styles.css`, `main.js`, `scene.js`. GSAP from a CDN (core, ScrollTrigger, SplitText). Three.js from a CDN as an ES module. No framework unless Travis asks.
