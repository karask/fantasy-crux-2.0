"""Checks an adventure's Gamemaster edition PDF and draws page previews.

    verify.py outline <pdf>
        Prints the PDF outline as JSON: title, page and depth, in document order.

    verify.py check <pdf> <expected.json> <review-dir>
        Checks page sizes, embedded fonts, that every visible block of text and the complete
        licence reached the PDF, that the contents page numbers match the outline, and that each
        print-and-play sheet fits on one page. Writes pdf-checks.json, page previews and contact
        sheets to the review folder, and prints the report as JSON.

Needs pypdf, pypdfium2 and Pillow. render.mjs runs both modes.
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image
from pypdf import PdfReader

A4 = (595.28, 841.89)
MM = 72 / 25.4


def outline(reader):
    entries = []

    def walk(items, depth):
        for item in items:
            if isinstance(item, list):
                walk(item, depth + 1)
            else:
                # Chrome repeats the title of a heading pushed to the top of the next page.
                title, half = item.title, len(item.title) // 2
                if len(title) % 2 == 0 and title[:half] == title[half:]:
                    title = title[:half]
                entries.append(
                    {
                        "title": title,
                        "page": reader.get_destination_page_number(item) + 1,
                        "depth": depth,
                    }
                )

    walk(reader.outline, 0)
    return entries


def letters(text):
    text = unicodedata.normalize("NFKD", text).lower()
    return re.sub(r"[^a-z]", "", text)


def normal(text):
    text = unicodedata.normalize("NFKD", text).lower().replace("’", "'").replace("‘", "'")
    return re.sub(r"\s+", " ", text).strip()


def body_text(page):
    """A pdfium page's text without its running heads and folio, which sit in the margins."""
    width, height = page.get_size()
    text = page.get_textpage()
    if width > height:
        return text.get_text_range()
    return text.get_text_bounded(left=0, bottom=17 * MM, right=width, top=height - 19 * MM)


def embedded(font):
    font = font.get_object()
    if font.get("/Subtype") == "/Type0":
        font = font["/DescendantFonts"][0].get_object()
    descriptor = font.get("/FontDescriptor")
    if descriptor is None:
        return font.get("/Subtype") == "/Type3"
    descriptor = descriptor.get_object()
    return any(key in descriptor for key in ("/FontFile", "/FontFile2", "/FontFile3"))


def previews(pdf, review):
    pages_dir = review / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    for old in pages_dir.glob("*.png"):
        old.unlink()
    for old in review.glob("contact-*.png"):
        old.unlink()
    document = pdfium.PdfDocument(str(pdf))
    images = []
    for index in range(len(document)):
        image = document[index].render(scale=1.0).to_pil()
        image.save(pages_dir / f"page-{index + 1:02d}.png")
        images.append(image)
    per_sheet, columns, cell = 8, 4, 420
    for sheet, start in enumerate(range(0, len(images), per_sheet), 1):
        batch = images[start : start + per_sheet]
        rows = (len(batch) + columns - 1) // columns
        canvas = Image.new("RGB", (columns * cell + (columns + 1) * 12, rows * cell + (rows + 1) * 12), "#8a8f8f")
        for position, image in enumerate(batch):
            thumb = image.copy()
            thumb.thumbnail((cell, cell))
            x = 12 + (position % columns) * (cell + 12) + (cell - thumb.width) // 2
            y = 12 + (position // columns) * (cell + 12) + (cell - thumb.height) // 2
            canvas.paste(thumb, (x, y))
        canvas.save(review / f"contact-{sheet:02d}.png")
    return len(images)


def check(pdf, expected_path, review):
    expected = json.loads(Path(expected_path).read_text())
    reader = PdfReader(str(pdf))
    marks = outline(reader)
    problems = []

    def page_of(title, start=0):
        for index in range(start, len(marks)):
            if normal(marks[index]["title"]) == normal(title):
                return index, marks[index]["page"]
        return None, None

    # Page sizes: A4 portrait, except the landscape map pages.
    landscape = set(expected["landscape"])
    for number, page in enumerate(reader.pages, 1):
        width, height = float(page.mediabox.width), float(page.mediabox.height)
        want = (A4[1], A4[0]) if number in landscape else A4
        if abs(width - want[0]) > 1 or abs(height - want[1]) > 1:
            problems.append(f"page {number} is {width:.0f} x {height:.0f} pt")

    # Fonts must be embedded as real fonts, not drawn as Type 3 glyph procedures.
    unembedded = {}
    for number, page in enumerate(reader.pages, 1):
        fonts = page.get("/Resources", {}).get("/Font", {})
        for name, font in fonts.items():
            if not embedded(font) or font.get_object().get("/Subtype") == "/Type3":
                unembedded.setdefault(str(font.get_object().get("/BaseFont", name)), []).append(number)
    if unembedded:
        problems.append(f"fonts not embedded as fonts: {unembedded}")

    # Text without running heads and folios: look for every block, letters only.
    texts = []
    document = pdfium.PdfDocument(str(pdf))
    for number in range(1, len(document) + 1):
        text = body_text(document[number - 1])
        if not letters(text):
            problems.append(f"page {number} has no text")
        texts.append(text)
    stream = letters("\n".join(texts))
    missing = [block[:90] for block in expected["blocks"] if letters(block) not in stream]
    if missing:
        problems.append(f"{len(missing)} blocks missing, first: {missing[:5]}")
    if letters(expected["licence"]) not in stream:
        problems.append("the licence is incomplete")

    # The contents page numbers must match where each heading landed.
    cursor = 0
    for title, folio in expected["folios"]:
        index, page = page_of(title, cursor)
        if index is None:
            problems.append(f"no outline entry for {title}")
            continue
        if page != folio:
            problems.append(f"contents gives {title} page {folio}, but it is on page {page}")
        cursor = index + 1

    # Each print-and-play sheet is one page, and the sheets follow one another.
    previous = None
    for pages in expected["sheets"]:
        if len(set(pages)) != 1:
            problems.append(f"a print sheet spreads over pages {pages}")
        if previous is not None and pages[0] != previous + 1:
            problems.append(f"a print sheet starts on page {pages[0]}, after {previous}")
        previous = pages[-1]
    if previous is not None and expected["licencePage"] != previous + 1:
        problems.append(f"the last print sheet runs on to page {expected['licencePage'] - 1}")

    count = previews(pdf, review)
    report = {
        "pdf": str(pdf),
        "pages": count,
        "bytes": Path(pdf).stat().st_size,
        "outlineEntries": len(marks),
        "landscapePages": sorted(landscape),
        "blocksChecked": len(expected["blocks"]),
        "problems": problems,
    }
    (review / "pdf-checks.json").write_text(json.dumps(report, indent=2) + "\n")
    return report


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "outline":
        print(json.dumps(outline(PdfReader(sys.argv[2]))))
    elif mode == "check":
        print(json.dumps(check(Path(sys.argv[2]), sys.argv[3], Path(sys.argv[4]))))
    else:
        raise SystemExit(__doc__)
