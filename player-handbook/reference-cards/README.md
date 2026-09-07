# A4 player reference cards

This is the approved compact play aid, separate from the A5 handbook. The v05
edition has three A4 player reference pages. Equipment tables, licence text,
character creation, advancement and GM procedures remain outside the cards.

## Page organisation

1. **At the Table:** D100, Bonus/Penalty dice, opposed tests, assistance, Lore
   preparation, all 24 short skill cues and Hero Points.
2. **Combat Choices:** Combat Order, actions, Delay, movement, Set Weapon,
   positioning, Aim/range/cover, readying/reloading, grappling and Intimidate.
3. **Attack, Defend & Recover:** attacks and defence, Parry, damage and Critical
   attacks, off-hand options, wounds, stabilisation, treatment, Surgery and rest.

The layout keeps related rules together in explicit columns. `column_break` in
each page's frontmatter names the first heading in its second column.

## Print

Print `output/pdf/fantasy-crux-player-reference-cards-v05.pdf` at actual size on
A4 paper as three single-sided cards. Alternatively, duplex on the long edge:
cards 1 and 2 share a sheet; card 3 is on a second sheet with a blank reverse.

## Edit and rebuild

Player copy is in `content/`; shared layout is in `cards.css`.

```sh
node player-handbook/reference-cards/render.mjs v05
```

The renderer creates the PDF, a self-contained HTML preview, page PNG candidates
and machine-readable geometry/content checks.

Browser headers and footers are explicitly disabled. The footer contains only
`CORE RULES` and one card number.

**Approved for publication:** v05 includes the approved grapple-defence Reaction
cost. The Downloads entry in `src/_data/downloads.mjs` selects v05 with matching
three-page print instructions.

Versions v01-v04 and their HTML previews/review records are superseded historical
snapshots. They are retained for comparison, not current rules or download targets.

## Rules sources

Copy is abridged from `src/content/rules/skills/`, `combat/`, the Hero Point
section in `characters/character-creation.md`, and
`adventuring/healing-and-recovery.md`. Rare rulings and the wider adventuring
subsystems remain in the full rules.
