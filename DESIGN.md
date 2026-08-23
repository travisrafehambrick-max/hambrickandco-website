# Design plan

Status: plan. Not approved to build yet.

Live site today: [hambrickco.com](https://hambrickco.com/) is a one-page web-design pitch. Keep the bones. Change the story and the materials.

This file is the plan for the company site. Client demo sites stay in `painter-site-kit`.

## Job of the page

A person who lands here should understand, in a few seconds:

1. Hambrick & Co. fixes messy handoffs in small businesses.
2. The first offer is getting an agency from signed-client to kickoff-ready.
3. Websites are still available if that is the leak.
4. They can write hello@hambrickco.com or call.

They should not think this is a software product, an AI staff, or OpsPatch.

## Human, not generated

Do not throw out the current layout for a 21st.dev / shadcn card grid. That is how sites start looking AI-made.

Keep: one page, sticky header, hero + two offers + process + about + contact, the editorial type pairing, the "&" as the mark.
Change: colors, materials, logo, copy, a little physical motion.

Banned tells: purple glow, aurora gradients, glassmorphism soup, Inter/Roboto/Space Grotesk, "seamless / elevate / empower / unlock," three icon cards that say Quality / Experience / Value, fake 3D chrome, gold everywhere.

## Palette (new)

Drop cobalt as the brand color.

| Token | Use |
| --- | --- |
| Graphite `#121212` | Page ground, type on light |
| Steel `#8A8F98` | Hairlines, captions, quiet metal |
| Paper `#F4F2EC` | Light panels, body on dark |
| Gold `#C4A574` | Thin accent only: the &, a rule, a hover. Never a fill, never a gradient wash. |

Think brushed steel and warm paper, not jewelry store and not crypto black-and-gold.

## Motion

Yes, but physical. Weight, a little inertia, scroll that eases. Honor `prefers-reduced-motion`.

When we build: GSAP (Cursor plugin `GSAP`, id 7194) for scroll and the &. No Lottie explosions. No looped hero video.

## Logo

Rebrand the mark, not the name.

- Wordmark: **Hambrick & Co.**
- The `&` is the logo. Metal, not a geometric blob.
- Gold `&` on graphite, or graphite `&` on paper. One version. No icon app-tile unless we need a favicon later.
- Do not draw a H-in-a-hexagon.

## Page map (same bones)

1. **Nav** — Hambrick & Co. / Work / About / Contact
2. **Hero** — messy kickoff, not "we run the website." Secondary: "We still build websites."
3. **What we do** — two cards. Ops sprint first. Websites second.
4. **How it works** — talk, map, hand back a checklist in their tools.
5. **Work** — empty or one labeled sample. Stonefield is a demo mock if kept.
6. **About** — Travis, Charlottesville area.
7. **Contact** — hello@hambrickco.com, (434) 260-0823. Do not fake a send.

## Tools that actually help

In the Cursor catalog, these exist:

- **GSAP** (not installed) — motion
- **Mobbin** (not installed) — real site references, not generated ones
- **Magic Patterns** (not installed) — optional prototypes
- Already in `painter-site-kit`: `frontend-design` and `avoid-ai-design`. Point at those. Do not reinvent them here.

Not in the Cursor plugin catalog (do not pretend they are): Impeccable, Taste, Google Stitch, 21st.dev MCP. If Travis adds them as local skills later, fine. Do not block the plan on them.

Skip shadcn as the look. Too generic for this brand.

## Copy rules

- Calm, direct, specific.
- No prices on the public page until Travis treats a number as a real quote.
- No OpsPatch. No guaranteed results.

## Not in this plan

- A new company name
- A second domain
- A blog, CMS, or React app
- Stripe on the site
- Building painter demos in this repo

## Build trigger

Do not implement until Travis or the Executive Assistant says the plan is good enough. Then: logo wordmark, then the page, then motion. Screenshot and de-slop before calling it done.
