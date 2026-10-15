"""Make numbered contact sheets from rendered final PDFs, without changing the PDFs."""

from pathlib import Path
import sys
from PIL import Image, ImageDraw

here = Path(__file__).resolve().parent
version = sys.argv[1] if len(sys.argv) > 1 else "v04"
for kind, width in [("reading", 420), ("print", 620)]:
    files = sorted((here.parent / "tmp/pdfs").glob(f"{version}-{kind}-[0-9][0-9].png"))
    assert files, f"Render the final {kind} PDF first."
    for start in range(0, len(files), 6):
        thumbs = []
        for file in files[start:start + 6]:
            with Image.open(file) as page:
                thumbs.append(page.convert("RGB").resize((width, round(page.height * width / page.width))))
        cell_w, cell_h = width + 16, thumbs[0].height + 30
        sheet = Image.new("RGB", (cell_w * 3, cell_h * 2), "#b8b5ad")
        draw = ImageDraw.Draw(sheet)
        for index, thumb in enumerate(thumbs):
            x, y = index % 3 * cell_w, index // 3 * cell_h
            sheet.paste(thumb, (x + 8, y + 24))
            draw.text((x + 8, y + 6), f"{kind} {start + index + 1}", fill="black")
        sheet.save(here / f"{version}-{kind}-contact-{start // 6 + 1:02}.png")
    print(f"{kind}: {len(files)} pages assembled into contact sheets")
