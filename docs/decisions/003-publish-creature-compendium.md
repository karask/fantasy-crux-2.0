# ADR-003: Publish the creature compendium as a structured bestiary

## Status

Accepted

## Date

2026-07-23

## Context

`freeform-creatures/FC-creatures-lite.md` held 57 finished profiles converted to the current Lite rules, plus the shared procedures they depend on: profile formulas, creature tags, Mastery, Multiattack, senses, Spirit Combat, and Elemental shells. The compendium was complete but unpublished, so Gamemasters could not reach it from the site, search could not find a creature, and the contract tests guarded the rules against a document nobody could read.

Publishing it as one long prose page would have carried the compendium's shape onto the site, but a bestiary is scanned, not read: the useful unit is the profile, and the useful action is narrowing 57 profiles down to the handful a scene needs. Illustrations are planned but not yet commissioned.

## Decision

Publish **Creatures** as chapter 08, after Adventuring, since its audience is the Gamemaster.

Split the compendium into two record types under `src/content/rules/creatures/`:

- Seven `type: rule` records for the shared procedures, rendered exactly like any other rule section.
- Fifty-seven `type: creature` records whose stat block lives in validated frontmatter — category, tags, characteristics, derived attributes, skills, attacks, and Talents — with only the abilities left as Markdown body.

Structured frontmatter is what makes the presentation possible: the layout renders real stat grids, tag chips, and attack rows rather than reflowing prose, and the contract tests check the Lite formulas against typed values instead of parsing sentences. Values that the compendium qualifies (`4 or 7 free-willed`) or withholds (`—`) stay as strings, and a profile priced entirely by a rank table keeps its prose line.

Each profile carries a portrait frame. Until artwork exists it draws a placeholder; an optional `image` field swaps in a thumbnail per creature with no layout change.

Filter buttons narrow the bestiary by creature type, reusing the Talent catalogue's filter behaviour. Because a filtered-out profile cannot be scrolled to, following a link to a hidden creature widens the filter first.

Keep `freeform-creatures/FC-creatures-lite.md` as the preserved drafting source, as `freeform-magic/` is for Magic. The published records are canonical; a contract test asserts every published value still traces back to a compendium entry, so the conversion cannot drift unnoticed.

## Alternatives considered

### Publish the compendium as a single prose page

Faithful to the source and cheap, but it would leave the stat blocks as paragraphs, make section-level search useless, and rule out filtering or thumbnails.

### Generate the chapter from the compendium at build time

This would guarantee fidelity, but it would create two sources of truth for one chapter and contradict ADR-001's Markdown-first content model. Fidelity is enforced by test instead.

### Give each creature its own page

Rejected for the same reason the other chapters are single pages: a bestiary is browsed by comparison, and 57 routes would fragment it.

## Consequences

- Creatures is a normal chapter with a stable route, anchors per profile (`/rules/creatures/#vampire`), Pagefind indexing, and accessibility coverage.
- The visible-copy budget splits: the rules keep their 16,000-word ceiling, and the bestiary gets a separate 4,500-word budget for ability text. Reference data no longer competes with rules prose for the same allowance.
- The creature contract now tests the published chapter, so the HP, MWL, PP, Combat Order, and DM formulas are verified against what readers actually see.
- The no-image phase ends for creature thumbnails only. Rules prose still carries no images, and the contract test continues to reject image and raw-HTML markup in Markdown bodies.
- ADR-001 and ADR-002 remain in force; this decision ends the unpublished-creature phase without changing the architecture.
