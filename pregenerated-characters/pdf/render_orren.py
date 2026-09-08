"""Two A4 pages for Orren Pike, following the approved Tamsin layout."""

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
OUT = ROOT / "output/pdf/orren-pike-a4.pdf"
TMP = ROOT / "tmp/pdfs/orren"
PORTRAIT = ROOT / "pregenerated-characters/pdf/assets/orren-pike-portrait.png"
TMP.mkdir(parents=True, exist_ok=True)
OUT.parent.mkdir(parents=True, exist_ok=True)
audited = next(a for a in json.loads((ROOT / "pregenerated-characters/audit.json").read_text()) if a["name"] == "Orren Pike")
assert audited["skillCount"] == 62

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


def normal(value):
    return str(value).replace("\u2011", "-").replace("\u2013", "-").replace("\u2014", "-").replace("\u2212", "-").replace("’", "'").replace("“", '"').replace("”", '"')


def markup(value):
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", escape(normal(value))).replace("\n", "<br/>")


def para(value, x, top, width, size=10.1, leading=12.7, color=INK, after=5):
    p = Paragraph(markup(value), ParagraphStyle("p", fontName="Body", fontSize=size, leading=leading, textColor=color))
    _, height = p.wrap(width, 10000)
    assert top - height >= 35, f"Overflow on page {c.getPageNumber()}: {value[:60]}"
    p.drawOn(c, x, top-height)
    layout_log.append({"page":c.getPageNumber(), "kind":"paragraph", "top":top, "bottom":top-height, "x":x, "width":width, "font":size, "text":normal(value)})
    return top-height-after


def text(value, x, y, size=9, font="Body", color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, normal(value))


def heading(value, x, top, width, size=10.1):
    c.setStrokeColor(LINE)
    c.setLineWidth(.55)
    c.line(x, top-17, x+width, top-17)
    text(value.upper(), x, top-11.5, size, "Bold", TEAL)
    return top-24


def footer(page):
    c.setStrokeColor(LINE)
    c.setLineWidth(.5)
    c.line(M, 24, W-M, 24)
    text("FANTASY CRUX 2.0 BETA  /  LAST WAGON COMPANY", M, 13, 7.1, "Bold", MUTED)
    c.setFont("Bold", 7.1)
    c.drawRightString(W-M, 13, f"ORREN PIKE  /  {page} OF 2")


def stats(labels, values, top, height=42, value_size=17):
    gap = 4
    width = (WIDTH-(len(labels)-1)*gap)/len(labels)
    for i, (label, value) in enumerate(zip(labels, values)):
        x = M+i*(width+gap)
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
    values = ([headers] if headers else [])+rows
    data = []
    for row, cells in enumerate(values):
        is_header = headers is not None and row == 0
        data.append([Paragraph(markup(cell), ParagraphStyle("cell", fontName="Bold" if is_header else "Body", fontSize=size, leading=leading, textColor=TEAL if is_header else INK, alignment=0 if col==0 else 2)) for col, cell in enumerate(cells)])
    table = Table(data, colWidths=widths, hAlign="LEFT")
    rules = [
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING", (0,0), (-1,-1), pads),
        ("RIGHTPADDING", (0,0), (-1,-1), pads),
        ("TOPPADDING", (0,0), (-1,-1), pads),
        ("BOTTOMPADDING", (0,0), (-1,-1), pads),
        ("LINEBELOW", (0,0), (-1,-1), .25, LINE),
    ]
    if headers:
        rules.append(("BACKGROUND", (0,0), (-1,0), PALE))
    table.setStyle(TableStyle(rules))
    tw, th = table.wrap(sum(widths), 10000)
    assert top-th >= 35, f"Table overflow on page {c.getPageNumber()}: {headers}"
    table.drawOn(c, x, top-th)
    layout_log.append({"page":c.getPageNumber(), "kind":"table", "top":top, "bottom":top-th, "x":x, "width":tw, "font":size, "rows":rows})
    return top-th-7


def skill_group(label, group, x, y, width):
    y = heading(label, x, y, width)
    rows = []
    for skill in group:
        short = re.sub(r"^(Culture|Language|Lore|Craft) \((.+)\)$", r"\2", skill["name"])
        rows.append([short, f"**{skill['score']}%**"])
        skill_log.append({"name":skill["name"], "label":short, "score":skill["score"]})
    return grid(None, rows, [width-32, 32], x, y, 9.5, 11.6, 1.45)


# PAGE 1 - portrait, character, final attributes and possessions.
text("THE LAST WAGON COMPANY  /  THE EXTRA PAIR OF HANDS", M, H-35, 9.2, "Bold", ROSE)
text("Orren Pike", M, H-68, 30, "Display")
text("Orc  /  26  /  Dockworker, salvage hand & wrestler", M, H-85, 10, "Body", MUTED)

hero_top = H-103
portrait_w, portrait_h = 186, 248
c.drawImage(str(PORTRAIT), M, hero_top-portrait_h, width=portrait_w, height=portrait_h, preserveAspectRatio=True, anchor="c", mask="auto")
layout_log.append({"page":1, "kind":"portrait", "x":M, "top":hero_top, "bottom":hero_top-portrait_h, "width":portrait_w})
bx = M+portrait_w+16
bw = W-M-bx
y = hero_top
for paragraph in [
    "Tall and thick through the chest, with grey-green skin, small lower tusks, and dark hair tied in a short queue. His left ear is flattened from wrestling. He handles delicate cups with conspicuous care.",
    "**Personality:** Courteous, literal, and fond of dreadful verse. He dislikes intimidation dressed up as leadership. His weakness is accepting a hard physical job before admitting he needs help.",
    "**Background:** Orren learned salvage work and wrestling on Vellbridge's wharves. Hired to unload the last wagon, he stayed to lift it when the flood came.",
    "**Goal:** Earn an honest living with his strength while protecting his neighbours and company partners.",
    "**Bond:** Mara gave him responsibility during the rescue without treating him as expendable muscle. He trusts her to ask for his judgement as well as his strength.",
]:
    y = para(paragraph, bx, y, bw, size=9.8, leading=12.3, after=5)
y = para('"Which end do you want lifted?"', bx, y, bw, size=10, leading=12.5, color=TEAL, after=0)
y = para("**Mother tongue:** River Crown · **Craft:** Carpenter", bx, y-9, bw, size=9.3, leading=11.8, color=MUTED, after=0)
hero_bottom = min(y, hero_top-portrait_h)

attrs = audited["characteristics"]
y = stats(list(attrs), list(attrs.values()), hero_bottom-12, 42)
y = stats(["HP", "MAJOR WOUND", "POWER POINTS", "HERO POINTS", "ARMOUR", "COMBAT ORDER", "MOVEMENT", "DAMAGE MOD."], [f"{audited['hp']}/{audited['hp']}", audited["mwl"], f"{audited['pp']}/{audited['pp']}", 2, "2 AP", audited["order"], f"{audited['move']} m", audited["dm"]], y-5, 41, 14.5)
lower_top = y-10

x = M
y = heading("Weapons", x, lower_top, COL)
y = grid(["ATTACK", "SKILL", "DAMAGE", "SIZE / RANGE"], [
    ["Great hammer", "54%", "2D8+1D6", "Heavy / 2 m"],
    ["Javelin", "21%", "2D6", "Medium / 34 m"],
    ["Dagger", "54%", "1D4+1+1D6", "Light / 2 m"],
    ["Thrown dagger", "21%", "1D4+1+1D6", "Light / 17 m"],
    ["Unarmed", "54%", "1D3+1D6", "Light / 2 m"],
], [74,31,68,COL-173], x, y, 8.9, 10.8, 2.0)
y = para("**Ready:** Great hammer in both hands; two javelins carried.", x, y, COL, size=9.6, leading=12, after=5)
y = heading("Talents & ancestry", x, y, COL)
for talent in ["Adrenaline Surge", "Wrestler", "Subdue"]:
    y = para("**" + talent + "**", x, y, COL, size=9.8, leading=12.4, after=5)
left_end = y

x = M+COL+GAP
y = heading("Equipment & supplies", x, lower_top, COL)
y = grid(["CARRIED", "QUANTITY / SUPPLY"], [
    ["Leather armour", "1, worn"],
    ["Great hammer, dagger", "1 each"],
    ["Javelins", "2"],
    ["Backpack", "1"],
    ["Rope", "10 m"],
    ["Flint and tinder", "1 set"],
    ["Waterskin", "2 days water"],
    ["Provisions", "14 days"],
    ["Bedroll", "1"],
    ["Block and tackle, crowbar", "1 each"],
    ["Climbing kit", "1"],
    ["Healing kit", "1 kit; 5 uses"],
    ["Lantern and oil", "1 each"],
], [COL*.57, COL*.43], x, y, 9.2, 11.2, 1.7)
y = para("**Money:** 18 SP\n**Listed load:** 19 ENC · **Capacity:** 32 ENC", x, y, COL, size=9.6, leading=12.2, after=5)
y = para("**Condition:** Rested and uninjured.", x, y, COL, size=9.6, leading=12.2, after=0)
layout_log.append({"page":1, "kind":"page_end", "bottom":min(left_end,y)})
footer(1)
c.showPage()

# PAGE 2 - acquired skills and ready workings.
text("ORREN PIKE", M, H-35, 9.2, "Bold", ROSE)
text("Skills & talents", M, H-67, 27, "Display")
skill_top = H-85
skills = audited["skills"]
practical = [s for s in skills if s["category"]=="Practical" and not s["name"].startswith("Craft (")]
groups = [
    [("Resistances", [s for s in skills if s["category"]=="Resistances"]), ("Combat", [s for s in skills if s["category"]=="Combat"]), ("Practical", practical[:7])],
    [("Practical, continued", practical[7:]), ("Craft", [s for s in skills if s["name"]=="Craft (Carpenter)"]), ("Knowledge", [s for s in skills if s["name"] in {"Lore (Salvage)", "Natural Lore"}]), ("Culture", [s for s in skills if s["name"] in {"Culture (Whitewater)"}]), ("Language", [s for s in skills if s["name"]=="Language (River Crown)"])],
]
ends = []
for i, column in enumerate(groups):
    z = skill_top
    for label, group in column:
        z = skill_group(label, group, M+i*(COL+GAP), z, COL)
    ends.append(z)

y = heading("Talents & ancestry", M, min(ends)-16, WIDTH)
notes = [
    ("Adrenaline Surge", "**Once per combat**, immediately after becoming Wounded or Fatigued, ignore their test, Movement, and Combat Order penalties until the end of Orren's next turn. Also ignore the first **1 HP lost to Bleeding** during that time. Bleeding continues afterwards. Exhausted, unconscious, and Dying are unaffected."),
    ("Wrestler", "While **already grappling**, spend a Combat Action and win an opposed **Unarmed Combat (54%)** test. Choose: deal normal unarmed damage (armour applies); make the target drop one held item at their feet; or throw them to an adjacent space, leaving them prone and ending the grapple. The GM may bar outcomes against impossible Size or anatomy."),
    ("Subdue", "Make a blunt Close Combat or Unarmed attack. If not stopped, roll normal weapon/unarmed damage plus DM, then apply partial Parry and armour. Reaching the target's **Major Wound Level** leaves them unconscious, stable, with no HP lost. Otherwise, inflict only the weapon's minimum listed damage, reduced by partial Parry and armour. Talent damage bonuses do not apply. The target wakes at scene end, immediately upon damage, or after successful Healing as a Combat Action."),
    ("The person behind the muscle", "Orren checks a lifting strap before trusting it and offers a practical share of the work. He takes promises literally and recites terrible verses with complete sincerity. If he takes on too much, offer him a specific share of the load to hand over. He wants people to feel safer when he arrives."),
]
card_h = 172
for i, (name, description) in enumerate(notes):
    x = M+(i%2)*(COL+GAP)
    top = y-(i//2)*(card_h+9)
    c.setFillColor(PALE if i<3 else colors.HexColor("#f7f4ef"))
    c.roundRect(x, top-card_h, COL, card_h, 4, stroke=0, fill=1)
    z = para(f"**{name}**", x+10, top-10, COL-20, size=10.2, leading=12.5, after=6)
    z = para(description, x+10, z, COL-20, size=9.5, leading=11.8, after=0)
    assert z >= top-card_h+7, f"Card overflow: {name}"
layout_log.append({"page":2, "kind":"page_end", "bottom":y-2*card_h-9, "skills_bottom":min(ends)})
footer(2)
c.save()

expected_skills = {
    skill["name"] for skill in skills
    if skill["category"] in {"Resistances", "Combat"}
    or (skill["category"]=="Practical" and not skill["name"].startswith("Craft ("))
    or skill["name"] in {"Craft (Carpenter)", "Lore (Salvage)", "Natural Lore", "Culture (Whitewater)", "Language (River Crown)"}
}
assert len(skill_log)==24
assert {skill["name"] for skill in skill_log}==expected_skills
assert all(skill["score"]==next(a["score"] for a in skills if a["name"]==skill["name"]) for skill in skill_log)
writer = PdfWriter()
writer.append(PdfReader(TMP / "body.pdf"))
writer.add_attachment("Open-Game-License-1.0a.md", (ROOT / "pregenerated-characters/LICENSE.md").read_bytes())
writer.add_metadata({"/Title":"Orren Pike - The Extra Pair of Hands", "/Author":"Fantasy Crux 2.0 - Last Wagon Company", "/Subject":"Two-page A4 character sheet with portrait, skills, talents and equipment", "/Keywords":"Fantasy Crux, Orren Pike, Last Wagon Company, character sheet, A4"})
with OUT.open("wb") as stream:
    writer.write(stream)
(TMP / "layout.json").write_text(json.dumps(layout_log, indent=2))
(TMP / "skill-coverage.json").write_text(json.dumps(skill_log, indent=2))
print(f"Created {OUT}")
print(json.dumps([item for item in layout_log if item["kind"]=="page_end"], indent=2))
