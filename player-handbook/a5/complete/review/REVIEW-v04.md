# Expanded handbook v04 review

Date: 9 September 2026. Status: **ready for user review**, not published and not
physically print-and-punch tested. Earlier editions are preserved. The approved
core and Shaping reference cards were not modified by this task.

## Deliverables and source

- Reading: 68 half-A4/A5-format pages, including cover and two legal pages.
- Print: 34 A4 landscape sides, 17 duplex sheets, collating to 34 A5 leaves.
- Editable source: one Markdown file per player page, ordered by `edition.json`.
- Typesetting: local Markdown → HTML/CSS → Chrome PDF; ReportLab legal appendix;
  pypdf assembly, bookmarks and cut-and-stack imposition.

This is the current **working-tree** rules snapshot, not a claim that every
source is committed. Canonical source and art hashes are in `manifest-v04.json`.
The handbook includes the working Steady Casting and Shaping Expertise revisions.
No canonical rules were changed for this handbook update.

## Automated checks: passed

- All 23 original mundane draft modules retained in the composition.
- All 55 current Talents represented once; exact name, cost, prerequisites and
  activation metadata match their canonical frontmatter.
- All 24 general skills: 27 own/other base rows match character creation;
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
- Every measured PDF text clearance is approximately 15 mm on its binding edge.
- All player text fragments survive reading-PDF generation and print imposition.
- The complete existing licence text is verified after pagination into two pages.
- Every print slot contains its expected folio and text; simulated cut-and-stack
  collation yields pages 1 through 68, in order. All five imposition unit tests pass.
- New Markdown lint passes (47 files); changed source formatting and whitespace
  checks pass. `content-checks-v04.json` and `production-v04.json` hold the results.

## Visual inspection: passed

Rendered the **final PDFs**, not only the browser candidates, using Poppler:
110 dpi reading pages and 90 dpi print sides. Inspected all 68 reading pages
through 12 numbered contact sheets and all 34 print sides through six contact
sheets. Reopened reading pages 9, 13, 51, 52, 55, 59, 66 and 67 at full render
size to inspect dense tables, creation arithmetic, Shaping examples, Counter,
footer clearance and legal typography.

No clipping, overlapping text, missing artwork, broken glyphs or unexpected
blank pages were observed. The final style retains the existing palette,
typography, editable diagrams and website/handbook artwork. Dense pages were
shortened or their table padding adjusted; rules type was not reduced.

There are no sheet/front/back/cutting labels or pregenerated-edition footers.
Only front-side centre cut lines are present in the imposed PDF. Each page has
one folio. Shaping worked builds follow the dial lookups; skills occupy separate
rows; magical Talents appear with the Shaping chapter.

## Physical review still required

Print at actual size, A4 landscape, short-edge duplex; do not add Booklet mode.
Test one sheet first. Stack all 17 sheets in order, fronts up, cut in half,
place the entire left pile over the right pile, then check folios before punching
the left edge. Confirm the 15 mm clearance against the actual punch. No physical
print, paper-stock, duplex-registration or spiral-folding test was performed.
