# Illustrated GM edition

Run `build_pdf.py` with the workspace Python runtime (ReportLab, Pillow and pypdf). It reads `booklet.md`, uses local art and fonts, and writes `output/pdf/the-dragon-at-the-horse-fair-gm.pdf` at the repository root.

The edition is 17 A4 pages. Sections flow continuously; the NPC appendix, printable handouts and legal notices begin on fresh pages. The GM booklet contains no PC sheets or company formation story. Build the separate player packet with `pregenerated-characters/pdf/build_packet.py`.

`assets/revision-2026-09-13-prompts.json` records the latest reference-image edits. Existing portraits and other illustrations are retained. `review/` contains layout and final verification records. `download-site/` hosts both PDF downloads on the existing private site.
