# Figures provenance

Source: https://github.com/cherifya/figures
Inspected and vendored commit: f3c70cf1fe5991764883e5446c1398dc12dd946e
File: src/figures.js → figures.cjs. MIT license retained alongside source.

One local modification: expose `actorState` and `face2` in the exported API.
The original SVG renderer remains available. Our `src/rig.ts` consumes actual
Figures joint positions and expression parameters; no DOM scraping, image warping,
or second competing skeleton is used. Treat these two new hooks as a pinned internal
API when updating upstream. Upstream skill installation is kept in `.claude/skills/figures`.
