# Hambrick & Co. website

Company site for [hambrickco.com](https://hambrickco.com/).

Hambrick & Co. is an operations practice first: get a signed client to kickoff. Websites are still offered. They are not the lead.

Read [DESIGN.md](DESIGN.md), [AGENTS.md](AGENTS.md), and [CLAUDE.md](CLAUDE.md) before changing the page.

Client painter demos are **not** built here. Those live in repos spawned from `painter-site-kit`.

## Open locally

From this directory:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

Draft Next.js directions (not production) live in [`directions/`](directions/README.md). Preview with `cd directions && npm run dev` — localhost `/` is the Assist Pane conversion homepage. Do not point Netlify prod at that folder.
