# Fantasy Crux Lite v01 review

16 October 2026. Status: **draft for the designer's review.** Not published.

## Deliverable

`output/pdf/fantasy-crux-lite-v01.pdf`: 13 A4 pages, 12 of rules and one of
licence. Editable Markdown in `content/`, one file per page.

## Automated checks: passed

- **Compatibility:** 282 checks against `src/content/rules/`, run before
  printing: every close and ranged weapon value, all five armours, all 27 skill
  bases including Shaping, the Damage Modifier steps, six ancestry spreads and
  six maxima rows, the Shaping limits table, four conjured-being rows, the
  travel paces, both Fatigue states, the object rows, and the complete licence.
- **Bestiary:** the ten creature stat lines are generated from the creature
  profiles; only the short notes are written by hand.
- **Layout:** no overflow or clipping on any page; text at least 9.5 pt (the
  licence 7.2 pt, as in the handbook); every page at least 4 mm above its footer.
- **Accessibility:** no automated WCAG 2 A/AA violations in the HTML; the
  cover image has alt text.
- **PDF (`verify.py`):** 13 A4 pages with complete selectable text, embedded
  fonts, one folio each, and the cover art present. Results in
  `pdf-checks-v01.json`.

## Rules review

Every page was checked by hand against its listed sources. Corrections made
during drafting:

- Expertise edges and the Elf's forest knack now **ignore one Penalty die**, as
  the Talents do; a first draft wrongly gave +1B.
- Example dice share one units die (a Bonus die adds a tens die only).
- "Active Guard" is used as in the full rules, not renamed.
- The rulings of October 2026 are included: Withdraw keeps Reactions; off-hand
  Parries; position modifiers apply to your own roll; Intimidate as the GM's
  judgement; halves round up; Dispel against a fresh roll for the original
  caster.

## Visual inspection: passed

All 13 PDF pages were rasterised at 100 dpi and inspected, before and after
the fixes. Pages 2, 3, 5, 6, 7, 10, 11, 12 and 13 were checked again after
their final edits.

## Decisions for the designer

1. **Format:** A4 is recommended (see the README); A5 can follow from the same
   source.
2. **Edges:** nonhumans get their ancestry abilities free plus two edges. That
   is slightly generous: the full rules leave a Dwarf 3 IP after its 7 IP of
   abilities, about one edge.
3. **Edge prerequisites** are dropped: for example, Favoured Weapon needs 51%
   with the weapon and Steady Casting needs Shaping 76% in the full rules.
4. **Not in Lite:** rituals, enchanting, the learned Shaping adjustments,
   Counter, calling beings, Spirit Combat, mass combat, ships and random
   characteristics. Each is a candidate for a later page if play shows a need.
