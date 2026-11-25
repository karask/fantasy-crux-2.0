#!/usr/bin/env python3
"""Make a lighter reading copy of the handbook PDF: downscale images, JPEG the colour, Flate the alpha.

  python3 shrink.py IN.pdf OUT.pdf [max_px=1400] [quality=78]
The print master (PDF/X-4) stays untouched; the copy is for screens and home printing.
"""
import io, sys, zlib
from pypdf import PdfWriter
from pypdf.generic import EncodedStreamObject, NameObject, NumberObject
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
MAX = int(sys.argv[3]) if len(sys.argv) > 3 else 1400
Q = int(sys.argv[4]) if len(sys.argv) > 4 else 78
w = PdfWriter(clone_from=src)


def stream(data, filt, width, height, cs, bpc=8):
    s = EncodedStreamObject()
    s._data = data
    s.update({NameObject("/Type"): NameObject("/XObject"), NameObject("/Subtype"): NameObject("/Image"),
              NameObject("/Width"): NumberObject(width), NameObject("/Height"): NumberObject(height),
              NameObject("/ColorSpace"): NameObject(cs), NameObject("/BitsPerComponent"): NumberObject(bpc),
              NameObject("/Filter"): NameObject(filt)})
    return s


seen = set()
for page in w.pages:
    for im in page.images:
        ref = im.indirect_reference
        if ref is None or ref.idnum in seen:
            continue
        seen.add(ref.idnum)
        pil = im.image
        if max(pil.size) > MAX:
            sc = MAX / max(pil.size)
            pil = pil.resize((round(pil.width * sc), round(pil.height * sc)), Image.LANCZOS)
        rgba = pil.convert("RGBA")
        buf = io.BytesIO()
        rgba.convert("RGB").save(buf, "JPEG", quality=Q, optimize=True)
        new = stream(buf.getvalue(), "/DCTDecode", rgba.width, rgba.height, "/DeviceRGB")
        alpha = rgba.getchannel("A")
        if alpha.getextrema()[0] < 255:
            sm = stream(zlib.compress(alpha.tobytes(), 9), "/FlateDecode", rgba.width, rgba.height, "/DeviceGray")
            new[NameObject("/SMask")] = w._add_object(sm)
        w._replace_object(ref, new)
w.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
w.write(dst)
