# Design

Status: **approved to build.** This file is the live direction, not an open plan.

Live site today: [hambrickco.com](https://hambrickco.com/) is still the old web-design pitch. Keep its **bones**. Change the story and the materials.

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

Keep: one page; sticky header; hero + two offers + process + about + contact; a slim work sample if kept; the editorial type pairing; the `&` as the mark.

Change: colors, materials, logo treatment, copy, one physical object in the hero, a little weighty motion.

Banned tells: purple glow, aurora gradients, glassmorphism soup, Inter / Roboto / Space Grotesk / Arial-as-brand, “seamless / elevate / empower / unlock,” three icon cards that say Quality / Experience / Value, fake 3D chrome, jewelry-store gold wash, crypto chrome.

## Materials

Graphite ground. Pearl / nacre panels (warm off-white with a quiet sheen, not plastic white). Steel hairlines. One machined pearl-metal sphere in the hero. Thin antique gold only on the `&` and maybe one hairline.

| Token | Hex | Use |
| --- | --- | --- |
| Graphite | `#121212` | Page ground, type on pearl |
| Steel | `#8A8F98` | Hairlines, captions, quiet metal |
| Pearl | `#F3EEE4` | Light panels, body on dark |
| Gold | `#C4A574` | The `&`, at most one rule or hover. Never a fill. Never a gradient wash. |

Drop cobalt as the brand color. Think brushed steel and nacre, not a jewelry counter and not a coin app.

## Type

Editorial pairing, already on the live site:

- Headlines: Instrument Serif
- Body / UI: Hanken Grotesk
- Labels: IBM Plex Mono

The `&` is italic Instrument Serif in antique gold. No hexagon H. No icon app-tile unless a favicon is needed (then the favicon is the `&`).

## Motion

Physical, short, heavy. Weight and a little inertia. GSAP is fine.

- The hero `&` settles into place.
- The sphere catches light and turns a little on scroll.
- Section reveals are small and once.

Honor `prefers-reduced-motion`: no scroll-tied spin, no entrance motion. No Lottie explosions. No looped hero video.

## Page map (same bones)

1. **Nav** — Hambrick & Co. / Offers / Process / Work / About / Contact
2. **Hero** — signed-to-kickoff, not “we run the website.” Sphere on the right. Secondary: websites still offered.
3. **What we do** — two offers. Ops sprint first. Websites second. Not a three-card grid.
4. **How it works** — talk, map the holes, hand back a checklist in their tools.
5. **Work** — empty or one labeled sample. Stonefield is a demo mock if kept.
6. **About** — Travis, Charlottesville / Crozet area. Large `&`, not a portrait we do not have.
7. **Contact** — hello@hambrickco.com, (434) 260-0823. Do not fake a send. A mailto compose is honest; a success toast is not.

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

## Stack

Static `index.html`, `styles.css`, `main.js`. GSAP from a CDN or a local vendor file. No framework unless Travis asks.
