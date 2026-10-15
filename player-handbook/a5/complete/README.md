# Complete A5 spiral handbook

Expanded review edition **v04, 9 September 2026**. A player can now create a
character from scratch, play, improve, choose Talents and use Shaping. The guide
keeps short, subject-led pages and the established visual design. It is a
player-facing adaptation of the current working rules, not a replacement for
their authoritative text. Earlier PDFs remain intact as historical snapshots.

## Open the handbook

- [Reading PDF, with navigation bookmarks](output/pdf/fantasy-crux-player-handbook-v04-reading.pdf)
- [A4 duplex cut-and-stack print PDF](output/pdf/fantasy-crux-player-handbook-v04-a4-cut-stack.pdf)
- [Page map and scope](CONTENT-MAP.md)
- [Verification record](review/REVIEW-v04.md)
- [Core reference cards](../../reference-cards/README.md)
- [Shaping reference cards](../../shaping-reference-cards/README.md)
- [Artwork provenance](art/README.md)

There are **68 A5-format pages**: cover, 65 player pages and two pages containing
the complete existing licence and copyright notices. PDF page numbers match
the printed folios, including the cover as 1. No filler pages were added.
This handbook update does not change or publish either approved reference card.

## Print and bind

The print file has **34 landscape A4 sides: 17 duplex sheets**.

1. Print at **actual size / 100%, A4 landscape, duplex short-edge binding**.
   Do not add Booklet mode or another two-pages-per-sheet transformation.
   Test sheet 1 first; both sides must be upright.
2. Stack sheets **1 through 17**, in order with sheet 1 on top and fronts up.
   Keep their tops aligned.
3. Cut vertically at **148.5 mm**, following the dashed centre line printed on
   each front side.
4. Keep both piles in their existing order; put the **whole left pile on top
   of the whole right pile**. Do not alternate pieces sheet by sheet.
5. You now have **34 A5 leaves**, with pages 1/2 through 67/68 in order.
6. Check all page pairs before punching. With the cover facing you, punch the
   stack's **left edge** and add the spiral.

Finished size is **148.5 × 210 mm**, half A4. The binding margin is mirrored:
15 mm on the left of odd/front pages and right of even/back pages. Outer margin
is 10 mm. This allowance is **not a hole template**; check your punch or print
shop's requirements first. No physical print-and-punch test was performed.
There are no production labels on the pages. If your printer reverses output
order, restore sheet order before cutting.

Rules text is 11 pt; tables and Talent metadata are 10 pt. The licence is 7.2 pt.
Text remains selectable and illustrations are embedded. Use the PDF for printing.

## Refine individual pages

`edition.json` controls page order, stable IDs and chapter labels. Existing
condensed copy lives in `content/`; new subjects live in `content/expanded/`.
There is one Markdown file per player page. The two ranged pages still read
`../content/ranged-attacks.md` and `../content/cover-and-defence.md` directly.
`## Editorial notes` separates production guidance from player copy and never prints.

Frontmatter selects artwork, diagrams, canonical sources and Talent slugs.
The renderer inserts each Talent's exact cost, prerequisites and activation
from its canonical frontmatter; its concise player explanation stays editable.
Use `{{ref:page-id}}` for automatic page references. Legacy numeric references
are remapped through their previous folios.

`book.css` holds the shared print design; `diagrams.mjs` contains editable diagrams.
The artwork is reused from the website, existing handbook masters and prototype.
Rules and labels are not baked into AI images. No new illustrations were needed
for this edition. All source and asset hashes are recorded in the manifest.

## Reproduce and verify

From the repository root:

```sh
node player-handbook/validate.mjs
node player-handbook/a5/complete/render.mjs v04
node player-handbook/a5/complete/verify.mjs v04
python3 -B player-handbook/a5/complete/assemble.py v04
python3 -B player-handbook/a5/test_cut_stack.py
pdftoppm -r 110 -png player-handbook/a5/complete/output/pdf/fantasy-crux-player-handbook-v04-reading.pdf player-handbook/a5/complete/tmp/pdfs/v04-reading
pdftoppm -r 90 -png player-handbook/a5/complete/output/pdf/fantasy-crux-player-handbook-v04-a4-cut-stack.pdf player-handbook/a5/complete/tmp/pdfs/v04-print
python3 -B player-handbook/a5/complete/review/contact-sheets.py v04
```

The renderer uses installed Chrome/Playwright dependencies. Python needs
ReportLab, pypdf, pdfplumber and Pillow. On this machine the bundled interpreter is
`/home/kos/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`.
Use a new version number for later review editions.

Checks cover original module retention, all 55 current Talents, all general
skill bases, ancestry point spreads/maxima, the worked creation example,
equipment values, source hashes, page references, font sizes, binding margins,
overflow, fonts/images and automated HTML accessibility. The assembler checks
all player text survives, the complete two-page licence, dimensions, actual
text clearances and every physical cut-and-stack slot. Always visually inspect
all final PDF pages too; extraction does not replace visual review.

Final PDFs are in `output/pdf/`; intermediates and final-page renders are in
`tmp/pdfs/`. The unchanged source licence is `../../LICENSE.md`. These are local
review deliverables: this update neither commits nor publishes the handbook.
