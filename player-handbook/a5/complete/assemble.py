"""Append the complete existing licence and impose a spiral cut-and-stack PDF."""

from io import BytesIO
from pathlib import Path
import importlib.util
import json
import re
import sys
from xml.sax.saxutils import escape

import pdfplumber
import reportlab
from pypdf import PdfReader, PdfWriter, PageObject, Transformation
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, NextPageTemplate

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
VERSION = sys.argv[1] if len(sys.argv) > 1 else "v03"
assert re.fullmatch(r"v\d{2,3}", VERSION)
OUTPUT = HERE / "output/pdf"
SCRATCH = HERE / "tmp/pdfs"
WIDTH, HEIGHT = 148.5 * mm, 210 * mm
A4_WIDTH = WIDTH * 2
INK, BONE, TEAL = map(HexColor, ["#171c1d", "#f4efe5", "#24595c"])
OUTPUT.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location("cut_stack", HERE.parent / "cut_stack.py")
cut_stack = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cut_stack)
FONT_DIR = Path(reportlab.__file__).resolve().parent / "fonts"
pdfmetrics.registerFont(TTFont("LegalSans", str(FONT_DIR / "Vera.ttf")))
pdfmetrics.registerFont(TTFont("LegalSans-Bold", str(FONT_DIR / "VeraBd.ttf")))


def normal(value):
    return re.sub(r"/\s+", "/", re.sub(r"\s+", " ", value)).strip().casefold()


def compact(value):
    """PDF line wraps sometimes omit spaces; compare characters without whitespace."""
    return re.sub(r"\s+", "", value).casefold()


checks = json.loads((HERE / "review" / f"checks-{VERSION}.json").read_text())
manifest = json.loads((HERE / "review" / f"manifest-{VERSION}.json").read_text())
assert checks["fontsLoaded"] and checks["brokenImages"] == 0
assert not checks["accessibilityViolations"]
assert len(checks["pages"]) == 22
for check in checks["pages"]:
    assert not check["problems"] and check["footerGapMm"] >= 2
    assert check["bindingClearanceMm"] >= 14.95 and check["minBodyPt"] >= 10.99
    assert check["minTablePt"] is None or check["minTablePt"] >= 9.99
rules = PdfReader(SCRATCH / f"rules-{VERSION}.pdf")
assert len(rules.pages) == 22
for page, check in zip(rules.pages, checks["pages"]):
    text = normal(page.extract_text())
    for fragment in check["fragments"]:
        assert compact(fragment) in compact(text), f"Page {check['folio']} loses text: {fragment}"

# Preserve the existing licence verbatim, excluding Markdown/frontmatter syntax.
licence = (ROOT / "player-handbook/LICENSE.md").read_text()
licence = re.sub(r"\A---\n.*?\n---\n", "", licence, count=1, flags=re.S)
blocks = [re.sub(r"\s*\{#[^}]+\}", "", block.strip())
          for block in re.split(r"\n\s*\n", licence) if block.strip()]
legal_file = SCRATCH / f"licence-{VERSION}.pdf"
body_style = ParagraphStyle("legal", fontName="LegalSans", fontSize=7.2,
                            leading=8.4, textColor=INK, spaceAfter=2.5)
heading_style = ParagraphStyle("legal-heading", fontName="LegalSans-Bold",
                               fontSize=10.4, leading=11.2, textColor=TEAL,
                               spaceBefore=1.5, spaceAfter=3, keepWithNext=True)


def furniture(canv, doc):
    folio = 22 + doc.page
    left, right = (15, 10) if folio % 2 else (10, 15)
    canv.saveState()
    canv.setFillColor(BONE)
    canv.rect(0, 0, WIDTH, HEIGHT, stroke=0, fill=1)
    canv.setFillColor(INK)
    canv.setFont("LegalSans-Bold", 11)
    canv.drawString(left * mm, HEIGHT - 13 * mm, "FANTASY CRUX 2.0")
    canv.setFont("LegalSans", 7)
    canv.drawRightString(WIDTH - right * mm, HEIGHT - 13 * mm, "LICENCE / CREDITS")
    canv.setStrokeColor(INK)
    canv.setLineWidth(0.8)
    canv.line(left * mm, HEIGHT - 16 * mm, WIDTH - right * mm, HEIGHT - 16 * mm)
    canv.line(left * mm, 12 * mm, WIDTH - right * mm, 12 * mm)
    canv.setFont("LegalSans", 6.7)
    canv.drawString(left * mm, 8 * mm, "PLAYER HANDBOOK / 2.0 BETA")
    canv.drawRightString(WIDTH - right * mm, 8 * mm, f"PAGE {folio:02}")
    canv.restoreState()


doc = BaseDocTemplate(str(legal_file), pagesize=(WIDTH, HEIGHT),
                      title="Fantasy Crux - existing Open Game License")
frames = [Frame(left * mm, 17 * mm, WIDTH - 25 * mm, HEIGHT - 38 * mm,
                leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
          for left in [15, 10]]
doc.addPageTemplates([
    PageTemplate(id="odd", frames=frames[0], onPage=furniture),
    PageTemplate(id="even", frames=frames[1], onPage=furniture),
])
story = [NextPageTemplate(["even", "odd"])]
for block in blocks:
    is_heading = block.startswith("#")
    text = re.sub(r"^#+\s+", "", block)
    story.append(Paragraph(escape(re.sub(r"\s+", " ", text).strip()), heading_style if is_heading else body_style))
doc.build(story)
assert len(PdfReader(legal_file).pages) == 2, "Licence must fit exactly two A5 pages."

# Verify every word of the licence after pagination, ignoring only furniture.
with pdfplumber.open(legal_file) as document:
    legal_text = normal(" ".join(page.crop((0, 19 * mm, WIDTH, HEIGHT - 16 * mm)).extract_text()
                                 for page in document.pages))
expected_legal = normal(" ".join(re.sub(r"^#+\s+", "", block) for block in blocks))
assert legal_text == expected_legal, "The full existing licence must travel with the handbook."

reading = OUTPUT / f"fantasy-crux-player-handbook-{VERSION}-reading.pdf"
print_file = OUTPUT / f"fantasy-crux-player-handbook-{VERSION}-a4-cut-stack.pdf"
book = PdfWriter()
book.append(rules)
book.append(PdfReader(legal_file))
page_count = len(book.pages)
for item in manifest["pages"]:
    book.add_outline_item(item["title"], item["folio"] - 1)
book.add_outline_item("Open Game License and credits", 22)
font_licences = [(ROOT / f"node_modules/@fontsource/{name}/LICENSE").read_text()
                 for name in ["barlow-condensed", "atkinson-hyperlegible", "ibm-plex-mono"]]
font_licences.append((FONT_DIR / "bitstream-vera-license.txt").read_text().split("Copyright FAQ")[0])
book.add_metadata({"/Title": "Fantasy Crux - Player Handbook",
                   "/Author": "Konstantinos Karasavvas",
                   "/Subject": "Core rules. A5 spiral-bound pregenerated character edition. 2.0 Beta.",
                   "/FontLicenses": "\n\n".join(font_licences)})
with reading.open("wb") as destination:
    book.write(destination)

source = PdfReader(reading)
order = cut_stack.cut_stack_order(page_count)
assert cut_stack.collated_pages(order) == list(range(1, page_count + 1))
imposed = PdfWriter()
for sheet_number, (front, back) in enumerate(order, 1):
    for side, slots in [("FRONT", front), ("BACK", back)]:
        sheet = PageObject.create_blank_page(width=A4_WIDTH, height=HEIGHT)
        for column, number in enumerate(slots):
            if number is None:
                continue
            page = source.pages[number - 1]
            transform = Transformation().scale(WIDTH / float(page.mediabox.width),
                                                HEIGHT / float(page.mediabox.height))
            sheet.merge_transformed_page(page, transform.translate(column * WIDTH, 0))
        if side == "FRONT":
            buffer = BytesIO()
            marks = canvas.Canvas(buffer, pagesize=(A4_WIDTH, HEIGHT))
            marks.setStrokeColor(HexColor("#938773"))
            marks.setLineWidth(0.35)
            marks.setDash(2, 5)
            marks.line(WIDTH, 2 * mm, WIDTH, HEIGHT - 2 * mm)
            marks.save()
            buffer.seek(0)
            sheet.merge_page(PdfReader(buffer).pages[0])
        imposed.add_page(sheet)
imposed.add_metadata({"/Title": "Fantasy Crux - A4 cut-and-stack spiral print file",
                      "/Subject": "100% A4 landscape; short-edge duplex. Stack sheets in order, fronts up; cut; left pile over right; punch left.",
                      "/HandbookPrintOrder": json.dumps(order),
                      "/HandbookLogicalPages": str(page_count),
                      "/FontLicenses": "\n\n".join(font_licences)})
with print_file.open("wb") as destination:
    imposed.write(destination)

pdf_clearances = []
with pdfplumber.open(reading) as document:
    assert len(document.pages) == page_count
    for number, page in enumerate(document.pages, 1):
        assert abs(page.width - WIDTH) < 0.75 and abs(page.height - HEIGHT) < 0.75
        chars = [char for char in page.chars if char["text"].strip()]
        clearance = min(char["x0"] if number % 2 else page.width - char["x1"]
                        for char in chars) / mm
        assert clearance >= 14.85, f"Page {number}: text enters the punch margin ({clearance} mm)."
        pdf_clearances.append(round(clearance, 3))

with pdfplumber.open(print_file) as document:
    assert len(document.pages) == 2 * len(order)
    for page, slots in zip(document.pages, [side for pair in order for side in pair]):
        assert abs(page.width - A4_WIDTH) < 0.05 and abs(page.height - HEIGHT) < 0.05
        for column, number in enumerate(slots):
            if number is None:
                continue
            half = page.crop((column * WIDTH, 0, (column + 1) * WIDTH, HEIGHT))
            actual = normal(half.extract_text(use_text_flow=True))
            assert normal(f"PAGE {number:02}") in actual, f"Wrong content in a physical print slot: {number}."
            if number <= 22:
                for fragment in checks["pages"][number - 1]["fragments"]:
                    assert compact(fragment) in compact(actual), f"Imposition loses page {number} text: {fragment}"

production = {"version": VERSION, "playerPagesIncludingCover": 22,
              "licencePages": page_count - 22, "readingPages": page_count,
              "a4Sheets": len(order), "a4PdfSides": 2 * len(order),
              "a5Leaves": (page_count + 1) // 2,
              "bindingTextClearanceMm": pdf_clearances, "cutStackOrder": order,
              "fullLicenceVerified": True, "physicalPrintTestPerformed": False}
(HERE / "review" / f"production-{VERSION}.json").write_text(json.dumps(production, indent=2) + "\n")
print(json.dumps(production, indent=2))
print(f"Reading PDF: {reading}")
print(f"A4 print PDF: {print_file}")
