# Handbook v05 review

Date: 15 October 2026. Status: **ready for user review**, not published and not
physically print-and-punch tested. Earlier editions are preserved. The core and
Shaping reference cards were updated in a companion change (core v06, Shaping v05).

## What changed since v04

v05 brings the handbook in line with the plain-English rewrite of the website
rules (karask/fantasy-crux-2.0#8 and #9). The page order, page count, artwork
and print format are unchanged.

### Wording

Every page was reread against its website source and reworded where the website
now says it more plainly. Game terms are unchanged and used consistently.
Permission "may" is now "can" throughout. The defence page is rebuilt around the
website's "Which defence works?" table, and Defend Against Magic now opens with
the opposed test.

### Rulings made during the website rewrite

- The extra off-hand Reaction can be an Active Guard; both penalties apply
  (pages 18 and 22).
- Withdraw keeps your base Reaction and any extra off-hand Reaction (page 19).
- Higher ground and being prone change that character's own roll. A prone
  defender gives the attacker +1B and takes -1P on its Reaction (page 23).
- Intimidate: the GM judges how the enemy gives way. Wounded enemies may flee
  or surrender; healthy ones rarely flee and more often hesitate and lose a
  turn (page 24).
- Halves round up for a partial Parry or guard (pages 16 and 57).
- Dispel is opposed by a fresh Shaping check rolled for the original caster,
  using their current unmodified skill (page 58).

### Rules that changed on the website after v04

- Engineering is merged into Mechanisms: 23 general skills (pages 10 and 46).
- Racial maxima follow the current ancestry table (page 6).
- Deadly Precision is added (page 37), so the catalogue has 56 Talents.
- Summon & Call a Being is rewritten: standing orders, the conjured-being
  table with Size, and calling by Threat Intensity (page 63).
- Ward harm classes, and only one HP-restoring Shaping helps a subject before
  its next full rest (page 53).
- An unwilling subject under active control moves at most 3 m per round
  (page 55).
- Shaped fire deals its damage once; only fire it lights in mundane fuel
  burns on (page 31).
- One-use enchanted items such as potions and scrolls (page 66).

### Diagrams

The nine HTML card diagrams from `diagrams.mjs` are replaced by SVG diagrams
drawn with the website's diagram kit (`scripts/diagrams/handbook.mjs`, built
into `diagrams/` by `npm run diagrams:build` and checked by
`npm run diagrams:check`). They are wide, shallow print versions of the website
set: D100 grades (page 3), Bonus/Penalty dice (4), skill pools (11), round costs
(15), damage steps (17), the Dying countdown (25), crossbow reloads (34), the
Magnitude formula (51) and the active Magnitude limit (58). Each has alt text
that states its rule.

As on the website, the text is the rule. Three pages gained prose for facts
that only the old diagrams carried: crossbow reload costs (page 34), the four
pool sizes (page 11), and where Withdraw, Sprint and Charge are explained
(page 15). The unused card-diagram styles were removed from `book.css`.

## Automated checks: passed

- All 23 original mundane draft modules retained in the composition.
- All 56 current Talents represented once; exact name, cost, prerequisites and
  activation metadata match their canonical frontmatter.
- All 23 general skills: 26 own/other base rows match character creation;
  Shaping's INT + POW base and access restriction are present separately.
- Six ancestry starting spreads and six racial-maximum rows match their source.
- The Ilan example spends 86 characteristic points, pools 50/50/50/75 and 10 IP.
  Its selected skill totals, HP 13, MWL 7, PP 10, DM +1D4, Combat Order 13 and
  carrying capacity 26 were independently recalculated.
- The starting Shaper's full-price trade budget and M3/M5/M6 build arithmetic pass.
- All 24 close-weapon, 12 ranged-weapon and five armour profiles match sources.
- Page references resolve, font assets load, images load, and there are no
  reported WCAG 2 A/AA violations in the automated HTML check.
- All 66 player pages fit: no overlap/overflow, at least 2 mm before the footer,
  11 pt body, 10 pt tables and 10 pt Talent metadata. Legal body remains 7.2 pt.
- New check: diagram text prints at 10.2 pt or more, and uppercase diagram
  labels at 9.2 pt or more (floors: 10 pt and 9 pt).
- Every measured PDF text clearance is approximately 15 mm on its binding edge.
- All player text fragments survive reading-PDF generation and print imposition.
- The complete existing licence text is verified after pagination into two pages.
- Every print slot contains its expected folio and text; simulated cut-and-stack
  collation yields pages 1 through 68, in order. All five imposition unit tests pass.
- Markdown lint passes on all 67 page files; changed files pass Prettier.
  `content-checks-v05.json` and `production-v05.json` hold the results.

`node player-handbook/validate.mjs`, which guards the 23 historical draft pages,
fails on `pages/08-damage-and-critical-hits.md`. That draft gained the word
"Talent" in commit 75b39d7 (13 September 2026), before this edition; v05 does
not change the draft pages.

## Visual inspection: passed

Rendered the **final PDFs**, not only the browser candidates, using Poppler:
110 dpi reading pages and 90 dpi print sides. Inspected all 68 reading pages
through 12 numbered contact sheets and all 34 print sides through six contact
sheets. Reopened every page with a diagram (3, 4, 11, 15, 17, 25, 34, 51, 58) at
full render size, plus the rewritten pages 16, 18 and 63.

No clipping, overlapping text, missing artwork, broken glyphs or unexpected
blank pages were observed. Body and table type were not reduced; dense pages
were shortened instead.

## Physical review still required

Print at actual size, A4 landscape, short-edge duplex; do not add Booklet mode.
Test one sheet first. Stack all 17 sheets in order, fronts up, cut in half,
place the entire left pile over the right pile, then check folios before punching
the left edge. Confirm the 15 mm clearance against the actual punch. No physical
print, paper-stock, duplex-registration or spiral-folding test was performed.
