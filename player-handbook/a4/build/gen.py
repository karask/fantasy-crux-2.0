#!/usr/bin/env python3
"""Write a DesignCraft command script (.dcs) that lays out one handbook chapter on A4.

Usage: gen.py CFG.json   (written by build.py; see book.json)
Styles, page furniture and the art edge rule follow the adventure booklet
"The Lamp That Went Dark", so the product line reads as one family.
"""
import json, os, sys
from PIL import Image

W = os.path.dirname(os.path.abspath(__file__))
A4 = os.path.dirname(W)
IMG = os.path.join(W, "img")
DIAG = os.path.join(A4, "diagrams")
PW, PH = 595.2755905511812, 841.8897637795275
BLEED = 8.5
M = dict(top=58, bottom=64, inside=54, outside=42)
GUT = 16
COLW = (PW - M["inside"] - M["outside"] - GUT) / 2
cfg = json.load(open(sys.argv[1]))
START = cfg.get("startPage", 1)
NPAGES = max([cfg.get("maxPages", 10)] + [i["page"] for i in cfg.get("images", [])])

lines, step = [], [0]


def cmd(cid, params=None):
    lines.append(f"{cid} {json.dumps(params or {}, ensure_ascii=False)}")
    step[0] += 1
    return step[0] - 1


def ref(i, path):
    return f"${i}.{path}"


def page_origin(n):
    """1-based local page -> (spread index, x offset of the page in its spread, side)."""
    i = n - 1
    side = "left" if (START + i) % 2 == 0 else "right"
    if START % 2 == 1:
        if i == 0:
            return 0, 0.0, "right"
        return (i + 1) // 2, (0.0 if side == "left" else PW), side
    return i // 2, (0.0 if side == "left" else PW), side


cmd("file.new", {"preset": "A4", "facingPages": True, "margins": M, "bleed": BLEED, "pages": NPAGES,
                 "startPage": START, "columns": 2, "gutter": GUT, "title": "Fantasy Crux Player's Handbook"})

SW = {"Ink": "#2b2018", "Oxblood": "#7b2a1a", "Gold": "#a07a35", "Teal": "#2c4c55", "Mist": "#e4d6b6", "Vellum": "#f3ead6"}
for k, v in SW.items():
    r_, g_, b_ = (int(v[i:i + 2], 16) / 255 for i in (1, 3, 5))
    k_ = 1 - max(r_, g_, b_)
    cm = [0 if k_ == 1 else round((1 - x - k_) / (1 - k_) * 100, 1) for x in (r_, g_, b_)]
    cmd("swatch.create", {"name": k, "color": {"c": cm[0], "m": cm[1], "y": cm[2], "k": round(k_ * 100, 1)}})

SIZE, LEAD = cfg.get("bodySize", 9.9), cfg.get("bodyLeading", 12.7)
BODY = {"fontFamily": "EB Garamond", "fontStyle": "Regular", "size": SIZE,
        "leading": {"kind": "points", "value": LEAD}, "fill": "Ink"}
cmd("style.paragraph.create", {"name": "Body Text", "para": {"align": "leftJustified", "firstLineIndent": 11, "spaceBefore": 0,
    "spaceAfter": 0, "hyphenate": True, "opticalMargin": True}, "chars": BODY})
cmd("style.paragraph.create", {"name": "First Paragraph", "basedOn": "Body Text", "para": {"firstLineIndent": 0}})
cmd("style.paragraph.create", {"name": "Normal", "basedOn": "Body Text"})
cmd("style.paragraph.create", {"name": "Heading 2", "nextStyle": "First Paragraph",
    "para": {"align": "left", "firstLineIndent": 0, "spaceBefore": 15, "spaceAfter": 6, "keepWithNext": 3,
             "keepLinesTogether": True, "hyphenate": False,
             "ruleBelow": {"on": True, "weight": 0.6, "color": "Gold", "offset": 4, "rightIndent": 0}},
    "chars": {"fontFamily": "Cinzel", "fontStyle": "Bold", "size": 15, "leading": {"kind": "points", "value": 18},
              "fill": "Oxblood", "tracking": 20}})
cmd("style.paragraph.create", {"name": "Heading 3", "nextStyle": "First Paragraph",
    "para": {"align": "left", "firstLineIndent": 0, "spaceBefore": 8, "spaceAfter": 1.5, "keepWithNext": 3,
             "keepLinesTogether": True, "hyphenate": False},
    "chars": {"fontFamily": "IM FELL English SC", "fontStyle": "Regular", "size": 12.5,
              "leading": {"kind": "points", "value": 15}, "fill": "Teal", "tracking": 10}})
cmd("style.paragraph.create", {"name": "Heading 1", "basedOn": "Heading 2"})
cmd("style.paragraph.create", {"name": "Talent Meta", "basedOn": "First Paragraph", "nextStyle": "First Paragraph",
    "para": {"spaceAfter": 2, "keepWithNext": 2, "align": "left"},
    "chars": {"fontStyle": "Italic", "size": 9.2, "fill": "Gold"}})
cmd("style.paragraph.create", {"name": "Block Text",
    "para": {"align": "left", "firstLineIndent": 0, "leftIndent": 12, "rightIndent": 8, "spaceBefore": 8,
             "spaceAfter": 9, "hyphenate": True, "keepLinesTogether": True,
             "shadingOn": True, "shadingColor": "Mist", "shadingTint": 0.75, "shadingOffsets": [5, 7, 5, 5],
             "borderOn": True, "borderWeights": [0, 2.2, 0, 0], "borderColor": "Oxblood", "borderOffsets": [5, 7, 5, 5]},
    "chars": {"fontFamily": "EB Garamond", "fontStyle": "Regular", "size": SIZE - 0.3,
              "leading": {"kind": "points", "value": LEAD - 0.4}, "fill": "Ink"}})
cmd("style.paragraph.create", {"name": "Compact", "basedOn": "Body Text",
    "para": {"align": "left", "firstLineIndent": 0, "spaceAfter": 2, "hyphenate": True}})
cmd("style.paragraph.create", {"name": "Table Text", "basedOn": "Body Text",
    "para": {"align": "left", "firstLineIndent": 0, "hyphenate": True},
    "chars": {"size": 8.4, "leading": {"kind": "points", "value": 10.2}}})
cmd("style.paragraph.create", {"name": "Table Head", "basedOn": "Table Text",
    "chars": {"fontFamily": "Cinzel", "fontStyle": "Bold", "size": 7.4, "fill": "Vellum", "tracking": 30}})
cmd("style.paragraph.create", {"name": "Running Head", "para": {"align": "left", "hyphenate": False},
    "chars": {"fontFamily": "IM FELL English SC", "fontStyle": "Regular", "size": 8.5, "fill": "Gold", "tracking": 60}})
cmd("style.paragraph.create", {"name": "Folio", "para": {"align": "center", "hyphenate": False},
    "chars": {"fontFamily": "Cinzel", "fontStyle": "Bold", "size": 9, "fill": "Oxblood", "tracking": 40}})
cmd("style.paragraph.create", {"name": "Caption", "para": {"align": "center", "hyphenate": False},
    "chars": {"fontFamily": "EB Garamond", "fontStyle": "Italic", "size": 8.8,
              "leading": {"kind": "points", "value": 10.6}, "fill": "Teal"}})
cmd("style.paragraph.create", {"name": "Legal", "basedOn": "First Paragraph",
    "para": {"spaceAfter": 3, "align": "left"}, "chars": {"size": 7.4, "leading": {"kind": "points", "value": 8.9}}})

PARENT_A = {"kind": "parent", "index": 0}


def place_image(spread, rect, path, fit="fillProportionally", wrap=None):
    f = cmd("frame.create", {"spread": spread, "rect": rect, "content": "graphic"})
    cmd("file.place", {"path": path, "frame": ref(f, "id"), "embed": True})
    cmd("object.fit", {"mode": fit, "ids": [ref(f, "id")]})
    if wrap:
        cmd("object.textWrap", dict(wrap, ids=[ref(f, "id")], content=False))
    return f


def text_frame(spread, rect, text, style, ignore_wrap=True):
    f = cmd("frame.create", {"spread": spread, "rect": rect, "content": "text", "text": text})
    cmd("text.select", {"story": ref(f, "story"), "anchor": 0, "focus": len(text.encode())})
    cmd("style.paragraph.apply", {"name": style})
    if ignore_wrap:
        cmd("object.textFrameOptions", {"ids": [ref(f, "id")], "ignoreWrap": True, "inset": 0})
    return f


def build_parent(spread, heads=True):
    for x0 in (0.0, PW):
        place_image(spread, [x0 - (BLEED if x0 == 0 else 0), -BLEED, x0 + PW + (BLEED if x0 > 0 else 0), PH + BLEED],
                    f"{IMG}/paper{0 if x0 == 0 else 1}.jpg")
    place_image(spread, [-BLEED, PH - 210, 210, PH + BLEED], f"{IMG}/mist-corner.png")
    place_image(spread, [2 * PW - 210, PH - 210, 2 * PW + BLEED, PH + BLEED], f"{IMG}/mist-corner-r.png")
    if not heads:
        return
    y = 30
    text_frame(spread, [M["outside"], y, PW - M["inside"], y + 12], "Fantasy Crux · Player's Handbook", "Running Head")
    rh = text_frame(spread, [PW + M["inside"], y, 2 * PW - M["outside"], y + 12], cfg["runningHead"], "Running Head")
    cmd("text.select", {"story": ref(rh, "story"), "anchor": 0, "focus": 200})
    cmd("type.para", {"attrs": {"align": "right"}})
    fy = PH - 40
    text_frame(spread, [M["outside"] - 6, fy, M["outside"] + 40, fy + 14], "", "Folio")
    text_frame(spread, [2 * PW - M["outside"] - 40, fy, 2 * PW - M["outside"] + 6, fy + 14], "", "Folio")


build_parent(PARENT_A, heads=True)
cmd("layout.parents.new", {"prefix": "B", "name": "Opener"})
build_parent({"kind": "parent", "index": 1}, heads=False)

# ---------------------------------------------------------------- art
for it in cfg.get("images", []):
    page = it["page"]
    s, x0, side = page_origin(page)
    w = it["w"]
    pos = it.get("x", "outer")
    if pos == "outer":
        pos = "left" if side == "left" else "right"
    if pos == "inner":
        pos = "right" if side == "left" else "left"
    if it.get("banner"):
        name, pos, w = it["img"], "left", PW + 2 * BLEED
    elif it.get("fixed"):
        name = it["img"]
    else:
        name = it["img"] + ("-L" if pos == "left" else "-R")
    ipath = os.path.join(IMG, name + ".png")
    im = Image.open(ipath)
    h = w * im.height / im.width
    ov = BLEED if it.get("banner") else it.get("bleedOut", 12)
    x = -ov if pos == "left" else (PW - w + ov if pos == "right" else (PW - w) / 2 if pos == "center" else float(pos))
    y = -BLEED if it.get("banner") else it.get("y", PH + BLEED - h)
    if it.get("bottom"):
        # floats stop above the folio; full-page art (fixed) may still bleed off the foot
        y = PH + BLEED - h if it.get("fixed") else PH - it.get("lift", 44) - h
    rect = [x0 + x, y, x0 + x + w, y + h]
    wrap = {"mode": "contour", "contour": "alphaChannel", "threshold": it.get("threshold", 90), "offset": it.get("offset", 6),
            "side": {"left": "rightSide", "right": "leftSide"}.get(pos, "bothSides")}
    if it.get("banner"):
        wrap = {"mode": "jumpObject", "offset": [0, 0, it.get("tuck", -18), 0]}
    if it.get("wrap") == "jump":
        wrap = {"mode": "jumpObject", "offset": it.get("offset", 4)}
    if it.get("wrap") == "none":
        wrap = None
    place_image(s, rect, ipath, wrap=wrap)
    if it.get("caption"):
        cw = it.get("capW", 170)
        cy = y + h * it.get("capAt", 0.9)
        cx = rect[0] + (w - cw) / 2 + it.get("capDX", 0)
        text_frame(s, [cx, cy, cx + cw, cy + 26], it["caption"], "Caption")

# ---------------------------------------------------------------- story
# one two-column frame per page, threaded in order; build.py trims the unused pages
frames = []
for pg in range(cfg.get("storyPage", 1), NPAGES + 1):
    s_, x_, side_ = page_origin(pg)
    ml = M["inside"] if side_ == "right" else M["outside"]
    mr = M["outside"] if side_ == "right" else M["inside"]
    fr = cmd("frame.create", {"spread": s_, "rect": [x_ + ml, M["top"], x_ + PW - mr, PH - M["bottom"]], "content": "text"})
    cmd("object.textFrameOptions", {"ids": [ref(fr, "id")], "columns": 2, "gutter": GUT, "inset": 0})
    if frames:
        cmd("text.thread", {"from": ref(frames[-1], "id"), "to": ref(fr, "id")})
    frames.append(fr)
pl = cmd("file.place", {"path": cfg["docx"], "frame": ref(frames[0], "id"), "styleConflicts": "useExisting"})
ST = ref(pl, "story")
if cfg.get("opener", True):
    cmd("layout.pages.applyParent", {"pages": [0], "parent": "B"})

t = cfg.get("title")
_, x00, _ = page_origin(1)
if t:
    KICK, TITLE, SUB = t["kicker"], t["text"], t.get("sub", "")
    rect = [x00 + t["rect"][0], t["rect"][1], x00 + t["rect"][2], t["rect"][3]]
    tf = cmd("frame.create", {"spread": 0, "rect": rect, "content": "text", "text": KICK + "\n" + TITLE + ("\n" + SUB if SUB else "")})
    cmd("object.textFrameOptions", {"ids": [ref(tf, "id")], "ignoreWrap": True, "inset": 0})
    cmd("text.select", {"story": ref(tf, "story"), "anchor": 0, "focus": len(KICK.encode())})
    cmd("type.para", {"attrs": {"align": "center", "spaceAfter": 2}})
    cmd("type.char", {"attrs": {"fontFamily": "IM FELL English SC", "fontStyle": "Regular", "size": 14, "fill": "Teal", "tracking": 220}})
    a = len((KICK + "\n").encode())
    b = a + len(TITLE.encode())
    cmd("text.select", {"story": ref(tf, "story"), "anchor": a, "focus": b})
    cmd("type.para", {"attrs": {"align": "center", "spaceAfter": 3, "hyphenate": False}})
    cmd("type.char", {"attrs": {"fontFamily": "Cinzel Decorative", "fontStyle": "Bold", "size": t.get("size", 30),
                                "leading": {"kind": "points", "value": t.get("size", 30) + 5}, "fill": "Oxblood"}})
    if SUB:
        cmd("text.select", {"story": ref(tf, "story"), "anchor": b + 1, "focus": b + 1 + len(SUB.encode())})
        cmd("type.para", {"attrs": {"align": "center"}})
        cmd("type.char", {"attrs": {"fontFamily": "EB Garamond", "fontStyle": "Italic", "size": 13.5, "fill": "Ink"}})
    sp_ = [x00 + t["spacer"][0], t["spacer"][1], x00 + t["spacer"][2], t["spacer"][3]]
    sp = cmd("frame.create", {"spread": 0, "rect": sp_, "content": "unassigned"})
    cmd("object.textWrap", {"mode": "boundingBox", "offset": 0, "ids": [ref(sp, "id")]})
    cmd("object.stroke", {"swatch": "[None]", "ids": [ref(sp, "id")]})

# ---------------------------------------------------------------- tables
def fmt_tables(ST, tables, pre=""):
    for tid, tb in enumerate(tables, 1):
        nr, widths = tb["rows"], tb["widths"]
        for ci, wd in enumerate(widths):
            cmd("table.setColumnWidth", {"width": wd, "story": ST, "table": tid, "rows": [0, nr - 1], "cols": [ci, ci]})
        last = len(widths) - 1
        cmd("table.setCell", {"story": ST, "table": tid, "rows": [0, nr - 1], "cols": [0, last], "insets": [3, 4, 2.6, 4], "stroke": {"weight": 0, "edges": "all"}})
        cmd("table.setCell", {"story": ST, "table": tid, "rows": [0, nr - 1], "cols": [0, last], "stroke": {"weight": 0.5, "color": "Gold", "edges": ["innerHorizontal", "bottom"]}})
        cmd("table.setCell", {"story": ST, "table": tid, "rows": [0, 0], "cols": [0, last], "fill": "Oxblood", "tint": 1.0, "vj": "center"})
        for r in range(2, nr, 2):
            cmd("table.setCell", {"story": ST, "table": tid, "rows": [r, r], "cols": [0, last], "fill": "Mist", "tint": 0.55})
        cmd("table.options", {"story": ST, "table": tid, "headerRows": 1, "repeatHeader": True, "spaceBefore": 5, "spaceAfter": 7})
        cmd("style.cell.create", {"name": f"{pre}TBody{tid}", "paragraphStyle": "Table Text"})
        cmd("style.cell.apply", {"name": f"{pre}TBody{tid}", "story": ST, "table": tid, "rows": [1, nr - 1], "cols": [0, last]})
        cmd("style.cell.create", {"name": f"{pre}THead{tid}", "paragraphStyle": "Table Head"})
        cmd("style.cell.apply", {"name": f"{pre}THead{tid}", "story": ST, "table": tid, "rows": [0, 0], "cols": [0, last]})


fmt_tables(ST, json.load(open(cfg["docx"] + ".tables.json")))

# ---------------------------------------------------------------- full-width panels (wide tables)
for name, pd in cfg.get("panelDocx", {}).items():
    pc = cfg["panels"][name]
    ps, px, pside = page_origin(pc["page"])
    ml = M["inside"] if pside == "right" else M["outside"]
    mr = M["outside"] if pside == "right" else M["inside"]
    pf = cmd("frame.create", {"spread": ps, "rect": [px + ml, pc["y"], px + PW - mr, pc["y"] + pc.get("h", 200)], "content": "text"})
    cmd("object.textFrameOptions", {"ids": [ref(pf, "id")], "inset": 0, "ignoreWrap": True,
                                    "autoSize": "heightOnly", "autoSizeReference": "topCenter"})
    pp = cmd("file.place", {"path": pd, "frame": ref(pf, "id"), "styleConflicts": "useExisting"})
    cmd("object.textWrap", {"mode": "jumpObject", "offset": [0, 0, pc.get("after", 10), 0], "ids": [ref(pf, "id")]})
    fmt_tables(ref(pp, "story"), json.load(open(pd + ".tables.json")), "P" + name)

# ---------------------------------------------------------------- markers: wide tables and diagrams
for _ in range(cfg.get("wideCount", 0)):
    # span the marker paragraph and the table paragraph after it, then drop the marker text
    g = cmd("find.find", {"find": r"\{\{wide\}\}[\r\n\x{2029}].", "grep": True, "scope": "story", "story": ST})
    cmd("text.select", {"story": ST, "anchor": ref(g, "0.start"), "focus": ref(g, "0.end")})
    cmd("type.para", {"attrs": {"spanColumns": {"kind": "span", "columns": 2}, "spaceBefore": 4}})
    f = cmd("find.find", {"find": "{{wide}}", "scope": "story", "story": ST})
    cmd("text.select", {"story": ST, "anchor": ref(f, "0.start"), "focus": ref(f, "0.end")})
    cmd("text.insert", {"text": ""})
for name in cfg.get("figures", []):
    f = cmd("find.find", {"find": "{{fig:%s}}" % name, "scope": "story", "story": ST})
    cmd("text.select", {"story": ST, "anchor": ref(f, "0.start"), "focus": ref(f, "0.end")})
    cmd("text.insert", {"text": ""})
    cmd("text.select", {"story": ST, "anchor": ref(f, "0.start"), "focus": ref(f, "0.start")})
    cmd("type.para", {"attrs": {"spaceBefore": 6, "spaceAfter": 8, "firstLineIndent": 0, "align": "center", "keepLinesTogether": True}})
    im = Image.open(os.path.join(DIAG, name + ".png"))
    fw = COLW * cfg.get("figScale", {}).get(name, 1.0)
    g = cmd("frame.create", {"spread": 0, "rect": [0, 0, fw, fw * im.height / im.width], "content": "graphic"})
    cmd("file.place", {"path": os.path.join(DIAG, name + ".png"), "frame": ref(g, "id"), "embed": True})
    cmd("object.fit", {"mode": "fillProportionally", "ids": [ref(g, "id")]})
    cmd("anchored.insert", {"ids": [ref(g, "id")], "story": ST, "pos": ref(f, "0.start"), "position": "aboveLine", "align": "center", "spaceBefore": 4, "spaceAfter": 6})

# ---------------------------------------------------------------- end block
e = cfg.get("end")
if e:
    es, ex0, _ = page_origin(e["page"])
    r = e["rect"]
    ef = cmd("frame.create", {"spread": es, "rect": [ex0 + r[0], r[1], ex0 + r[2], r[3]], "content": "text",
                              "text": e["head"] + "\n" + e["line"]})
    cmd("object.textFrameOptions", {"ids": [ref(ef, "id")], "ignoreWrap": True, "inset": 0})
    a0 = len(e["head"].encode())
    cmd("text.select", {"story": ref(ef, "story"), "anchor": 0, "focus": a0})
    cmd("type.para", {"attrs": {"align": "center", "spaceAfter": 6}})
    cmd("type.char", {"attrs": {"fontFamily": "Cinzel Decorative", "fontStyle": "Bold", "size": 24, "fill": "Oxblood"}})
    cmd("text.select", {"story": ref(ef, "story"), "anchor": a0 + 1, "focus": a0 + 1 + len(e["line"].encode())})
    cmd("type.para", {"attrs": {"align": "center"}})
    cmd("type.char", {"attrs": {"fontFamily": "EB Garamond", "fontStyle": "Italic", "size": 14, "fill": "Ink"}})

cmd("document.inspect", {})
open(os.path.join(W, cfg["out"] + ".dcs"), "w").write("\n".join(lines) + "\n")
print("steps", step[0])
