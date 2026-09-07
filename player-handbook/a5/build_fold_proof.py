"""Impose the two-page A5 review spread inside a one-sheet folding proof."""

from io import BytesIO
from pathlib import Path
import json
import re
import sys

from pypdf import PdfReader, PdfWriter, PageObject, Transformation
import reportlab
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph


DIRECTORY = Path(__file__).resolve().parent
VERSION = sys.argv[1] if len(sys.argv) > 1 else "v01"
assert re.fullmatch(r"v\d{2,3}", VERSION), "Use a version such as v01."
OUTPUT = DIRECTORY / "output" / "pdf"
SOURCE = OUTPUT / f"ranged-spread-{VERSION}-reading.pdf"
TARGET = OUTPUT / f"a4-fold-proof-{VERSION}.pdf"
WIDTH, HEIGHT = landscape(A4)
HALF = WIDTH / 2
INK = HexColor("#171c1d")
BONE = HexColor("#f4efe5")
OXIDE = HexColor("#a73e29")
TEAL = HexColor("#24595c")
FONT_DIRECTORY = Path(reportlab.__file__).resolve().parent / "fonts"
pdfmetrics.registerFont(TTFont("ProofSans", str(FONT_DIRECTORY / "Vera.ttf")))
pdfmetrics.registerFont(TTFont("ProofSans-Bold", str(FONT_DIRECTORY / "VeraBd.ttf")))
pdfmetrics.registerFontFamily("ProofSans", normal="ProofSans", bold="ProofSans-Bold")

source = PdfReader(SOURCE)
assert len(source.pages) == 2, "The reading PDF must contain exactly two pages."
for page in source.pages:
    assert abs(float(page.mediabox.width) - HALF) < 0.75
    assert abs(float(page.mediabox.height) - HEIGHT) < 0.75


def normalise(value):
    return re.sub(r"\s+", " ", value).strip()


# Verify full rules text against the browser's rendered player-copy record.
checks_path = DIRECTORY / "review" / f"ranged-spread-{VERSION}-checks.json"
checks = json.loads(checks_path.read_text())
assert len(checks["pages"]) == 2
for page, check in zip(source.pages, checks["pages"]):
    actual = normalise(page.extract_text()).casefold()
    # Positioned badges may appear later in a PDF's text stream than in the DOM.
    # Check every complete copy block, heading, annotation, and footer separately.
    for fragment in check["copyFragments"]:
        assert normalise(fragment).casefold() in actual, (
            "PDF lost a source-copy fragment; inspect the rendered page.", fragment, actual
        )

buffer = BytesIO()
sheet = canvas.Canvas(buffer, pagesize=(WIDTH, HEIGHT))
sheet.setTitle("Fantasy Crux - A4 folding proof")
sheet.setFillColor(BONE)
sheet.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)


def paragraph(text, x, y, width, size=11, leading=14, color=INK, bold=False):
    style = ParagraphStyle(
        "proof",
        fontName="ProofSans-Bold" if bold else "ProofSans",
        fontSize=size,
        leading=leading,
        textColor=color,
        spaceAfter=0,
    )
    item = Paragraph(text, style)
    _, height = item.wrap(width, HEIGHT)
    assert y - height > 18 * mm, "Proof instructions overflow their panel."
    item.drawOn(sheet, x, y - height)
    return y - height - 5 * mm


def panel_header(offset, label):
    x = offset + 12 * mm
    right = offset + HALF - 12 * mm
    sheet.setFillColor(INK)
    sheet.setFont("ProofSans-Bold", 12)
    sheet.drawString(x, HEIGHT - 15 * mm, "FANTASY CRUX 2.0")
    sheet.setLineWidth(1)
    sheet.setStrokeColor(INK)
    sheet.line(x, HEIGHT - 19 * mm, right, HEIGHT - 19 * mm)
    sheet.setFont("ProofSans", 8)
    sheet.drawString(x, 10 * mm, label)
    return x, HEIGHT - 29 * mm, right - x


# The outside of a four-page signature is back | front, not pages 1 | 2.
x, y, width = panel_header(0, "OUTSIDE / BACK / PROOF PAGE 4")
y = paragraph("REVIEW AT REAL SIZE", x, y, width, 21, 23, OXIDE, True)
for text in [
    "Is the 11-point rules text comfortable to read at arm's length?",
    "Can you identify which modifier belongs to the attacker and which belongs to the defender?",
    "Does the centre fold leave enough room for reading and stapling?",
    "Do the illustrations explain the action without using too much page space?",
]:
    y = paragraph(text, x, y, width)
y -= 4 * mm
y = paragraph("THIS IS A FORMAT TEST", x, y, width, 12, 15, TEAL, True)
y = paragraph(
    "The two outer panels are proof instructions, not proposed handbook covers. "
    "The full content map and final page numbers remain open for review.",
    x, y, width,
)
paragraph("Review copy. Retain the accompanying player-handbook/LICENSE.md with any distribution.",
          x, y, width, 9, 12)

x, y, width = panel_header(HALF, "OUTSIDE / FRONT / PROOF PAGE 1")
y = paragraph("PLAYER HANDBOOK", x, y, width, 22, 25, INK, True)
y = paragraph("A5 FORMAT PROOF", x, y, width, 18, 22, OXIDE, True)
y = paragraph("One A4 sheet. Two sides. Four folded pages.", x, y, width, 13, 17)
y -= 6 * mm
y = paragraph("PRINT THIS PDF", x, y, width, 12, 15, TEAL, True)
for text in [
    "1. Choose A4 landscape and actual size / 100%.",
    "2. Print both PDF pages double-sided, using short-edge binding. Check your printer's preview first.",
    "3. Do not apply Booklet or 2-pages-per-sheet again: the pages are already arranged.",
    "4. Fold along the centre line. Open the sheet to read the two-page rules spread inside.",
]:
    y = paragraph(text, x, y, width)
paragraph("If duplex orientation is uncertain, make this one-sheet test before printing the eventual booklet.",
          x, y, width, 9, 12)

sheet.setStrokeColor(HexColor("#bfb5a4"))
sheet.setLineWidth(0.4)
sheet.setDash(3, 4)
sheet.line(HALF, 6 * mm, HALF, HEIGHT - 6 * mm)
sheet.showPage()
sheet.save()
buffer.seek(0)
outer = PdfReader(buffer).pages[0]

writer = PdfWriter()
writer.add_page(outer)
inside = PageObject.create_blank_page(width=WIDTH, height=HEIGHT)
for index, page in enumerate(source.pages):
    transform = Transformation().scale(
        HALF / float(page.mediabox.width), HEIGHT / float(page.mediabox.height)
    ).translate(index * HALF, 0)
    inside.merge_transformed_page(page, transform)
writer.add_page(inside)
writer.add_metadata({
    "/Title": "Fantasy Crux - A4 fold proof",
    "/Subject": "One-sheet format test. Outside: 4 | 1. Inside: 2 | 3. Not the complete handbook.",
    "/HandbookProofOrder": "[[4,1],[2,3]]",
    "/ProofFontLicense": (FONT_DIRECTORY / "bitstream-vera-license.txt").read_text().split("Copyright FAQ")[0].strip(),
})
with TARGET.open("wb") as destination:
    writer.write(destination)

proof = PdfReader(TARGET)
assert len(proof.pages) == 2
for page in proof.pages:
    assert abs(float(page.mediabox.width) - WIDTH) < 0.05
    assert abs(float(page.mediabox.height) - HEIGHT) < 0.05
assert "OUTSIDE / BACK / PROOF PAGE 4" in proof.pages[0].extract_text()
assert "OUTSIDE / FRONT / PROOF PAGE 1" in proof.pages[0].extract_text()
inside_text = normalise(proof.pages[1].extract_text()).casefold()
for page in source.pages:
    assert normalise(page.extract_text()).casefold() in inside_text
assert json.loads(proof.metadata["/HandbookProofOrder"]) == [[4, 1], [2, 3]]
print(f"Verified two A5 reading pages with complete text: {SOURCE}")
print(f"Verified A4 duplex proof, outside 4|1 and inside 2|3: {TARGET}")
