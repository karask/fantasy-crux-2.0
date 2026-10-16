# Fantasy Crux Lite v02 review

16 October 2026. Status: **draft for the designer's review.** Not published.

## What changed since v01

The designer found v01's edges unbalanced. v02 replaces them with the full
rules' Improvement Points.

- **Edges removed.** Edges gave every Talent one price, although Talents cost
  2 to 5 IP. They ignored prerequisites, so a new character could take Talents
  that need 76% skill, which a new full-rules character cannot reach. They also
  gave ancestry abilities away free.
- **Improvement Points at creation.** Characters start with 10 IP, minus their
  ancestry's abilities (Elf 5, Dwarf 7, Orc 4, Goblin 5, Lizardfolk 6), and can
  keep back up to 20 skill points from each of three pools for more: 5 points
  per IP, at most 12. One table covers spending at creation and after play.
- **Shaping costs 20 IP**, stated where characters are built (step 5) and on
  the Shaping page. Only a human can afford it at the start, by trading 50 skill
  points, as in the full rules.
- **Talents show their cost and requirement**, printed from each Talent's rules
  file, in one alphabetical list. Shaping cell costs moved to the Shaping page.
- **Page 4** gains Mara, a worked example of attributes and skills.

## Automated checks: passed

- **Compatibility:** 315 checks against `src/content/rules/` (282 in v01): the
  v01 tables, plus each ancestry's ability cost and the 26 Talents whose costs
  and requirements Lite prints.
- **Layout:** no overflow on any page; text at least 9.5 pt (licence 7.2 pt);
  every page at least 4 mm above its footer.
- **Accessibility:** no automated WCAG 2 A/AA violations.
- **PDF (`verify.py v02`):** 13 A4 pages, complete selectable text, embedded
  fonts, one folio each, cover art present.
- No page still uses the word "edge".

## Visual inspection: passed

All 13 pages were rasterised at 100 dpi. Pages 4, 5 and 10 were inspected in
full after the change; the others' text and layout are unchanged from v01.

## Decisions for the designer

1. **Format:** A4 is recommended; A5 can follow from the same source.
2. **Talent list:** Lite lists 20 Talents. Any other full-rules Talent can be
   bought at its cost from the full rules.
3. **Not in Lite:** rituals, enchanting, the learned Shaping adjustments,
   Counter, calling beings, Spirit Combat, mass combat, ships and random
   characteristics.
