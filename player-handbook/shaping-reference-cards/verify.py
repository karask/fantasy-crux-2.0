"""Verify final PDF pages against the renderer's player text and geometry."""

import json
import re
import sys
from collections import Counter
from pathlib import Path

import pdfplumber
from pypdf import PdfReader

directory = Path(__file__).resolve().parent
version = sys.argv[1] if len(sys.argv) > 1 else "v03"
assert re.fullmatch(r"v\d{2,3}", version)
pdf = directory / "output/pdf" / f"fantasy-crux-shaping-reference-cards-{version}.pdf"
checks = json.loads((directory / "review" / f"checks-{version}.json").read_text())
reader = PdfReader(pdf)
assert len(reader.pages) == len(checks["pages"]) == 3


def letters(text):
    # Ignore whitespace/reading-order differences between laid-out table cells.
    return Counter(re.sub(r"\s+", "", text))


results = []
with pdfplumber.open(pdf) as document:
    for number, (page, check) in enumerate(zip(document.pages, checks["pages"]), 1):
        extracted = reader.pages[number - 1].extract_text()
        # Count the actual list markers; a wrapped reference like 'card 3.' is copy.
        if "orderedListMarkers" in check:
            expected = check["expectedText"] + "".join(check["orderedListMarkers"])
            assert letters(extracted) == letters(expected), f"Page {number}: text changed"
        else:
            # Earlier review records predate explicit marker capture.
            player_text = re.sub(r"(?m)^\s*\d+\.\s+", "", extracted)
            assert letters(player_text) == letters(check["expectedText"]), f"Page {number}: text changed"
        assert abs(page.width - 595.28) < 1 and abs(page.height - 841.89) < 1
        assert extracted.count(f"CARD {number} / 3") == 1
        assert "pregenerated character edition" not in extracted.lower()
        assert "SHEET" not in extracted
        assert all(
            c["x0"] >= 30 and c["x1"] <= page.width - 30
            and c["top"] >= 30 and c["bottom"] <= page.height - 10
            for c in page.chars if c["text"].strip()
        ), f"Page {number}: text outside safe area"
        fonts = reader.pages[number - 1]["/Resources"]["/Font"].get_object()
        embedded = []
        for font in fonts.values():
            font = font.get_object()
            if "/DescendantFonts" in font:
                font = font["/DescendantFonts"][0].get_object()
            descriptor = font.get("/FontDescriptor")
            assert descriptor, f"Page {number}: font descriptor missing"
            descriptor = descriptor.get_object()
            assert any(key in descriptor for key in ["/FontFile", "/FontFile2", "/FontFile3"])
            embedded.append(str(font["/BaseFont"]))
        results.append({
            "page": number,
            "sizePt": [page.width, page.height],
            "completePlayerText": True,
            "singleFooterNumber": True,
            "embeddedFonts": embedded,
            "footerGapMm": check["footerGapMm"],
        })

report = {"file": pdf.name, "pages": results, "visualReview": f"See REVIEW-{version}.md"}
(directory / "review" / f"pdf-checks-{version}.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
