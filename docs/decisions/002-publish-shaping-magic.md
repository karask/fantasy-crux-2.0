# ADR-002: Publish Shaping as the canonical Magic system

## Status

Accepted

## Date

2026-07-22

## Context

Fantasy Crux Lite reserved an empty Magic chapter while two freeform systems were developed. The selected system now needs to use the current Lite skill, Power Point, action, defence, wound, and Improvement rules. It must also remain readable on phones, searchable by rule, and easy to refine through playtesting.

## Decision

Use **Shaping** as the canonical Magic system. Store it under `src/content/rules/magic/` as seven portable Markdown rule records plus the Magic chapter hub:

- Becoming a Shaper
- Building a Shaping
- Techniques and Forms
- Effects
- Casting and Defence
- Ongoing Shapings and Magical Actions
- Rituals and Examples

Shaping access is declared before Knowledge points are allocated, reserves 8 starting IP, and is paid during the starting-IP step. The published rules reuse the core Lite procedures rather than duplicating alternative combat, recovery, or advancement systems.

Remove the former Shaping candidate after migration so there is one canonical copy. Preserve `freeform-magic/FC-magic-potential-2.md` as the unpublished Magic 2.0 alternative.

## Alternatives considered

### Publish Shaping as one long page

This would preserve the candidate document's shape, but would weaken section-level search, navigation, quick reference, and mobile scanning.

### Publish Magic 2.0

Magic 2.0 has strong Traditions and Authorities, but Shaping's explicit Technique–Form grid is the selected playtest direction. Keeping Magic 2.0 outside the generated rules preserves it without creating two canonical systems.

### Retain the empty Magic chapter

This would avoid committing to a draft, but would prevent whole-system playtesting and leave Power Points without their primary current use.

## Consequences

- Magic is a normal chapter with stable routes, Quick Reference entries, Pagefind indexing, responsive tables, and accessibility coverage.
- Character creation and related mundane rules link to Shaping where their procedures interact.
- The compact visible-copy budget rises from 12,000 to 16,000 words to include a complete playable magic system.
- Future Shaping refinements occur in the canonical rule pages; stable IDs and URLs should remain unchanged where possible.
- ADR-001 remains the record of the Markdown-first architecture. This decision ends its temporary unpublished-Magic phase without superseding that architecture.
