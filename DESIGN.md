# Design plan

Status: plan. Not approved to build yet.

Live site today: [hambrickco.com](https://hambrickco.com/) is a one-page web-design pitch ("You run the business. We run the website."). The look is good. The story is stale.

This file is the plan for the company site. Client demo sites stay in `painter-site-kit`.

## Job of the page

A person who lands here should understand, in a few seconds:

1. Hambrick & Co. fixes messy handoffs in small businesses.
2. The first offer is getting an agency from signed-client to kickoff-ready.
3. Websites are still available if that is the leak.
4. They can write hello@hambrickco.com or call.

They should not think this is a software product, an AI staff, or OpsPatch.

## Keep from the live site

- One page. No blog, no app.
- Paper / ink / cobalt. Instrument Serif + Hanken Grotesk + IBM Plex Mono.
- The "&" as the brand mark ("The & is you" still works if the copy is about the owner, not only the website).
- Sticky header, calm sections, no SaaS dashboard look.
- Phone (434) 260-0823 and a real contact path to hello@hambrickco.com.
- Static files. Netlify can serve them.

## Change

| Now (live) | Next |
| --- | --- |
| Web design is the company | Ops sprint is the company. Websites are a second line. |
| Hero: we run the website | Hero: we clean up the handoff so work can start |
| Offers: Site / Care plan / Get found | Offers: Onboarding sprint first. Website + care as the secondary card. |
| Process: free demo site, then pay | Process: conversation, map the mess, leave a workflow in their tools. Website demos stay a path for site clients only. |
| Portfolio: Stonefield as if it is recent work | If kept, label it a sample site. Do not invent case studies. |
| Form: free demo site | Form: start a conversation. Success state must not claim an email was sent unless a real handler exists. |

## Page map

1. **Nav** — Hambrick & Co. / Work / About / Contact
2. **Hero** — one sentence on messy onboarding / kickoff. Secondary link: "We still build websites."
3. **What we do** — two cards. Primary: Agency onboarding readiness. Secondary: Websites for local businesses.
4. **How it works** — talk, map, hand back a checklist in their tools. No "AI transformation."
5. **Work** — empty or one labeled sample. No fake reviews.
6. **About** — Travis, Charlottesville area, you work with the person doing the work.
7. **Contact** — hello@hambrickco.com, phone, short form or mailto.

## Copy rules

- Calm, direct, specific.
- Ask or describe the mess. Do not accuse the reader of being disorganized.
- No prices on the public page until Travis treats a number as a real quote.
- No OpsPatch. No guaranteed results.

## Not in this plan

- A new brand name
- A second domain
- A blog, CMS, or React app
- Stripe on the site
- Building painter demos in this repo

## Build trigger

Do not implement this page until Travis or the Executive Assistant says the plan is good enough. Then one pass: generate, screenshot, de-slop. Same quality bar as painter-site-kit: tell the truth, no stock-model hero, no Inter, no fake send.
