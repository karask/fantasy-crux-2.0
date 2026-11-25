# Gamemaster editions

A4 PDFs of the one-shot adventures, typeset from their Markdown files. The Markdown stays the only source: edit the adventure, then render again.

```sh
PYTHON=/path/to/python node adventures/print/render.mjs twelve-below
PYTHON=/path/to/python node adventures/print/render.mjs the-last-errand
PYTHON=/path/to/python node adventures/print/render.mjs lullaby-for-a-dragon
```

Run from the repository root. `PYTHON` must have pypdf, pypdfium2 and Pillow. The PDFs are written to `output/pdf/<adventure>-gm.pdf`.

## What each edition contains

1. A cover, drawn in [editions.mjs](editions.mjs).
2. Contents, with page numbers taken from the PDF's own outline after a first pass, and the edition and Open Game Content notice.
3. The GM chapters in the order the edition lists them, each from one Markdown file. Links between the files become links inside the PDF; links to the rules point at fantasycrux.org; links to repository-only documents keep their words and lose the link.
4. The GM maps, on landscape pages.
5. **Print and play:** the player brief and every handout again, without their GM notes, styled as props: a ledger or a letter in handwriting, a brass plate, a stamped bill, a carved inscription, a sealed proclamation, a seal ribbon, a printed song sheet, a track of boxes and cut-out tokens. Each sheet is one page.
6. The complete Open Game License, with the adventure's own copyright line added to Section 15.

## Checks

The render stops if any check fails.

- Every internal link has a target, and no id repeats.
- The browser shows every word of every chapter, compared with the Markdown as rendered.
- At the printed measure, nothing is wider than the page and no text is below 9 pt, except the licence.
- No WCAG 2 A or AA violations (axe), and every font loads.
- [verify.py](verify.py) checks the PDF itself:
  - pages are A4 portrait, except the landscape maps, and fonts are embedded as real fonts;
  - every visible block of text and the whole licence reached the PDF;
  - the contents page numbers match the outline;
  - every print-and-play sheet fits on one page.

Review files go to `review/<adventure>/`: the HTML, the first-pass PDF, `pdf-checks.json`, a PNG of every page and contact sheets. Look at the contact sheets after any change; the checks cannot judge a heading stranded at the foot of a page.

## Adding an adventure

Add an entry to [editions.mjs](editions.mjs). The handouts file must keep its pattern: one `##` section per handout, an optional first paragraph in italics for the GM, then the prop as a block quote or a fenced block. Choose a handout kind from the list at the top of `editions.mjs`, or add one to `render.mjs` and `adventure.css`.

Fonts: Barlow Condensed, Atkinson Hyperlegible and IBM Plex Mono come from `node_modules`; Noto Serif from the system's `/usr/share/fonts/truetype/noto`; [Kalam](fonts/Kalam-OFL.txt) is included under the SIL Open Font License.
