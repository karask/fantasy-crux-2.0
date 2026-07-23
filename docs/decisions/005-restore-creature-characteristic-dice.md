# ADR-005: Restore creature characteristic dice ranges

## Status

Accepted

## Date

2026-07-23

## Context

ADR-003 published the bestiary from `freeform-creatures/FC-creatures-lite.md`, which kept only the fixed average of each characteristic (`STR 14`) and dropped the dice that generated it (`STR 4D6 (14)`, still present in the original `tex/ch32-creatures.tex`). That was the right call for a stat block meant to be used straight off the page, but it left two things unsupported: building a specific named creature or a varied group instead of 57 identical specimens, and computing a playable race's actual characteristic limits for [Fantasy Races](/rules/gm-tools/#fantasy-races), which depends on the same dice.

The gap showed up concretely: the Fantasy Races racial-maxima section (ADR-004) could only state Elf `DEX` and Dwarf `STR`/`CON` from the two examples the original LaTeX happened to give in prose, because the dice needed to compute the rest were not on the site.

## Decision

Add an optional `characteristicDice` field to the creature schema, alongside the existing `characteristics` averages. It carries only the characteristics that actually vary — a dice formula such as `4D6` or `10D6+30`, or a dual form such as `3D6/6D6` for Golem's programmed/free-willed split and Werewolf's human/wolf split. A characteristic with nothing to roll (a summoned being's fixed stats, an undead's 0 POW) is simply omitted rather than given a fake die.

Recover the dice from `tex/ch32-creatures.tex` at commit `040db44` (the deletion in ADR-004 kept the git history; `git show 040db44:tex/ch32-creatures.tex` still returns it). Populate all 54 creatures that have one — Elemental stays prose (rank table, no fixed characteristics) and Holy Steed/Holy Warrior stay fixed (summoned beings with no variance) — and freeze the approved values in a contract test, the same pattern ADR-004 used for Plunder Ratings, since the source file is not expected to stay in the working tree.

Render the die under its average in the existing characteristics grid (`4D6` in small type below `14`), inside the `<dd>` rather than as a sibling of `<dt>`/`<dd>` — axe's `definition-list`/`only-dlitems` rules reject a `<dl] > div` with a third child that is neither `dt` nor `dd`. The colour also needed its own choice: `--steel`, used for muted text on the dark chrome elsewhere in the site, fails WCAG AA contrast against the light `--bone-light` card background this sits on (2.79:1); it uses the same grey as `.creature-note` instead (6.5:1).

Use the recovered dice to fix Fantasy Races properly instead of leaving it as an approximation. The "racial top" rule from the source (`tex/ch31-more-rules-advice.tex`: _"the racial top is the maximum possible value plus 3"_) is universal, but ADR-004 could only apply it to the two characteristics the original prose named as examples (Elf `DEX`, Dwarf `STR`/`CON`) and fell back to the human cap of 18 for the rest — which turns out to be wrong in five of the fourteen cells now computable (Elf `CON`/`INT`/`POW`/`CHA` all exceed 18; Dwarf `SIZ` is 12, _below_ the human cap). Fantasy Races now publishes the complete seven-characteristic table for both races, computed from the same dice the creature profile carries, plus a "Random characteristics" section offering the race's own dice as an alternative to point-buy — the missing half of what the original text called "the dice rolled for the Random Characteristics method."

## A source inconsistency, left as found

Nine of the dice formulas in `tex/ch32-creatures.tex` do not arithmetically average to the parenthetical value the same line states, e.g. Giant Octopus `CON = 4D6+6 (14)` — `4D6+6` averages to 20, not 14. This is a pre-existing error in the 2024 LaTeX rulebook, not something introduced by this conversion or the Lite pass before it: the _fixed_ average already published (14) matches the LaTeX's stated value exactly, so the discrepancy is between the source's own die formula and its own label. The nine are: Giant Octopus CON, Crocodile CON, Elephant SIZ, Giant Hawk STR and SIZ, Mummy DEX, Rhinoceros STR and SIZ, Zombie INT.

These ship as authored rather than silently corrected. A game-balance number is not this project's to invent; the affected stat block is otherwise unchanged, the gap is at most 6 points on stats running into the 40s and 70s, and it only surfaces if a GM rolls that specific characteristic to generate a variant. If the intended formula is known, the fix is a one-line frontmatter edit plus updating the frozen value in `creature-and-shaping-contract.test.mjs`.

## Consequences

- Every creature profile with natural variance shows its generating dice, so a GM can roll a specific individual, a group of unequal members, or a named opponent instead of reusing the average member verbatim.
- Fantasy Races publishes correct, complete racial maxima for all seven characteristics on both example races, not just the two the original prose happened to spell out, and gains a dice-based alternative to point-buy character creation.
- The bestiary's visible-copy budget (ADR-004, 4,500 words) is unaffected — the dice live in frontmatter, which the word count does not include.
- Nine pre-existing arithmetic inconsistencies in the 2024 source are now visible on the site rather than hidden inside an average; they are documented above rather than corrected without authority to do so.
- ADR-001 through ADR-004 remain in force; this decision extends ADR-003's bestiary and ADR-004's Fantasy Races without changing either's architecture.
