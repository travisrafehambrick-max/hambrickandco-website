# Draft directions (not live)

**Skill lock:** taste V2 only — `design-taste-frontend` (`design-taste-frontend/SKILL.md`).
Do not use `design-taste-frontend-v1` or `taste-skill-v1`. Impeccable on every route.

Next.js + React (TypeScript) + React Three Fiber + GSAP/ScrollTrigger.

This folder is a **separate app**. It does not replace the production static site at the repo root (`index.html` → hambrickco.com). Do not point Netlify production at this directory.

## Local preview

From `directions/`:

```bash
npm install
npm run dev
```

Then:

| Route | URL |
| --- | --- |
| Hub | http://localhost:3000/ |
| Society Hall | http://localhost:3000/society-hall |
| Solid Proof | http://localhost:3000/solid-proof |
| Signature Reel | http://localhost:3000/signature-reel |
| Balance Object | http://localhost:3000/balance-object |
| Assist Pane | http://localhost:3000/assist-pane |

Production-like:

```bash
npm run build && npm start
```

Same paths on http://localhost:3000/.

## Stack lock

- Next.js 15 App Router, React 19, TypeScript
- Three.js via `@react-three/fiber` (`frameloop="demand"` — no idle wobble)
- GSAP + ScrollTrigger + `@gsap/react`
- Tailwind v4 tokens only: gold / matte / ink
- No Framer Motion
- No Higgsfield assets

`prefers-reduced-motion: reduce` jumps each direction to the recovered end state.

## Optional Netlify draft

Only if Travis asks: treat `directions/` as the site base for a **draft** deploy. Never change production publish of the static root.
