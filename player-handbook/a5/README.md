# A5 spiral-bound handbook prototype

The [complete 26-page handbook](complete/README.md) now supersedes this
two-page format test. This page documents the preserved prototype only.

Status: v02 adapts the existing two-page spread for cutting A4 in half and spiral
binding. It is ready for user review, not approved. Rules copy and artwork are
unchanged; only this spread is typeset. The final handbook page count remains open.

## Review files

- [Current two-page preview](review/ranged-spread-v02.png)
- [Reading PDF: two A5-format pages](output/pdf/ranged-spread-v02-reading.pdf)
- [A4 cut-and-stack proof: one sheet, printed both sides](output/pdf/a4-cut-stack-v02.pdf)
- [Editable left-page copy](content/ranged-attacks.md)
- [Editable right-page copy](content/cover-and-defence.md)
- [Existing artwork and saved generation prompt](art/BRIEF.md)
- [Spiral verification record](review/REVIEW-SPIRAL-v02.md)

The left page covers taking a ranged shot, Range, Aim, damage and Close use,
shooting into a crowd, and a worked modifier example. The right page combines
terrain cover with Dodge and Active Guard, including readiness, critical results,
and extra off-hand Reactions. It incorporates original draft modules 14–16.

Other ranged circumstances and weapon/reload profiles remain in their original
modules, not silently removed. The legacy 23 files remain the content inventory;
their old page references will be resolved when the full handbook is repaginated.

Superseded v01 exports may remain in local generated-output folders for
comparison. They are not published; do not use the old folding PDF for the new
cut-and-stack workflow.

## Physical format

Each finished page is **148.5 × 210 mm**, exactly half landscape A4 (nominal A5).
The design keeps native 11-point body text and 10 mm outer margins, with a wider
**15 mm binding margin**. Mirror it: left on odd/front pages, right on even/back
pages. This is a working allowance, not a hole template. Confirm the required
clearance with your punch or print shop before punching.

The v02 spiral override frames the illustrations 3 mm more tightly to make room
for the wider margin without shrinking type or removing rules. Each page works
independently when the spiral is folded back; no essential diagram crosses the
binding. Complete cover remains a sentence, not an extra panel.

The reading PDF contains only the two content pages, labelled **SPIRAL PROOF 02**
and **03**, not final folios. Use the prepared A4 proof for the physical test:
printing the two-page reading file back-to-back would give it the wrong parity.

## Printing, cutting, and binding the proof

1. Choose **A4 landscape, actual size / 100%, double-sided, short-edge binding**.
   Do not apply Booklet mode or two-pages-per-sheet again; the PDF is already
   arranged. Check the printer preview and start with this one-sheet test.
2. Place the printed sheet with the instruction front on the left and
   Cover & Defence on the right, face up. Both sides must be upright.
3. Cut vertically at **148.5 mm**, along the centre marks. Do not fold the sheet.
4. Put the **left piece on top of the right piece**, with both tops aligned.
5. Check the backs: the instruction front has Take the Shot behind it;
   Cover & Defence has the review checklist behind it.
6. With the instruction front facing you, punch the stack's **left edge** and
   add the spiral. In the middle, Take the Shot faces Cover & Defence.

The two A4 sides use this order:

- Front: **1, instruction front | 3, Cover & Defence**.
- Back: **4, review checklist | 2, Take the Shot**.

After cutting, the leaves are 1/2 and 3/4. The two instruction panels are not
proposed covers; they only test duplex orientation, margins, and binding.

Spiral binding does not require multiples of four. The four-page proof is
convenient for a single-sheet test, not a final pagination rule. An odd number
of printed faces can leave a blank reverse; unused half-sheet slots need not
be bound into the handbook.

For a future multi-sheet export, `cut_stack.py` computes a cut-and-stack order
that also handles unused slots. Arrange numbered sheets in order with fronts
up, cut the stack vertically, keep each pile in order, and place the entire
left pile on top of the right pile. Do not substitute ordinary sequential
two-up pages; their backs and stack order differ.

## Reproduction

From the repository root:

```sh
node player-handbook/a5/render.mjs v02 spiral
python3 -B player-handbook/a5/build_spiral_proof.py v02
python3 -B player-handbook/a5/test_cut_stack.py
```

The Python builder needs ReportLab, pypdf, and pdfplumber. On this workstation
the bundled interpreter is
`/home/kos/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`.
The renderer and spiral builder default to v02. Use a new version for later
revisions; preserve the source artwork and previous exports.

The renderer uses the existing browser/typesetting pipeline for the A5 reading
PDF. ReportLab creates the instruction panels; pypdf places the original pages
without rasterising their text. Text extraction and spatial checks verify the
mirrored clearances and A4 order `[1, 3]` then `[4, 2]`. The instruction panels
use embedded Bitstream Vera fonts, with their licence notice in PDF metadata.
The imposition tests cover page counts 1–128, including unused print slots.

Legacy reproduction remains available through `render.mjs v01 fold` and
`build_fold_proof.py v01`; do not run those to produce the current spiral proof.

## Acceptance and boundary

Check the rules at actual A5 size, actor/modifier clarity, the art-to-text balance,
and the punch-safe margin. Automated checks require 11-point body copy, no
overflow, unchanged copy, full text retained in the PDF, correct page dimensions
and cut-and-stack order, loaded fonts/images, and no automatically detected
WCAG A/AA violations in HTML. PDF pages must also be rendered and visually
inspected before delivery. A physical print-and-punch test is still required.

The first A4 Terrain Cover prototype, v01 folding exports, main rules, and
website art library remain unchanged. No additional illustration is generated
for this adaptation. Review this spread before creating the next.
The existing [rules licence](../LICENSE.md) must accompany distribution; include
it in the physical page count if it is bound into the handbook.
