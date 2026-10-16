"""Verify the Lite PDF against the renderer's page text and geometry records."""

import json
import re
import sys
from collections import Counter
from pathlib import Path

import pdfplumber
from pypdf import PdfReader

directory = Path(__file__).resolve().parent
version = sys.argv[1] if len(sys.argv) > 1 else "v01"
assert re.fullmatch(r"v\d{2,3}", version)
pdf = directory / "output/pdf" / f"fantasy-crux-lite-{version}.pdf"
checks = json.loads((directory / "review" / f"checks-{version}.json").read_text())
reader = PdfReader(pdf)
pages = checks["pages"]
assert len(reader.pages) == len(pages), "PDF and renderer disagree on page count"


def letters(text):
    # Compare letters only: list markers, case and reading order differ legitimately.
    return Counter(re.sub(r"[\s\d.]", "", text).lower())


results = []
with pdfplumber.open(pdf) as document:
    for number, (page, check) in enumerate(zip(document.pages, pages), 1):
        extracted = reader.pages[number - 1].extract_text()
        assert letters(extracted) == letters(check["expectedText"]), f"Page {number}: text changed"
        assert abs(page.width - 595.28) < 1 and abs(page.height - 841.89) < 1, f"Page {number}: not A4"
        assert extracted.count(f"PAGE {number}") == 1, f"Page {number}: folio"
        assert all(
            c["x0"] >= 25 and c["x1"] <= page.width - 25 and c["top"] >= 25 and c["bottom"] <= page.height - 10
            for c in page.chars
            if c["text"].strip()
        ), f"Page {number}: text outside the safe area"
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
        images = len(page.images)
        results.append(
            {
                "page": number,
                "sizePt": [page.width, page.height],
                "completeText": True,
                "embeddedFonts": sorted(set(embedded)),
                "images": images,
                "footerGapMm": round(check["footerGapMm"], 2),
            }
        )

assert results[0]["images"] == 1, "The cover art is missing"
report = {
    "file": pdf.name,
    "pages": results,
    "compatibilityChecks": checks["compatibilityChecks"],
    "visualReview": f"See REVIEW-{version}.md",
}
(directory / "review" / f"pdf-checks-{version}.json").write_text(json.dumps(report, indent=2) + "\n")
print(f"{len(results)} PDF pages verified: complete text, A4, embedded fonts, one folio each.")
