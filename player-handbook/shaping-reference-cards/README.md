# Shaping reference cards

Three A4 player reference pages, matching the approved core reference cards.
Version v03 is approved for publication, with independently editable Markdown for each card.

## Open and print

[Shaping reference cards v03](output/pdf/fantasy-crux-shaping-reference-cards-v03.pdf)

Print at **100% / actual size on A4**, as three separate cards. For duplex,
use long-edge binding: cards 1 and 2 share a sheet; card 3 has a blank reverse.
The footer has only SHAPING and one card number. Browser print labels are disabled.

## Organisation

1. **Build a Shaping:** known cells, Practice / Tell, an early explanation of
   Intensity, formula, expertise limits, common Range / Duration / Reach ratings,
   ritual threshold, then two worked examples across the bottom of the page.
2. **Effects & Defences:** common outcome benchmarks including strong conditions, healing,
   opposed defence, Projected / Direct Harm, cover and shield Impact Size.
3. **Cast & Sustain:** turn procedure, touch delivery, overreach, PP payment and
   recovery, Active Magnitude with an INT 10 example, concentration, a concrete
   escape example, Sense Magic, Dispel and commands.

Version v03 explicitly places the free condition retry at the end of the affected
subject's own turn, after its restrictions, without restoring missed Actions.
It retains v02's teaching order, examples and Counter clarification. Earlier
versioned PDFs and HTML/check records are superseded snapshots for comparison.

The initial two-page draft overflowed at the core cards' approved type sizes.
Three pages retain **10 pt body text / 9.5 pt tables** and separate the build,
effect and casting lookups. No new illustrations are needed for these compact tables.

## Scope and sources

These are player reminders for ordinary Shaping with known cells already on a
character sheet. Each content file lists its canonical source paths. They use
the **current working rules**, including the accepted 7 September change to
permanent, unmodified **INT** as the Active Magnitude limit.

The cards intentionally abridge the full rules. They omit creation and
advancement, the sixty-cell catalogue, individual Talent rules and adjustment
costs, ritual dial tables and ritual/contributor/mythic-price procedures,
indefinite PP commitments, enchantments, summon profiles, and specialist
Paths/Fate/illusion/restoration rulings. A player's unusual capabilities belong
on their character or effect sheet. Backlash is a short risk reminder; the GM
resolves its table. The full Shaping chapter remains authoritative.

The website [Downloads section](https://fantasycrux.org/downloads/) offers this
approved set alongside the core cards. `src/_data/downloads.mjs` selects v03 and
publishes it at the stable URL
[Shaping Reference Cards PDF](https://fantasycrux.org/downloads/fantasy-crux-shaping-reference-cards.pdf).

## Rebuild

```sh
node player-handbook/shaping-reference-cards/render.mjs v03
python3 -B player-handbook/shaping-reference-cards/verify.py v03
pdftoppm -r 144 -png player-handbook/shaping-reference-cards/output/pdf/fantasy-crux-shaping-reference-cards-v03.pdf player-handbook/shaping-reference-cards/tmp/pdfs/shaping-v03
```

Use the bundled Python runtime if system Python lacks pypdf or pdfplumber.
The renderer reads the existing core-card CSS and adds only local table widths
and section accents. HTML previews and verification records live in `review/`;
PDF page rasters live in `tmp/pdfs/` for inspection. Markdown is the copy source,
and the final PDF has selectable text and embedded fonts. Rerender and inspect
all pages after edits.
