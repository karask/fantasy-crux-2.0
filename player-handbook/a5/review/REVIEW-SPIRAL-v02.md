# A5 spiral proof verification

6 September 2026. Candidate v02 is ready for user review, not approved.

## Adaptation

- The existing two-page spread is adapted for landscape A4 sheets cut in half
  and spiral bound. No additional content spread or artwork was produced.
- Rules copy and annotations match the v01 PDF composition exactly, excluding
  changed proof folios. Word counts remain 191 on the left and 174 on the right.
- Native half-A4 pages remain 148.5 by 210 mm, with 11-point rules-body text.
- The binding margin increases from 12 to 15 mm, mirrored on front and back.
  Outer margins remain 10 mm. A 3 mm tighter art frame accommodates the added
  clearance without shrinking type or dropping text.
- Each content page works independently when folded back around the spiral.
  No essential illustration, rule sequence, or label crosses the binding.
- The physical page count is no longer constrained to a multiple of four.
  Final pagination remains open; the 23 source modules remain the inventory.

## Checks passed

- Browser measurements show approximately 15.00 mm binding clearance on each
  page. Direct PDF character-position checks also confirm the mirrored margin.
- Content-to-footer gaps are approximately 6.24 mm left and 3.70 mm right.
- No text overflow, unloaded fonts, broken images, or automatically detected
  WCAG A/AA violations in the editable HTML.
- All complete rule blocks, headings, modifier labels, and footers survive PDF
  export as extractable text. The binding-only v02 render also compares these
  fragments against v01, allowing only proof-folio changes.
- The reading PDF contains two A5-format pages labelled proof 02 and 03.
- The cut-and-stack PDF contains two landscape A4 sides, front `[1, 3]`, back
  `[4, 2]`. PDF text and spatial checks verify each physical half-sheet slot.
  The content pages are placed without rasterising their text.
- Cutting and placing the left piece over the right produces leaves 1/2 and
  3/4. The generic ordering helper passes five tests, including collation of
  every page count from 1 through 128 and cases with unused print slots.
- All four exported PDF pages were rendered with Poppler and visually
  inspected. Text, margin parity, faces, arrow/shield contact, labels, footers,
  cut marks, and production instructions are clear and correctly positioned.
- The handbook validator and Markdown lint pass. Handbook formatting passes.
- The original A4 review image, v01 A5 review image, v01 reading PDF, and v01
  folding PDF retain their previous SHA-256 hashes.

Verification was scoped to the handbook adaptation. The canonical rules,
website, and approved art library were not changed; the website's full test
suite was not rerun for this layout-only revision.

## Physical review still required

Print the prepared A4 PDF at 100%, landscape, duplex with short-edge binding.
Do not add Booklet mode or another two-up transformation. Check that both sides
are upright; cut at the centre marks, stack left over right, and punch the
stack's left edge with the instruction front facing you.

The 15 mm margin is a working allowance, not a hole template or a guarantee
for every punch. Confirm it against your actual equipment before punching.
No physical printing, cutting, or binding test has been performed here.

The two instruction panels are not handbook cover proposals. Review this
spread before further content pages or illustrations are produced. The previous
folding exports remain intact for comparison, but are not the current print file.
