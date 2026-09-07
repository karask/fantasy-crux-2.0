"""Verify the grapple update and make contact sheets of final PDF renders."""

from pathlib import Path
import json
from PIL import Image, ImageDraw
from pypdf import PdfReader

HERE = Path(__file__).resolve().parent
HANDBOOK = HERE.parents[2]
PDF = HERE.parent / "output/pdf"
CARDS = HANDBOOK / "reference-cards"


def changed_pages(before, after):
    old, new = PdfReader(before), PdfReader(after)
    assert len(old.pages) == len(new.pages)
    return [i for i, (a, b) in enumerate(zip(old.pages, new.pages), 1)
            if a.extract_text() != b.extract_text()]


assert changed_pages(PDF / "fantasy-crux-player-handbook-v02-reading.pdf",
                     PDF / "fantasy-crux-player-handbook-v03-reading.pdf") == [11]
assert changed_pages(PDF / "fantasy-crux-player-handbook-v02-a4-cut-stack.pdf",
                     PDF / "fantasy-crux-player-handbook-v03-a4-cut-stack.pdf") == [11]
assert changed_pages(CARDS / "output/pdf/fantasy-crux-player-reference-cards-v04.pdf",
                     CARDS / "output/pdf/fantasy-crux-player-reference-cards-v05.pdf") == [2]

for file, index in [
    (PDF / "fantasy-crux-player-handbook-v03-reading.pdf", 10),
    (PDF / "fantasy-crux-player-handbook-v03-a4-cut-stack.pdf", 10),
    (CARDS / "output/pdf/fantasy-crux-player-reference-cards-v05.pdf", 1),
]:
    text = " ".join(PdfReader(file).pages[index].extract_text().split())
    assert "one eligible Reaction" in text
    assert "unopposed" in text
    assert "target spends no Reaction" not in text
    assert "costs the target no Reaction" not in text

for prefix, expected, thumb_width in [("v03-reading", 24, 420), ("v03-print", 12, 500)]:
    files = sorted(HERE.glob(f"{prefix}-[0-9][0-9].png"))
    assert len(files) == expected
    for start in range(0, len(files), 6):
        thumbs = []
        for file in files[start:start + 6]:
            with Image.open(file) as page:
                height = round(page.height * thumb_width / page.width)
                thumbs.append(page.convert("RGB").resize((thumb_width, height)))
        cell_width, cell_height = thumb_width + 16, thumbs[0].height + 32
        sheet = Image.new("RGB", (cell_width * 3, cell_height * 2), "#c4c4c4")
        draw = ImageDraw.Draw(sheet)
        for index, thumb in enumerate(thumbs):
            x, y = (index % 3) * cell_width, (index // 3) * cell_height
            sheet.paste(thumb, (x + 8, y + 24))
            draw.text((x + 8, y + 6), f"{prefix}: {start + index + 1}", fill="black")
        sheet.save(HERE / f"{prefix}-contact-{start // 6 + 1}.png")

print(json.dumps({"readingPages": 24, "printSides": 12, "referencePages": 3,
                  "onlyChangedReadingPage": 11, "onlyChangedPrintSide": 11,
                  "onlyChangedReferencePage": 2, "grappleTextVerified": True}, indent=2))
