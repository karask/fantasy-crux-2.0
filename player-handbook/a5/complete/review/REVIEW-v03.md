# Handbook v03: paid grapple defence

## Rule change

The initial grapple's Dodge or Parry now spends one eligible Reaction. Dodge
uses the base Reaction and its once-per-round limit. Without a defence Reaction,
the attacker must succeed unopposed. Opposing escape within an existing hold
remains free. The updated main rule and ADR-024 define the complete procedure.

The handbook's condensed page 11 and original draft module 13 both reflect this
change. No artwork, equipment, licence content or page order changed.

## Verified outputs

- Reading PDF: 24 A5-format pages, including the two complete licence pages.
- Print PDF: 12 landscape A4 sides, six short-edge-duplex cut-and-stack sheets.
- The renderer passed font, image, source, equipment, layout and accessibility
  checks on all 22 player pages. Rules text remains 11 pt; punch margins remain
  15 mm. Page 11 has 21.60 mm clearance above its footer.
- The assembler verified all page text, the complete licence, page dimensions,
  binding clearances and all physical print slots. Five cut-stack tests passed.
- Rendered every final reading page at 100 dpi and every print side at 80 dpi.
  Inspected all contact sheets and the changed reading page/print side directly.
- Compared extracted text against v02: only reading page 11 and print side 11
  differ. `verify-v03.py` reproduces these checks and the contact sheets.
- Main rules and all four current player-reference copies have regression
  checks for the defence cost and undefended attempt.
- All changed source files and current generated JSON pass formatting checks.
  The repository-wide formatting check still reports five pre-existing issues
  in two archived art documents, two v02 review records and a setting document;
  these unrelated files were left untouched.

No physical print/punch test was performed. Earlier PDFs and review records are
superseded snapshots; use the v03 PDFs linked from the current handbook README.
The site's approved reference-card download is updated to v05.
