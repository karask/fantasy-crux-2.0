# Character sheet review

Illustrated edition v2, reviewed 13 September 2026. Four final A4 PDFs, seven pages each.

## Delivery checks

- Rendered and visually reviewed all 28 final pages, including each design's
  portrait arrangement, skill ordering, talent layout, equipment ledger,
  Shaping record, four common-spell cards and journal.
- Checked representative full-size pages and filled proofs for numeric fields,
  checkboxes, wide and tall talent cards, and multiline common-spell entries.
- All 26 general-skill templates are present, plus optional Shaping and extra
  subject rows. The base formulas follow the canonical character-creation tables.
- All PC-entered values begin empty. All condition checkboxes begin unchecked.
- The canonical field tree and page widgets agree. No fields intersect one
  another, and every widget is inside the A4 page and marked printable.
- Saved and reopened all 2,137 fields across all four PDFs. Every stored value
  matched both its canonical field and page widget; text appearances and checked
  checkbox appearances were present.
- Each file has seven page bookmarks and embeds an exact copy of the repository
  Open Game License 1.0a.

The detailed machine checks are in `checks.json`. `manifest.json` records field
names, geometry, labels, section placement, artwork placements and the content
transform. Widget coordinates are physical page coordinates; body labels and
art placements use the recorded transform. The four contact images show
every page; `four-designs.png` compares the first pages.

## Behaviour and practical limits

The forms support typing, saving and handwriting. Calculations are manual.
Portrait frames accept a drawing or an image placed with a PDF editor; they are
not image-upload form buttons. Multiline fields use the PDF reader's normal
wrapping. The test writer uses explicit line breaks when creating saved proofs.

Custom Vivid Ink raster illustrations now appear throughout all four folios:
four page surrounds, four portrait frames, writing panels and quill dividers,
and ruby-heart, amethyst, breastplate and hero-medallion stat holders. Stat
values sit inside the emblems' blank white centres. Portraits remain empty.

Border refinements remove large lower-corner subjects so the last rows stay
clear. Resource emblems retain their proportions and have isolated atlas crops.
The Starweaver portrait's unused top gutter is clipped to exclude a cloth tip
from the adjacent atlas subject. Multiline note and spell areas are unruled,
allowing typed paragraphs to wrap without crossing printed rules.

The built-in ImageGen tool produced the new source artwork. Exact prompts and
source paths are recorded in `../assets/illustrated-v2/manifest.json`; originals
and local copies are preserved. Final surrounds use v4, the resource atlas uses
v3, and the portrait/panel atlases use v2.

## Repository check

`npm run check` was attempted and stopped in its formatting stage with 153
warnings in existing adventure, handbook, archived-art and temporary files.
There were no formatting warnings under `character-sheets/`. No unrelated
files were changed. For this illustrated revision, only the character-sheet
documentation and JSON were formatted; the dedicated PDF verification was
rerun after the final artwork and layout changes.
