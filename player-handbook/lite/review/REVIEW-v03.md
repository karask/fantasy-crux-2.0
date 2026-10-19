# Fantasy Crux Lite v03 review

19 October 2026. Status: **draft for the designer's review.** Not published.

## What changed since v02

v03 adds the omissions most likely to make a table play a rule wrong, chosen
from the full comparison in `../MISSING.md`.

- **Page 4:** skills keep their scores when a characteristic rises.
- **Page 6:** readying two items, or stowing one and drawing another, takes the
  whole Movement Action; no option can conflict with an action already used.
- **Page 11:** touching an unwilling target first needs a no-damage Unarmed
  Combat attack; Mind magic deals no HP damage and Unmake·Spirit drains PP; an
  unwilling subject under active control moves at most 3 m a round; a subject
  who cannot take Combat Actions retries its defence at the end of its turn.
  Backlash and the cost table were tightened to make room.
- **Page 12:** the Gamemaster page gains the creature rules: reading a profile,
  natural weapon Sizes, Paralysed, creature types, Multiattack, and Spirit
  Combat and possession.
- **Page 13 (new):** the bestiary moves to its own page and grows from 10 to 21
  creatures: Crocodile, Dog, Ghost, Giant, Giant Ant, Golem, Horse, Lion, Mummy,
  Viper and Wyvern join. Stat lines are generated from the profiles; Spirit
  Combat damage now shows as PP. Only the short notes are written by hand.
- `MISSING.md` lists everything Lite still leaves out.

Lite now has 14 pages: 13 of rules and the licence.

## Automated checks: passed

- **Compatibility:** 315 checks against `src/content/rules/`, as in v02.
- **Layout:** no overflow; text at least 9.5 pt (licence 7.2 pt); every page at
  least 4 mm above its footer.
- **Accessibility:** no automated WCAG 2 A/AA violations.
- **PDF (`verify.py v03`):** 14 A4 pages, complete selectable text, embedded
  fonts, one folio each, cover art present.

## Visual inspection: passed

All 14 pages were rasterised at 100 dpi. Pages 6, 11, 12 and 13 were inspected
in full after the change.
