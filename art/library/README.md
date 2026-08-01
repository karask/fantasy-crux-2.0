# Canonical art library

This directory is the sole live source of truth for reusable Fantasy Crux
artwork. `catalog.json` indexes every approved master, content source, style
reference, recurring cast anchor, and published website derivative. Historical
prompts and generation records live under `../archive/provenance/` and are not
live dependencies.

## Active production style

`inked-adventure-comic-vivid` is the only active and website-published style.
The other four systems retain one visual anchor and one detailed `STYLE.md` so
they can be recreated later without retaining full alternate image sets.

## Recreate an image

1. Choose a chapter subject and read its `CONTENT.md`, or choose a creature from
   `subjects/creatures/content-manifest.json`.
2. Read the selected rendering system's `styles/<style-id>/STYLE.md`.
3. Use the subject brief, pose, rules, and cast anchors for content and
   composition. Use the style anchor only for rendering language.
4. Never inherit the style anchor's subject, layout, palette, lighting,
   weather, or mood.

## Authoritative records

- `catalog.json`: generated index of masters and website derivatives.
- `chapters/illustration-program.json`: chapter placement, content, pose, cast,
  alt text, and layout registry for 28 illustrations.
- `subjects/creatures/pose-registry.json`: canonical pose, source profile,
  master, hash, and QA record for 57 creatures.
- `subjects/creatures/content-manifest.json`: generated recreation records that
  combine creature rules and statistics with the pose registry.
- `subjects/home-hero/subject.json`: selected homepage scene and output paths.

Run `npm run art:build` after intentionally changing a master or source record.
Run `npm run art:validate` for a read-only integrity check. Website artwork
remains optimized under `src/assets/images/`; those files are derivatives, not
authoring masters.
