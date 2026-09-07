# Complete A5 spiral handbook

Revised review edition, 7 September 2026. This keeps the complete handbook while
simplifying dense procedures into direct player-facing rules. The v03 edition
includes the approved grapple-defence Reaction cost from the updated main rules.
Prior proofs are retained as superseded snapshots, not current rules. This is
not a claim of physical print approval.

## Open the handbook

- [Reading PDF, with navigation bookmarks](output/pdf/fantasy-crux-player-handbook-v03-reading.pdf)
- [A4 duplex cut-and-stack print PDF](output/pdf/fantasy-crux-player-handbook-v03-a4-cut-stack.pdf)
- [A4 player reference cards](../../reference-cards/README.md)
- [New artwork, saved prompts and provenance](art/README.md)
- [Content map and retention audit](CONTENT-MAP.md)
- [Verification record](review/REVIEW-v03.md)

There are **24 A5-format pages**: cover, 21 rules/reference pages, and two pages
containing the complete existing licence and copyright notices. PDF page numbers
match the printed folios, including the cover as 1. No filler pages were added
to meet a multiple of four.

## Print and bind

The prepared print file has **12 landscape A4 sides: six duplex sheets**.

1. Print at **actual size / 100%, A4 landscape, duplex short-edge binding**.
   Do not add Booklet mode or another two-pages-per-sheet transformation.
   Test sheet 1 first; both sides must be upright.
2. Stack sheets **1 through 6**, in that order with sheet 1 on top. Keep the
   orientation in which each sheet left the printer and align their tops.
3. Cut vertically at **148.5 mm**, following the dashed centre line printed on
   each front side.
4. Keep both piles in their existing order; put the **whole left pile on top
   of the whole right pile**. Do not alternate pieces sheet by sheet.
5. You now have **12 A5 leaves**, with pages 1/2 through 23/24 in order.
6. Check all page pairs before punching. With the cover facing you, punch the
   stack's **left edge** and add the spiral.

Finished size is **148.5 × 210 mm**, half A4. The binding margin is mirrored:
15 mm on the left of odd/front pages and right of even/back pages. Outer margin
is 10 mm. The 15 mm allowance is **not a hole template**; check your punch or
print shop's requirements first. No physical print-and-punch test was performed.
There are no production labels on the artwork. If your printer reverses output
order, restore sheet order by checking the page pairs before cutting.

Rules text is 11 pt; equipment tables are 10 pt. The licence appendix is 7.2 pt.
PDF text remains selectable; illustrations are embedded. The 180 dpi individual
page PNGs are convenient review images; use the PDF for printing.

## Refine individual pages

Most condensed copy lives in `content/`, one Markdown file per finished page.
The two existing ranged pages still read `../content/ranged-attacks.md` and
`../content/cover-and-defence.md`; there is no duplicate copy to drift.
Frontmatter selects artwork and diagrams. `## Editorial notes` separates
production guidance from player copy and is never printed.

`book.css` holds the shared print design; `diagrams.mjs` holds native, exact
number/label diagrams. The two new scenes are permanent local files in `art/`.
Other art is reused from the existing website library or preserved prototype.
No rule text was generated inside an illustration.

## Reproduce and verify

From the repository root:

```sh
node player-handbook/validate.mjs
node player-handbook/a5/complete/render.mjs v03
python3 -B player-handbook/a5/complete/assemble.py v03
python3 -B player-handbook/a5/test_cut_stack.py
```

Use the installed Chrome/Playwright dependencies. The Python assembler needs
ReportLab, pypdf and pdfplumber. On this machine the bundled interpreter is
`/home/kos/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`.
Use a new version number for later review editions.

The renderer checks every draft module, source provenance, all 24 skill names,
equipment values, exclusions, page references, font sizes, margins, overflow,
fonts/images and automated HTML accessibility. The assembler checks extracted
text, the complete licence, PDF dimensions, actual punch clearances and every
physical cut-and-stack slot. Rerender and visually inspect all final PDF pages
after layout changes; automated text extraction does not replace visual review.

The final PDFs live in `output/pdf/`; temporary intermediate PDFs live in
`tmp/pdfs/`. The source licence in `../../LICENSE.md` remains unchanged and is
included in both final PDFs. The website publishes the approved reference cards;
these handbook proofs remain review files in the repository.
