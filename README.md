# Hambrick & Co. website

Company site for [hambrickco.com](https://hambrickco.com/).

Hambrick & Co. does Lead Response and Estimate Recovery for local trades. We look first, free. The quote comes in writing after.

Read [DESIGN.md](DESIGN.md), [AGENTS.md](AGENTS.md), and [CLAUDE.md](CLAUDE.md) before changing the page.

Client painter demos are **not** built here. Those live in repos spawned from `painter-site-kit`.

Do not publish to Netlify or connect a custom domain unless Travis asks.

## Open locally

From this directory:

```bash
npm run preview
```

or `npx serve .`, or `python3 -m http.server 4173`.

Then open `http://localhost:3000/` (serve) or `http://localhost:4173/` (python).

Draft 3 direction studies live under [`variants/`](variants/index.html). They are preview-only and do not replace the live page.
