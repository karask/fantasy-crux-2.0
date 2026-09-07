"""Two A4 pages: portrait, character details and final values for table use.

Uses the audited roster without changing the character's build. Shared rules
and creation accounting remain in the roster sources, outside this handout.
"""

import json
import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "output/pdf/tamsin-reed-a4.pdf"
TMP = ROOT / "tmp/pdfs/tamsin"
PORTRAIT = ROOT / "pregenerated-characters/pdf/assets/tamsin-reed-portrait.png"
TMP.mkdir(parents=True, exist_ok=True)
OUT.parent.mkdir(parents=True, exist_ok=True)
audited = next(a for a in json.loads((ROOT / "pregenerated-characters/audit.json").read_text()) if a["name"] == "Tamsin Reed")
character = next(c for c in json.loads((ROOT / "pregenerated-characters/characters.json").read_text())["characters"] if c["id"] == "tamsin-reed")
assert audited["skillCount"] == 63

FONT = Path("/usr/share/fonts/truetype/liberation")
if not FONT.exists():
    FONT = Path("/usr/share/fonts/truetype/liberation2")
for name, filename in [("Body", "LiberationSans-Regular.ttf"), ("Bold", "LiberationSans-Bold.ttf"), ("Italic", "LiberationSans-Italic.ttf"), ("Display", "LiberationSerif-Bold.ttf")]:
    pdfmetrics.registerFont(TTFont(name, str(FONT / filename)))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Bold", italic="Italic", boldItalic="Bold")

W, H = A4
M = 29
WIDTH = W - M * 2
GAP = 17
COL = (WIDTH - GAP) / 2
INK = colors.HexColor("#1d2b34")
TEAL = colors.HexColor("#345e5c")
ROSE = colors.HexColor("#a3655c")
PALE = colors.HexColor("#eff4f2")
LINE = colors.HexColor("#ced9d5")
MUTED = colors.HexColor("#55656b")
c = canvas.Canvas(str(TMP / "body.pdf"), pagesize=A4, pageCompression=1)
layout_log = []
skill_log = []


def normal(s):
    return str(s).replace("\u2011", "-").replace("\u2013", "-").replace("\u2014", "-").replace("\u2212", "-").replace("’", "'").replace("“", '"').replace("”", '"')


def markup(s):
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", escape(normal(s))).replace("\n", "<br/>")


def para(value, x, top, width, size=10.1, leading=12.7, color=INK, after=5):
    p = Paragraph(markup(value), ParagraphStyle("p", fontName="Body", fontSize=size, leading=leading, textColor=color))
    _, height = p.wrap(width, 10000)
    assert top - height >= 35, f"Overflow on page {c.getPageNumber()}: {value[:60]}"
    p.drawOn(c, x, top - height)
    layout_log.append({"page": c.getPageNumber(), "kind": "paragraph", "top": top, "bottom": top-height, "x": x, "width": width, "font": size, "text": normal(value)})
    return top - height - after


def text(value, x, y, size=9, font="Body", color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, normal(value))


def heading(value, x, top, width, size=10.1):
    c.setStrokeColor(LINE)
    c.setLineWidth(.55)
    c.line(x, top-17, x+width, top-17)
    text(value.upper(), x, top-11.5, size, "Bold", TEAL)
    return top - 24


def footer(page):
    c.setStrokeColor(LINE)
    c.setLineWidth(.5)
    c.line(M, 24, W-M, 24)
    text("FANTASY CRUX 2.0 BETA  /  LAST WAGON COMPANY", M, 13, 7.1, "Bold", MUTED)
    c.setFont("Bold", 7.1)
    c.drawRightString(W-M, 13, f"TAMSIN REED  /  {page} OF 2")


def stats(labels, values, top, height=42, value_size=17):
    gap = 4
    width = (WIDTH - (len(labels)-1)*gap) / len(labels)
    for i, (label, value) in enumerate(zip(labels, values)):
        x = M + i*(width+gap)
        c.setFillColor(PALE)
        c.roundRect(x, top-height, width, height, 3, stroke=0, fill=1)
        c.setFont("Bold", 7.1)
        c.setFillColor(TEAL)
        c.drawCentredString(x+width/2, top-11, label)
        c.setFont("Bold", value_size)
        c.setFillColor(INK)
        c.drawCentredString(x+width/2, top-height+8, str(value))
    return top-height


def grid(headers, rows, widths, x, top, size=9.1, leading=11.2, pads=2.0):
    values = ([headers] if headers else []) + rows
    data = []
    for row, cells in enumerate(values):
        is_header = headers is not None and row == 0
        data.append([Paragraph(markup(cell), ParagraphStyle("cell", fontName="Bold" if is_header else "Body", fontSize=size, leading=leading, textColor=TEAL if is_header else INK, alignment=0 if col==0 else 2)) for col, cell in enumerate(cells)])
    t = Table(data, colWidths=widths, hAlign="LEFT")
    rules = [
        ("VALIGN", (0,0),(-1,-1), "TOP"),
        ("LEFTPADDING", (0,0),(-1,-1),pads),
        ("RIGHTPADDING", (0,0),(-1,-1),pads),
        ("TOPPADDING", (0,0),(-1,-1),pads),
        ("BOTTOMPADDING", (0,0),(-1,-1),pads),
        ("LINEBELOW", (0,0),(-1,-1),.25,LINE),
    ]
    if headers:
        rules += [("BACKGROUND", (0,0),(-1,0), PALE)]
    t.setStyle(TableStyle(rules))
    tw, th = t.wrap(sum(widths), 10000)
    assert top-th >= 35, f"Table overflow on page {c.getPageNumber()}: {headers}"
    t.drawOn(c,x,top-th)
    layout_log.append({"page":c.getPageNumber(),"kind":"table","top":top,"bottom":top-th,"x":x,"width":tw,"font":size,"rows":rows})
    return top-th-7


def skill_group(label, group, x, y, width):
    y = heading(label, x, y, width)
    rows = []
    for s in group:
        short = re.sub(r"^(Culture|Language|Lore|Craft) \((.+)\)$", r"\2", s["name"])
        short = short.replace("another named", "Other named")
        rows.append([short, f"**{s['score']}%**"])
        skill_log.append({"name": s["name"], "label": short, "score": s["score"]})
    return grid(None, rows, [width-32,32], x, y, 9.5, 11.6, 1.45)


# PAGE 1 - portrait, personal story, final attributes and possessions.
text("THE LAST WAGON COMPANY  /  THE PRACTICAL LAMP", M, H-35, 9.2, "Bold", ROSE)
text("Tamsin Reed", M, H-68, 30, "Display")
text("Human  /  24  /  she/her  /  Synod-trained healer & Flesh Shaper", M, H-85, 10, "Body", MUTED)

hero_top = H-103
portrait_w, portrait_h = 186, 248
c.drawImage(str(PORTRAIT), M, hero_top-portrait_h, width=portrait_w, height=portrait_h, preserveAspectRatio=True, anchor="c", mask="auto")
layout_log.append({"page":1, "kind":"portrait", "x":M, "top":hero_top, "bottom":hero_top-portrait_h, "width":portrait_w})
bx = M+portrait_w+16
bw = W-M-bx
y = hero_top
for paragraph in [
    "Tall and narrow-faced, with dark curls bound back and a small burn scar on her forearm. Her sleeves are evenly rolled; her hands are clean whenever possible.",
    "**Personality:** Warm, direct, and dryly humorous. She asks before touching a patient and makes no promises she cannot keep. She neglects her own exhaustion; a clear handover helps her accept rest.",
    "**Background:** Raised in Whitewater, she trained in a Synod infirmary, where faith meant cleaning the floor after everyone else left. During her initiation vigil, she heard seven heartbeats in her own pulse and closed an injury by touch.",
    "**Goal:** Bring the missing people home alive. Honour her teachers through practical care and keep her patients' confidences.",
    "**Bond:** Mara returned for the last injured guard. Tamsin trusts her to keep the company's promise: nobody gets left behind.",
]:
    y = para(paragraph, bx, y, bw, size=9.8, leading=12.3, after=5)
y = para('"You can be frightened. Keep talking to me."', bx, y, bw, size=10, leading=12.5, color=TEAL, after=0)
y = para("**Mother tongue:** River Crown · **Familiar craft:** Tailor", bx, y-9, bw, size=9.3, leading=11.8, color=MUTED, after=0)
hero_bottom = min(y, hero_top-portrait_h)

attrs = audited["characteristics"]
y = stats(list(attrs), list(attrs.values()), hero_bottom-12, 42)
y = stats(["HP", "MAJOR WOUND", "POWER POINTS", "HERO POINTS", "ARMOUR", "COMBAT ORDER", "MOVEMENT", "DAMAGE MOD."], [f"{audited['hp']}/{audited['hp']}", audited["mwl"], f"{audited['pp']}/{audited['pp']}", 2, "2 AP", audited["order"], f"{audited['move']} m", audited["dm"]], y-5, 41, 14.5)
lower_top = y-10

x = M
y = heading("Weapons", x, lower_top, COL)
y = grid(["ATTACK", "SKILL", "DAMAGE", "SIZE / RANGE"], [
    ["Mace", "51%", "1D8", "Medium / 2 m"],
    ["Sling", "33%", "1D6", "- / 50 m"],
    ["Dagger", "51%", "1D4+1", "Light / 2 m"],
    ["Thrown dagger", "33%", "1D4+1", "Light / 9 m"],
    ["Medium shield", "51%", "1D6", "Heavy / 2 m"],
    ["Unarmed", "21%", "1D3", "Light / 2 m"],
], [80,37,48,COL-165], x, y, 8.9, 10.8, 2.0)
y = para("**Ready:** Mace and medium shield; sling stowed.", x, y, COL, size=9.6, leading=12, after=5)
y = heading("Talents", x, y, COL)
y = para("**Shaping** · Flesh specialty\n**Cells:** Alter·Flesh and Scry·Flesh.", x, y, COL, size=9.8, leading=12.4, after=5)
y = para("**Practice:** An audible litany while handling a washed section of travelling cord.", x, y, COL, size=9.8, leading=12.4, after=5)
y = para("**Tell:** Seven faint shadows gather around Tamsin and the subject or area of her magic.", x, y, COL, size=9.8, leading=12.4, after=0)
left_end = y

x = M+COL+GAP
y = heading("Equipment & supplies", x, lower_top, COL)
y = grid(["CARRIED", "QUANTITY / SUPPLY"], [
    ["Leather armour", "1, worn"],
    ["Mace, sling, dagger", "1 each"],
    ["Medium shield", "1"],
    ["Backpack", "1"],
    ["Rope / prayer cord", "10 m"],
    ["Flint and tinder", "1 set"],
    ["Waterskin", "2 days of water"],
    ["Provisions", "14 days"],
    ["Bedroll", "1"],
    ["Healing kits", "4 kits; 20 uses"],
    ["Lantern", "1"],
    ["Oil", "1 flask"],
    ["Slingbag", "1"],
    ["Sling bullets", "20"],
], [COL*.54, COL*.46], x, y, 9.2, 11.2, 1.7)
y = para("**Money:** 26 SP 5 CP\n**Listed load:** 16 ENC · **Capacity:** 19 ENC", x, y, COL, size=9.6, leading=12.2, after=5)
y = para("**Condition:** Rested and uninjured.", x, y, COL, size=9.6, leading=12.2, after=0)
layout_log.append({"page":1, "kind":"page_end", "bottom":min(left_end,y)})
footer(1)
c.showPage()

# PAGE 2 - acquired skills at their final percentage, followed by four spells.
text("TAMSIN REED", M, H-35, 9.2, "Bold", ROSE)
text("Skills & spells", M, H-67, 27, "Display")
skill_top = H-85
sw = COL
skills = audited["skills"]
practical = [s for s in skills if s["category"]=="Practical" and not s["name"].startswith("Craft (")]
groups = [
    [("Resistances", [s for s in skills if s["category"]=="Resistances"]), ("Combat", [s for s in skills if s["category"]=="Combat"]), ("Practical", practical[:7])],
    [("Practical, continued", practical[7:]), ("Craft", [s for s in skills if s["name"] == "Craft (Tailor)"]), ("Knowledge", [s for s in skills if s["name"] in {"Lore (Medicine)", "Shaping"}]), ("Culture", [s for s in skills if s["name"] == "Culture (Whitewater)"]), ("Language", [s for s in skills if s["name"] == "Language (River Crown)"])],
]
ends = []
for i, gs in enumerate(groups):
    z = skill_top
    for label, ss in gs:
        z = skill_group(label, ss, M+i*(sw+GAP), z, sw)
    ends.append(z)

y = heading("Spells", M, min(ends)-13, WIDTH)
spells = [
    ("Close the wound", "Alter·Flesh  /  Touch  /  1 PP", "Restore **1D4 HP** to one willing living subject. End Bleeding and Dying."),
    ("Wall-crawler", "Alter·Flesh  /  Touch  /  Scene  /  3 PP", "Grow adhesive pads on a willing subject. They climb at normal Movement."),
    ("River lungs", "Alter·Flesh  /  Touch  /  Scene  /  3 PP", "Grow gills on a willing subject so they can breathe water. Swimming speed is unchanged."),
    ("Borrowed face", "Alter·Flesh  /  Touch  /  Scene  /  3 PP", "Give a willing subject a different natural appearance. This grants no borrowed skills or abilities."),
    ("Follow the blood", "Scry·Flesh  /  15 m  /  3 PP", "Using a bodily trace, locate its living source within 15 m through ordinary concealment."),
    ("Silent autopsy", "Scry·Flesh  /  Touch  /  2 PP", "Learn one physical fact from a body: cause of death, age of a wound, or presence of poison or disease."),
]
card_h = 83
for i, (name, details, effect) in enumerate(spells):
    x = M + (i%2)*(COL+GAP)
    top = y - (i//2)*(card_h+9)
    c.setFillColor(PALE)
    c.roundRect(x, top-card_h, COL, card_h, 4, stroke=0, fill=1)
    z = para(f"**{name}**", x+10, top-9, COL-20, size=10.7, leading=12.8, after=3)
    z = para(details, x+10, z, COL-20, size=9.0, leading=11.2, color=TEAL, after=4)
    z = para(effect, x+10, z, COL-20, size=9.4, leading=11.7, after=0)
    assert z >= top-card_h+6, f"Spell card overflow: {name}"
spell_end = y-3*card_h-18
layout_log.append({"page":2, "kind":"page_end", "bottom":spell_end, "skills_bottom":min(ends)})
footer(2)
c.save()

expected_skills = {
    s["name"] for s in skills
    if s["category"] in {"Resistances", "Combat"}
    or (s["category"] == "Practical" and not s["name"].startswith("Craft ("))
    or s["name"] in {"Craft (Tailor)", "Lore (Medicine)", "Shaping", "Culture (Whitewater)", "Language (River Crown)"}
}
assert len(skill_log) == 24
assert {s["name"] for s in skill_log} == expected_skills
assert all(s["score"] == next(a["score"] for a in skills if a["name"]==s["name"]) for s in skill_log)
writer = PdfWriter()
writer.append(PdfReader(TMP / "body.pdf"))
writer.add_attachment("Open-Game-License-1.0a.md", (ROOT / "pregenerated-characters/LICENSE.md").read_bytes())
writer.add_metadata({"/Title":"Tamsin Reed - The Practical Lamp", "/Author":"Fantasy Crux 2.0 - Last Wagon Company", "/Subject":"Two-page A4 character sheet with portrait, complete skills, spells and equipment", "/Keywords":"Fantasy Crux, Tamsin Reed, Last Wagon Company, character sheet, A4"})
with OUT.open("wb") as f:
    writer.write(f)
(TMP / "layout.json").write_text(json.dumps(layout_log, indent=2))
(TMP / "skill-coverage.json").write_text(json.dumps(skill_log, indent=2))
print(f"Created {OUT}")
print(json.dumps([s for s in layout_log if s["kind"]=="page_end"], indent=2))
