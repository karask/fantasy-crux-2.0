# Player's Handbook, A4 edition

The Fantasy Crux 2.0 Player's Handbook as a 32-page A4 book in two columns, laid out
with DesignCraft in the same style as the adventure booklet. **Status: v01 draft for review.**

- [Reading PDF](output/pdf/players-handbook-a4-v01.pdf) (images compressed, about 9 MB).
  The print master (PDF/X-4, about 100 MB) is rebuilt with `build.py --pdf` and is not committed.

| Pages | Chapter |
| ----: | ------- |
|   1–2 | Cover, welcome, contents |
|   3–4 | One: How to Play (tests, grades, Bonus and Penalty dice, Hero Points) |
|   5–8 | Two: Create a Character (ten steps and a worked example) |
|  9–13 | Three: Combat |
| 14–15 | Four: Wounds and Healing |
| 16–18 | Five: Adventuring |
| 19–20 | Six: Equipment |
| 21–24 | Seven: Improvement and Talents |
| 25–30 | Eight: Shaping Magic |
| 31–32 | Open Game License |

## How it differs from the A5 handbook

- No one-concept-per-page rule: chapters flow in two columns, each opening on a banner.
- Text is shorter (about 14,700 words against 19,000). Wording only: no mechanic changed.
  Where the A5 text had left out a rule that the website rules have (second grappling limb,
  weapon Parry against a grapple, Intimidate modifiers, wind and prone ranged modifiers,
  mounted combat, darkness in melee), this edition follows the website.
- Every rule picture is a diagram drawn from the rule text (`build/diagrams.py`), so the
  numbers in pictures and text always agree. Illustrations come from the Vivid Ink art library
  and carry captions that state the rule they show.
- Art edge rule, as in the adventure: crisp only where it bleeds off the trim, faded wherever
  it meets text or paper.

## Sources

- `content/*.md`: the chapters. Markers: `{{fig:name}}` places a diagram, `{{contents}}` the
  contents table, `{{panel:name}} … {{/panel}}` a full-width block (the weapon tables) placed
  where `book.json` says, and `*cost · prerequisite · type*` lines become Talent headers.
- `build/book.json`: per chapter, the banner, title, floats with captions and panels.
- `diagrams/`: SVG diagrams, their PNG renders and alt text.

## Build

Needs pandoc, Python 3 with Pillow, numpy and pypdf, Node with Playwright, the DesignCraft CLI
(`$DESIGNCRAFT`, default `~/dc/target/release/designcraft-cli`) and the fonts EB Garamond,
Cinzel, Cinzel Decorative and IM FELL English SC.

```sh
cd build
python3 prep_art.py                      # page textures and faded art -> build/img/
python3 diagrams.py && node render_diagrams.mjs 5   # diagrams -> ../diagrams/
python3 build.py                         # lay out every chapter (or: build.py ch3 ch4)
python3 render.py 0.8                    # page and spread previews -> build/work/
python3 build.py --pdf                   # PDF/X-4 master -> build/work/handbook-full.pdf
python3 shrink.py work/handbook-full.pdf ../output/pdf/players-handbook-a4-v01.pdf
```

Run `build.py` twice after page counts change: the contents table reads the page numbers
of the previous run.
