# ADR-004: Publish Gamemaster Tools, the Open Game License, and audited omissions

## Status

Accepted

## Date

2026-07-23

## Context

An audit of every LaTeX chapter against `src/content/rules/` found two whole bodies of content that never reached the site, and two smaller omissions inside chapters that did.

`tex/ch31-more-rules-advice.tex` holds the procedures a Gamemaster needs above the scale of one character: plunder, ships and sailing, mass combat, when to call for a test, playable fantasy races, minor-NPC shorthand, and epic characters. A Gamemaster running Fantasy Crux 2.0 had no way to resolve a sea voyage, a battle, or a treasure hoard.

The smaller omissions are the **Intimidate** Combat Action (`tex/ch14-combat.tex`), absent from the combat chapter altogether, and the **creature chapter's own framing** (`tex/ch32-creatures.tex`) — how to build on a profile, which creatures suit player characters, and how to scale an encounter.

`tex/license.tex` is the Open Game License 1.0a. The site publishes Open Game Content derived from the OpenQuest, RuneQuest SRD, and Legend material credited in Section 15, but shipped no copy of the licence, and named no author or copyright holder anywhere. Section 10 requires a copy to accompany every distribution, and clause 6 requires the copyright notice to be updated for a new work.

## Decision

Publish **GM Tools** as chapter 08, between Adventuring and Creatures, matching Part III of the book. Creatures moves to 09.

Convert seven of the nine source sections as ordinary `type: rule` records. Four convert directly (Plunder Rating, Ships and Sailing, Mass Combat, Calling for Tests). Three need adaptation:

- **Fantasy Races** — the compendium kept fixed characteristics and dropped the dice ranges, so starting spreads are restated against the game's 56-point baseline and racial maxima are given explicitly per race.
- **Minor NPCs** — discipline abbreviations become Talents and Shaping cells.
- **Epic Characters** — the above-100% master-skill clause is dropped, since skills cap at 100%.

**Player Archetypes: Monk** and **Traits, Talents, Feats** are not published. Both are built on Folk Magic, which this rules set replaced with Shaping; rewriting them is new design rather than conversion, and the second overlaps the Talents chapter.

Restore **Plunder Ratings** to the bestiary, since the table is unusable without them. They were converted from the `plunderrating` key in the LaTeX creature chapter, not from `freeform-creatures/FC-creatures-lite.md`, which never carried them, so the approved table is frozen in a contract test of its own rather than checked against a source file. The twenty profiles the LaTeX leaves unrated are all animals, the Elemental, or a spirit, and take 0 on the chapter's own statement that animals have no treasure by design.

Publish the **Open Game License** at `/license/`, outside `src/content/rules/` so it is neither a chapter nor part of the rules budget. It carries the licence verbatim, every Section 15 notice, and a new notice for this edition. It is linked from the sidebar and from the footer of every page. Art credits stay off it until there is art on the site to credit.

Restore the two omissions found by the audit. **Intimidate** joins the other Combat Actions in `combat/rounds-and-actions.md`, with its opposed Influence-versus-Persistence test and the four-row condition table. The creature guidance becomes **Using Creatures**, the first section of the bestiary, which also gives Fantasy Races something to link back to.

Markdown's typographer had to be narrowed for this: `markdown.disable('replacements')` in `eleventy.config.mjs`. Left on, it rewrites `(c)` as `©` inside clause 1, silently editing the licence. Smart quotes stay enabled, and no rules content depended on the other substitutions.

## Alternatives considered

### Publish the GM chapter under the existing rules budget

The rules sat at 15,830 words of a 16,000 ceiling. Folding another 2,400 in would have meant raising the ceiling and quietly weakening the constraint that keeps the player-facing rules compact.

### Keep the licence as a chapter under `src/content/rules/`

It would have consumed a quarter of the visible-copy budget with text nobody reads at the table, and appeared in the chapter directory and the search index alongside actual rules.

### Rewrite the Folk Magic sections around Shaping

Deferred rather than rejected. Monastic feats and once-per-day spell-like abilities are worth having, but they are design decisions about Shaping's boundaries, not a conversion task, and they should be made deliberately.

## Consequences

- The visible-copy budget now has three buckets: 16,250 words of core rules, 4,500 for the bestiary, 4,000 for GM Tools. Each stays a live constraint instead of one ceiling absorbing everything.
- The core ceiling moved from 16,000 to 16,250 to fit Intimidate. The original figure was measured against a conversion that had silently dropped a Combat Action, so the budget, not the rule, was wrong. Restoring omissions is the only reason it should move again.
- Every creature profile carries a Plunder Rating, and the label links to the table that reads it.
- The site is compliant with the licence it publishes under, and finally names its author.
- `padChapter` no longer pads non-numeric nav markers, so `QR` and `§` render as written.
- The combat chapter regains a Combat Action, and the bestiary regains the framing that tells a Gamemaster what to do with 57 profiles.
- With the conversion complete, `tex/` was reduced to the six chapters not yet converted: Disciplines, Battle, and the four magic systems. The published chapters, `license.tex`, and `fantasy-crux.tex` were removed, and the contracts that had read them now freeze their expectations instead. Deleted files remain in commit 040db44.
- ADR-001 through ADR-003 remain in force. This decision ends the unpublished-GM-tools phase, closes the licence gap, and repairs the conversion gaps the audit found, without changing the architecture.
