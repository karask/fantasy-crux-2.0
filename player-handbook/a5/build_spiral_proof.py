"""Make a one-sheet A4 cut-and-stack proof with mirrored spiral clearances."""

from io import BytesIO
from pathlib import Path
import json
import re
import sys

import pdfplumber
import reportlab
from pypdf import PdfReader, PdfWriter, PageObject, Transformation
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

from cut_stack import collated_pages, cut_stack_order


DIRECTORY = Path(__file__).resolve().parent
VERSION = sys.argv[1] if len(sys.argv) > 1 else "v02"
assert re.fullmatch(r"v\d{2,3}", VERSION) and VERSION != "v01"
OUTPUT = DIRECTORY / "output" / "pdf"
SOURCE = OUTPUT / f"ranged-spread-{VERSION}-reading.pdf"
TARGET = OUTPUT / f"a4-cut-stack-{VERSION}.pdf"
WIDTH, HEIGHT = landscape(A4)
HALF = WIDTH / 2
BINDING_MM = 15
INK = HexColor("#171c1d")
BONE = HexColor("#f4efe5")
OXIDE = HexColor("#a73e29")
TEAL = HexColor("#24595c")
FONT_DIRECTORY = Path(reportlab.__file__).resolve().parent / "fonts"
pdfmetrics.registerFont(TTFont("ProofSans", str(FONT_DIRECTORY / "Vera.ttf")))
pdfmetrics.registerFont(TTFont("ProofSans-Bold", str(FONT_DIRECTORY / "VeraBd.ttf")))
pdfmetrics.registerFontFamily("ProofSans", normal="ProofSans", bold="ProofSans-Bold")


def normalise(value):
    return re.sub(r"\s+", " ", value).strip().casefold()


source = PdfReader(SOURCE)
checks = json.loads((DIRECTORY / "review" / f"ranged-spread-{VERSION}-checks.json").read_text())
assert len(source.pages) == 2 and checks["binding"] == "spiral"
for page, check in zip(source.pages, checks["pages"]):
    assert abs(float(page.mediabox.width) - HALF) < 0.75
    assert abs(float(page.mediabox.height) - HEIGHT) < 0.75
    assert check["bindingClearanceMm"] >= BINDING_MM - 0.05
    assert check["minBodyPt"] >= 10.99
    text = normalise(page.extract_text())
    for fragment in check["copyFragments"]:
        assert normalise(fragment) in text, f"Lost PDF text: {fragment}"


# Check the actual PDF's text against the mirrored physical punching edges.
with pdfplumber.open(SOURCE) as document:
    for page, edge in zip(document.pages, ["right", "left"]):
        characters = [char for char in page.chars if char["text"].strip()]
        clear = min(
            page.width - char["x1"] if edge == "right" else char["x0"]
            for char in characters
        ) / mm
        assert clear >= BINDING_MM - 0.1, f"PDF text enters the {edge} punch zone: {clear} mm"


buffer = BytesIO()
panel = canvas.Canvas(buffer, pagesize=(HALF, HEIGHT))
panel.setTitle("Spiral proof production instructions")


def paragraph(text, x, y, width, size=11, leading=14, color=INK, bold=False):
    style = ParagraphStyle(
        "proof", fontName="ProofSans-Bold" if bold else "ProofSans",
        fontSize=size, leading=leading, textColor=color,
    )
    item = Paragraph(text, style)
    _, height = item.wrap(width, HEIGHT)
    assert y - height > 18 * mm, "Proof instructions overflow."
    item.drawOn(panel, x, y - height)
    return y - height - 4 * mm


def begin_panel(page_number, label):
    panel.setFillColor(BONE)
    panel.rect(0, 0, HALF, HEIGHT, fill=1, stroke=0)
    left = (BINDING_MM if page_number % 2 else 10) * mm
    right = HALF - (10 if page_number % 2 else BINDING_MM) * mm
    panel.setFillColor(INK)
    panel.setFont("ProofSans-Bold", 12)
    panel.drawString(left, HEIGHT - 15 * mm, "FANTASY CRUX 2.0")
    panel.setStrokeColor(INK)
    panel.setLineWidth(1)
    panel.line(left, HEIGHT - 19 * mm, right, HEIGHT - 19 * mm)
    panel.setFont("ProofSans", 8)
    panel.drawString(left, 9 * mm, label)
    return left, HEIGHT - 28 * mm, right - left


# Logical page 1: front of the first A5 leaf; holes go on its left.
x, y, width = begin_panel(1, "LEAF 1 / FRONT / PROOF 01")
y = paragraph("SPIRAL BINDING\nPROOF", x, y, width, 20, 23, OXIDE, True)
y = paragraph("One A4 sheet becomes two A5 leaves. Cut it; do not fold it.", x, y, width, 12, 16)
y = paragraph("PRINT", x, y, width, 12, 15, TEAL, True)
y = paragraph(
    "A4 landscape, actual size / 100%, double-sided, short-edge binding. "
    "Use the prepared PDF directly: no Booklet mode and no additional two-up layout.",
    x, y, width,
)
y = paragraph("CUT AND STACK", x, y, width, 12, 15, TEAL, True)
for text in [
    "1. Keep the side showing this panel and Cover &amp; Defence face up.",
    "2. Cut vertically at 148.5 mm, along the centre marks.",
    "3. Put the left piece (this front) on top of the right piece. Keep both tops aligned.",
    "4. With this front facing you, punch the stack's left edge and add the spiral.",
]:
    y = paragraph(text, x, y, width)
paragraph("Check the reverse sides before punching: this leaf has Take the Shot on its back. "
          "Cover &amp; Defence has the review checklist on its back.", x, y, width, 9, 12)
panel.showPage()

# Logical page 4: back of the second leaf; the same holes appear on its right.
x, y, width = begin_panel(4, "LEAF 2 / BACK / PROOF 04")
y = paragraph("CHECK BEFORE\nBINDING", x, y, width, 20, 23, OXIDE, True)
y = paragraph("15 mm binding allowance", x, y, width, 13, 17, TEAL, True)
y = paragraph(
    "The reading pages reserve 15 mm at the binding edge, mirrored on front and back. "
    "This is a working clearance, not a hole template. Check your punch or print shop's "
    "requirements before punching.", x, y, width,
)
for text in [
    "Both sides must be upright. If not, correct the duplex orientation and print another test.",
    "Check that the 11-point rules text remains comfortable and clear of the holes.",
    "Turn to the middle: Take the Shot is on the left and Cover &amp; Defence is on the right.",
    "Fold each leaf back around the spiral to check single-page use.",
]:
    y = paragraph(text, x, y, width)
y = paragraph("FORMAT TEST ONLY", x, y, width, 12, 15, TEAL, True)
y = paragraph(
    "These instruction panels are not proposed handbook covers. Final pagination remains open. "
    "Spiral binding does not require multiples of four; unused print slots can stay blank.",
    x, y, width, 10, 13,
)
paragraph("Review copy. Retain the accompanying player-handbook/LICENSE.md with any distribution.",
          x, y, width, 9, 12)
panel.showPage()
panel.save()
buffer.seek(0)
instructions = PdfReader(buffer)
logical = {1: instructions.pages[0], 2: source.pages[0], 3: source.pages[1], 4: instructions.pages[1]}
order = cut_stack_order(4)
assert order == [([1, 3], [4, 2])]
assert collated_pages(order) == [1, 2, 3, 4]

mark_buffer = BytesIO()
marks = canvas.Canvas(mark_buffer, pagesize=(WIDTH, HEIGHT))
marks.setStrokeColor(HexColor("#938773"))
marks.setLineWidth(0.4)
marks.setDash(2, 5)
marks.line(HALF, 5 * mm, HALF, HEIGHT - 5 * mm)
marks.setFillColor(INK)
marks.setFont("ProofSans", 6)
marks.drawCentredString(HALF, HEIGHT - 4 * mm, "CUT")
marks.drawCentredString(HALF, 3 * mm, "CUT")
marks.showPage()
marks.save()
mark_buffer.seek(0)
mark_page = PdfReader(mark_buffer).pages[0]

writer = PdfWriter()
for front, back in order:
    for is_front, slots in [(True, front), (False, back)]:
        sheet = PageObject.create_blank_page(width=WIDTH, height=HEIGHT)
        for index, number in enumerate(slots):
            if number is None:
                continue
            original = logical[number]
            transform = Transformation().scale(
                HALF / float(original.mediabox.width), HEIGHT / float(original.mediabox.height)
            ).translate(index * HALF, 0)
            sheet.merge_transformed_page(original, transform)
        if is_front:
            sheet.merge_page(mark_page)
        writer.add_page(sheet)

writer.add_metadata({
    "/Title": "Fantasy Crux - A4 cut-and-stack spiral proof",
    "/Subject": "Landscape short-edge duplex. Front 1|3; back 4|2. Cut, stack left over right, punch and spiral-bind.",
    "/HandbookProofOrder": json.dumps(order),
    "/HandbookBindingAllowanceMm": str(BINDING_MM),
    "/ProofFontLicense": (FONT_DIRECTORY / "bitstream-vera-license.txt").read_text().split("Copyright FAQ")[0].strip(),
})
with TARGET.open("wb") as destination:
    writer.write(destination)

proof = PdfReader(TARGET)
assert len(proof.pages) == 2
assert json.loads(proof.metadata["/HandbookProofOrder"]) == [[[1, 3], [4, 2]]]
for pdf_page, slots in zip(proof.pages, [order[0][0], order[0][1]]):
    assert abs(float(pdf_page.mediabox.width) - WIDTH) < 0.05
    assert abs(float(pdf_page.mediabox.height) - HEIGHT) < 0.05
    actual = normalise(pdf_page.extract_text())
    for number in slots:
        assert normalise(logical[number].extract_text()) in actual

# Validate the physical left/right content positions, not only the metadata.
with pdfplumber.open(TARGET) as document:
    for page, slots in zip(document.pages, [order[0][0], order[0][1]]):
        for index, number in enumerate(slots):
            half = page.crop((index * HALF, 0, (index + 1) * HALF, HEIGHT))
            actual = normalise(half.extract_text())
            expected_label = {1: "LEAF 1 / FRONT / PROOF 01", 2: "SPIRAL PROOF 02",
                              3: "SPIRAL PROOF 03", 4: "LEAF 2 / BACK / PROOF 04"}[number]
            assert normalise(expected_label) in actual

print(f"Verified A5 text and mirrored {BINDING_MM} mm binding clearances: {SOURCE}")
print(f"Verified A4 front 1|3, back 4|2; cutting and stacking yields 1,2,3,4: {TARGET}")
