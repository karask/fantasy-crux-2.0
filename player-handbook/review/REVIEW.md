# First prototype review

6 September 2026 · awaiting user review.

## Delivery

The 24-page structure has an unnumbered cover draft and 23 independently editable
rules drafts. Terrain Cover, page 15, is the only completed visual prototype.
No other page artwork, complete illustrated booklet, or PDF has been produced.
The main rules, website source, and approved art library are unchanged.

Open [the review image](15-terrain-cover-v01.png) to judge the page as a whole.
The [print-sized export](15-terrain-cover-v01-print.png) preserves sharp type at
A4 size; it does not add native detail to the generated illustration. The
locally generated self-contained HTML retains selectable rules text.

## What to review

- Does the illustration feel consistent with the website's Vivid Ink artwork?
- Is it immediately clear that the archer receives the Penalty dice?
- Are the three degrees of cover distinct without needing the captions first?
- Is the type comfortable at A4 size, and is the artwork/text balance right?

This page establishes a candidate scene layout. Sequence and equipment pages
will share its typography, colours, spacing, and annotation system, but need
their own arrangements. Approval does not mean forcing every subject into this
exact three-panel layout.

## Verification

- The handbook validator passes: 23 ordered drafts, valid source paths and page
  references, separated editorial guidance, and all 24 brief skill descriptions.
- All 24 close-weapon, 12 ranged-weapon, and 5 armour rows match the canonical
  tables exactly. No other player-facing tables are included.
- All handbook Markdown passes lint; the handbook folder passes formatting.
- The existing rules licence is copied without changes.
- Render checks pass: correct canvas dimensions, loaded images and fonts,
  complete player-copy presence, no overflowing text, and footer clearance.
- Automated WCAG A/AA checks report no detectable violations in the prototype
  HTML. These do not replace the visual and editorial inspection.
- Visual inspection confirms the three exposure levels, readable annotations,
  clear actor/obstacle labels, and no collision between labels and faces or hands.
- The repository's `npm run check:deploy` passes: 150 unit tests, 96 browser
  tests, content/art validation, production build, HTML validation, and links.

`npm run check` stops at pre-existing formatting issues in these unchanged files:

- `art/archive/provenance/legacy-docs/art-direction-alternatives.md`
- `art/archive/provenance/legacy-docs/style-studies-README.md`
- `potential-worlds/the-crownless-realms/the-crownless-realms.md`

They were left untouched. The remaining checks were run separately and passed.
The sandbox initially blocked a unit-test child process; the successful run used
the approved local execution environment, as did the Chrome renderer.

## Remaining production boundary

Refine this prototype in response to the user's review before producing any
other page art. Dense page drafts still need their individual typesetting and
visual checks. Confirm that the supplied pregenerated sheets already include
their listed armour's Combat Order adjustment, as the handbook assumes.
