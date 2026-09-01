# ADR-014: Adopt Vivid Ink as the production illustration system

## Status

Accepted

## Date

2026-08-01

## Context

[ADR-006](006-adopt-grounded-painterly-fantasy-art-direction.md) selected
Grounded Painterly Fantasy from an early set of matched studies. Subsequent
production explored several rendering systems across chapter scenes, recurring
characters, and the complete creature catalogue.

Vivid Inked Adventure Comic proved the most effective production system. It
kept figures, equipment, creatures, and action readable at website sizes while
supporting a consistent visual identity across very different subjects. The
approved Vivid Ink set was then completed for the homepage, rules chapters, and
all creature profiles.

The art cleanup consolidated approved masters and their authoring records under
one live library. Earlier studies and generation provenance remain archived,
but they are not production dependencies.

## Decision

Adopt **Vivid Inked Adventure Comic** (`inked-adventure-comic-vivid`) as the
only active and website-published illustration system.

- `art/library/` is the sole live source of truth for approved masters, style
  guidance, subject briefs, cast anchors, manifests, and website derivatives.
- `art/archive/` retains historical prompts and provenance for consultation.
- `art/review/` contains only candidates awaiting an explicit decision.
- Optimized files under `src/assets/images/` are derivatives, not authoring
  masters.
- The other four retained rendering systems are inactive references. Each keeps
  one visual anchor and one detailed guide so it can be recreated later.

This decision supersedes ADR-006 as the production art direction. ADR-006
remains in the repository as the record of the earlier study decision.

## Consequences

- The published programme contains one homepage scene, 28 chapter
  illustrations, and a portrait for every one of the 57 creature profiles.
- New and replacement artwork should use the Vivid Ink style guide and relevant
  subject, pose, and cast records in the canonical library.
- Art integrity is checked with `npm run art:validate`; intentional metadata
  changes are regenerated with `npm run art:build`.
- Historical art paths must not be restored as live production interfaces.
