# Mobile reading edition

The phone edition combines the campaign, complete linked introductory adventures, referenced creature profiles, and the existing Open Game License into one bookmarked PDF. Wide tables become labelled entries, and the adventure connection graph becomes a readable connection list. The main campaign Markdown remains authoritative.

Output: `output/pdf/seven-bells-for-no-king-mobile.pdf` at repository root.

To read on a phone, copy that PDF to your own cloud drive or transfer it directly to the phone, then save an offline copy in a PDF reader. The entire PDF contains GM spoilers; only the campaign's separate player-primer Markdown is safe to share with players before play.

Run from the repository root with Node and the bundled Python runtime (ReportLab and pypdf):

```sh
node adventures/seven-bells-for-no-king/mobile/prepare.mjs
python3 adventures/seven-bells-for-no-king/mobile/build_pdf.py
```

Temporary input data and review images live under `tmp/pdfs/seven-bells-mobile/`. References included in the PDF use internal links; other rules references point to the published Fantasy Crux rules and need an internet connection. Local source-only references that have no embedded destination remain readable labels.

The delivered edition has 424 small-format pages and is approximately 746 KB. All pages were rendered and visually reviewed in contact sheets, with larger detail checks. The page-boundary scan found no overflowing text or empty pages; the PDF contains all fifteen campaign adventure identifiers and a linked contents page with document bookmarks.
