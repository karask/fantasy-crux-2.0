"""Build four seven-page, blank, interactive Fantasy Crux character sheets.

Coordinates are millimetres from the top left. Existing Vivid Ink masters are
placed without modifying them. Every entry box is a real PDF form field.
"""

import json
import math
import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, NumberObject, BooleanObject

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/pdf"
WORK = ROOT / "tmp/pdfs/character-sheets"
REVIEW = ROOT / "character-sheets/review"
MM = 72 / 25.4
W, H = A4
M, CW, GAP = 12, 186, 4
INK = colors.HexColor("#233039")
MUTED = colors.HexColor("#56636A")
LINE = colors.HexColor("#ADB5B8")
PALE = colors.HexColor("#EDF0F0")
WHITE = colors.white

FONTS = Path("/usr/share/fonts/truetype/noto")
for name, file in [
    ("Body", "NotoSans-Regular.ttf"), ("Bold", "NotoSans-Bold.ttf"),
    ("Serif", "NotoSerif-Regular.ttf"), ("Display", "NotoSerifDisplay-Bold.ttf"),
]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / file)))

THEMES = [
    dict(id="ironbound", name="Ironbound", subtitle="THE ADVENTURER'S DOSSIER",
         color="#993D35", light="#F6EDEB", display="Bold", frame="cut",
         art="armour-field-sketch", concept="Angular plates, vermilion banners and riveted frames."),
    dict(id="wayfarer", name="Wayfarer", subtitle="A FIELD JOURNAL",
         color="#20645C", light="#EAF2EF", display="Display", frame="round",
         art="adventuring-company", concept="Teal trail marks, rounded panels and a left-hand portrait."),
    dict(id="starweaver", name="Starweaver", subtitle="A RECORD OF DEEDS & WONDERS",
         color="#654776", light="#F1EDF5", display="Display", frame="star",
         art="ritual-company", concept="Violet geometry, constellation details and a central portrait."),
    dict(id="chronicle", name="Chronicle", subtitle="THE COMPANY REGISTER",
         color="#755A31", light="#F5F1E8", display="Serif", frame="double",
         art="bridge-hill-fort", concept="Warm brass rules, a nameplate and traditional ledger columns."),
]


class Sheet:
    def __init__(self, theme):
        self.t = theme
        self.accent = colors.HexColor(theme["color"])
        self.light = colors.HexColor(theme["light"])
        self.path = WORK / f"{theme['id']}-body.pdf"
        self.c = canvas.Canvas(str(self.path), pagesize=A4, pageCompression=1)
        self.c.setTitle(f"Fantasy Crux - {theme['name']} character sheet")
        self.fields = []
        self.labels = []
        self.sections = []

    def text(self, s, x, y, size=8, font="Body", color=INK, align="left"):
        self.c.setFillColor(color)
        self.c.setFont(font, size)
        fn = {"left": self.c.drawString, "center": self.c.drawCentredString, "right": self.c.drawRightString}[align]
        fn(x * MM, H - y * MM, s)
        width = pdfmetrics.stringWidth(s, font, size) / MM
        left = x if align == "left" else x - (width / 2 if align == "center" else width)
        assert left >= 6 and left + width <= 204, (s, left, width)
        self.labels.append(dict(page=self.c.getPageNumber(), text=s, x=left, y=y, w=width, size=size))

    def para(self, s, x, y, w, size=7.6, leading=10):
        p = Paragraph(s, ParagraphStyle("note", fontName="Body", fontSize=size,
                                       leading=leading, textColor=MUTED))
        _, height = p.wrap(w * MM, 1000)
        p.drawOn(self.c, x * MM, H - y * MM - height)
        return y + height / MM

    def line(self, x1, y1, x2, y2, color=LINE, weight=.45):
        self.c.setStrokeColor(color)
        self.c.setLineWidth(weight)
        self.c.line(x1 * MM, H - y1 * MM, x2 * MM, H - y2 * MM)

    def rect(self, x, y, w, h, color=LINE, fill=None, weight=.55, radius=0):
        self.c.setStrokeColor(color)
        self.c.setFillColor(fill or WHITE)
        self.c.setLineWidth(weight)
        if radius:
            self.c.roundRect(x * MM, H - (y + h) * MM, w * MM, h * MM, radius * MM, stroke=1, fill=int(fill is not None))
        else:
            self.c.rect(x * MM, H - (y + h) * MM, w * MM, h * MM, stroke=1, fill=int(fill is not None))

    def polygon(self, pts, fill=None, color=None, weight=1):
        p = self.c.beginPath()
        p.moveTo(pts[0][0] * MM, H - pts[0][1] * MM)
        for x, y in pts[1:]:
            p.lineTo(x * MM, H - y * MM)
        p.close()
        self.c.setStrokeColor(color or self.accent)
        self.c.setFillColor(fill or WHITE)
        self.c.setLineWidth(weight)
        self.c.drawPath(p, stroke=1, fill=int(fill is not None))

    def frame(self, x, y, w, h, fill=None):
        style = self.t["frame"]
        if style == "cut":
            d = 2
            self.polygon([(x+d,y),(x+w-d,y),(x+w,y+d),(x+w,y+h-d),
                          (x+w-d,y+h),(x+d,y+h),(x,y+h-d),(x,y+d)], fill, self.accent, .8)
        elif style == "round":
            self.rect(x, y, w, h, self.accent, fill, .7, 2.4)
        else:
            self.rect(x, y, w, h, self.accent, fill, .65)
            if style == "double":
                for d in (1.2,):
                    self.line(x+d,y+d,x+9,y+d,self.accent,.5)
                    self.line(x+d,y+d,x+d,y+9,self.accent,.5)
                    self.line(x+w-d,y+h-d,x+w-9,y+h-d,self.accent,.5)
                    self.line(x+w-d,y+h-d,x+w-d,y+h-9,self.accent,.5)
            else:
                for cx, cy in [(x,y),(x+w,y),(x,y+h),(x+w,y+h)]:
                    self.polygon([(cx,cy-1),(cx+1,cy),(cx,cy+1),(cx-1,cy)], WHITE, self.accent, .6)

    def field(self, name, x, y, w, h, size=10, multi=False, border=False, tooltip=None):
        page = self.c.getPageNumber()
        assert 10 <= x and x+w <= 200 and y >= 10 and y+h < 284, (page, name, x, y, w, h)
        full = f"{self.t['id']}.{name}"
        assert full not in {f['name'] for f in self.fields}, full
        self.c.acroForm.textfield(
            name=full, tooltip=tooltip or name.replace("_", " ").replace(".", " / "),
            x=x*MM, y=H-(y+h)*MM, width=w*MM, height=h*MM,
            value="", fontName="Helvetica", fontSize=size,
            textColor=INK, borderColor=LINE, fillColor=WHITE,
            borderWidth=.4 if border else 0, forceBorder=False,
            fieldFlags="multiline doNotScroll" if multi else "doNotScroll",
            annotationFlags="print", maxlen=4000 if multi else 160,
        )
        self.fields.append(dict(name=full, kind="text", page=page, x=x, y=y, w=w, h=h, multi=multi))

    def check(self, name, label, x, y, size=7.5):
        full = f"{self.t['id']}.{name}"
        self.c.acroForm.checkbox(name=full, tooltip=label, x=x*MM, y=H-(y+3.3)*MM,
                                size=3.3*MM, checked=False, buttonStyle="check",
                                borderWidth=.6, borderColor=self.accent, fillColor=WHITE,
                                textColor=INK, annotationFlags="print", fieldFlags="")
        self.fields.append(dict(name=full,kind="check",page=self.c.getPageNumber(),x=x,y=y,w=3.3,h=3.3))
        if label:
            self.text(label,x+4.8,y+2.9,size)

    def entry(self, name, label, x, y, w, h=14, multi=False, size=10):
        self.text(label.upper(), x, y+2.7, 6.8, "Bold", self.accent)
        self.field(name,x+.3,y+4,w-.6,h-4.8,size,multi)
        self.line(x,y+h,x+w,y+h)

    def area(self, name, title, x, y, w, h, ruled=True, grid=False, hint=None):
        self.frame(x,y,w,h)
        self.text(title.upper(),x+3,y+5,8,"Bold",self.accent)
        top = y+8
        if hint:
            self.text(hint,x+3,y+9.8,6.5,color=MUTED)
            top=y+12
        self.field(name,x+2.5,top,w-5,h-(top-y)-2.5,10,True)
        if ruled:
            for yy in self.frange(top+6,y+h-2,7):
                self.line(x+3,yy,x+w-3,yy,LINE,.28)
        if grid:
            self.c.setFillColor(LINE)
            for xx in self.frange(x+5,x+w-3,5):
                for yy in self.frange(top+4,y+h-3,5):
                    self.c.circle(xx*MM,H-yy*MM,.22,stroke=0,fill=1)

    @staticmethod
    def frange(a,b,step):
        while a < b:
            yield a
            a += step

    def section(self,title,x,y,w):
        self.sections.append(dict(page=self.c.getPageNumber(),title=title,x=x,y=y,w=w))
        if self.t['frame']=="cut":
            self.polygon([(x,y),(x+w,y),(x+w-2,y+6),(x,y+6)],self.accent,self.accent,.4)
            self.text(title.upper(),x+2,y+4.3,8,"Bold",WHITE)
        elif self.t['frame']=="round":
            self.rect(x,y,w,6,self.light,self.light,.2,1.5)
            self.text(title.upper(),x+2,y+4.3,8,"Bold",self.accent)
            self.line(x+w-13,y+3,x+w-3,y+3,self.accent,.65)
        else:
            self.text(title.upper(),x,y+4.3,8,"Bold",self.accent)
            self.line(x,y+6,x+w,y+6,self.accent,.65)
        return y+8

    def emblem(self,x,y,size=6):
        if self.t['id']=="ironbound":
            self.polygon([(x-size,y-size),(x+size,y-size),(x+size*.8,y+size*.4),(x,y+size),(x-size*.8,y+size*.4)],None,self.accent,1.2)
            self.line(x,y-size+2,x,y+size-2,self.accent,.6)
        elif self.t['id']=="wayfarer":
            self.c.setStrokeColor(self.accent)
            self.c.setLineWidth(.6)
            self.c.circle(x*MM,H-y*MM,size*MM,stroke=1)
            self.polygon([(x,y-size),(x+2,y),(x,y+size),(x-2,y)],self.light,self.accent,.65)
            self.line(x-size,y,x+size,y,self.accent,.5)
        elif self.t['id']=="starweaver":
            for a in range(0,360,60):
                rad=math.radians(a)
                self.line(x,y,x+math.cos(rad)*size,y+math.sin(rad)*size,self.accent,.6)
            self.polygon([(x,y-size),(x+size,y),(x,y+size),(x-size,y)],None,self.accent,.9)
        else:
            self.polygon([(x-size,y-size*.7),(x,y-size*.4),(x+size,y-size*.7),
                          (x+size,y+size*.7),(x,y+size),(x-size,y+size*.7)],None,self.accent,.8)
            self.line(x,y-size*.4,x,y+size,self.accent,.65)

    def start(self,page,title,subtitle):
        self.c.bookmarkPage(f"page-{page}")
        self.c.addOutlineEntry(title,f"page-{page}",0)
        if self.t['id']=="ironbound":
            self.rect(8,10,1.3,274,self.accent,self.accent,0)
            for yy in (13,284):
                self.c.setFillColor(self.accent)
                self.c.circle(8.65*MM,H-yy*MM,1,stroke=0,fill=1)
        elif self.t['id']=="wayfarer":
            self.c.setDash(2,3)
            self.line(8.5,13,8.5,283,self.accent,.5)
            self.c.setDash()
        elif self.t['id']=="starweaver":
            for yy in (14,76,161,231,282):
                self.polygon([(8,yy-1),(9,yy),(8,yy+1),(7,yy)],None,self.accent,.4)
        else:
            self.line(8,11,8,284,self.accent,.4)
            self.line(9,11,9,284,self.accent,.25)
        self.text("FANTASY CRUX",M,15,8.6,"Bold",self.accent)
        self.text(f"2.0 BETA  /  {self.t['name'].upper()}",M,19.3,6.8,"Body",MUTED)
        self.text(title,M,30,21,self.t['display'])
        self.text(subtitle,M,36,7.1,color=MUTED)
        self.emblem(190,20,6.5)
        self.line(M,39,198,39,self.accent,.8)
        if page>1:
            self.text("CHARACTER",137,34,6.2,"Bold",self.accent)
            self.field(f"page{page}.character",157,28.9,41,6,9)
            self.line(157,35.6,198,35.6)
        self.line(M,285,198,285,self.accent,.6)
        self.text(f"{self.t['name'].upper()}  /  FANTASY CRUX 2.0",M,290,6.5,"Bold",self.accent)
        self.text(f"{page:02d} / 07",198,290,7,"Bold",self.accent,"right")
        self.text("A4  /  Print at actual size  /  Type or write in the blank spaces",105,294,5.7,color=MUTED,align="center")

    def portrait(self,x,y,w,h):
        self.frame(x,y,w,h)
        if self.t['id']=="starweaver":
            self.line(x+3,y+8,x+3,y+2,self.accent,.4)
            self.line(x+w-3,y+8,x+w-3,y+2,self.accent,.4)
        self.text("PORTRAIT",x+w/2,y+5,7,"Bold",self.accent,"center")
        self.text("Sketch or place your character here",x+w/2,y+h-3,5.6,color=MUTED,align="center")
        # The drawing area deliberately has no text widget, so it stays blank.
        self.sections.append(dict(page=1,title="Blank portrait",x=x,y=y,w=w,h=h))

    def identity(self):
        k=self.t['id']
        if k=="starweaver":
            self.portrait(84,44,42,56)
            for name,label,y in [('name','Character name',44),('ancestry','Ancestry / culture',63),('concept','Concept / calling',82)]:
                self.entry(f"identity.{name}",label,12,y,67,17)
            for name,label,y in [('player','Player / campaign',44),('details','Age / pronouns',63),('company','Company / role',82)]:
                self.entry(f"identity.{name}",label,131,y,67,17)
        elif k=="chronicle":
            self.entry('identity.name','Character name',12,43,130,16,size=15)
            self.entry('identity.player','Player / campaign',12,63,63,16)
            self.entry('identity.ancestry','Ancestry / culture',79,63,63,16)
            self.entry('identity.details','Age / pronouns',12,83,40,17)
            self.entry('identity.concept','Concept / company role',56,83,86,17)
            self.portrait(147,44,51,56)
        else:
            px=145 if k=="ironbound" else 12
            ix=12 if k=="ironbound" else 71
            self.portrait(px,44,53,56)
            self.entry('identity.name','Character name',ix,44,127,17,size=15)
            self.entry('identity.player','Player / campaign',ix,65,62,15)
            self.entry('identity.ancestry','Ancestry / culture',ix+66,65,61,15)
            self.entry('identity.details','Age / pronouns',ix,84,35,16)
            self.entry('identity.concept','Concept / company role',ix+39,84,88,16)

    def characteristics(self,y):
        labels=[('STR','Strength'),('CON','Constitution'),('DEX','Dexterity'),('SIZ','Size'),('INT','Intelligence'),('POW','Power'),('CHA','Charisma')]
        w=(CW-6*2)/7
        for i,(abbr,label) in enumerate(labels):
            x=M+i*(w+2)
            self.frame(x,y,w,27)
            self.text(abbr,x+w/2,y+5,10,"Bold",self.accent,"center")
            self.text(label,x+w/2,y+8.6,5.5,color=MUTED,align="center")
            self.field(f"characteristics.{abbr}.permanent",x+2,y+11,w/2-3,9,14)
            self.field(f"characteristics.{abbr}.current",x+w/2+1,y+11,w/2-3,9,14)
            self.line(x+w/2,y+12,x+w/2,y+20)
            self.line(x+2,y+20,x+w-2,y+20)
            self.text('PERM.',x+w*.25,y+24,5.3,"Bold",MUTED,"center")
            self.text('CURRENT',x+w*.75,y+24,5.3,"Bold",MUTED,"center")

    def icon(self,kind,x,y,w,h):
        if kind=="heart":
            p=self.c.beginPath()
            def pt(a,b): return ((x+a*w)*MM,H-(y+b*h)*MM)
            p.moveTo(*pt(.5,1))
            p.curveTo(*pt(.36,.86),*pt(0,.6),*pt(0,.26))
            p.curveTo(*pt(0,-.06),*pt(.35,-.08),*pt(.5,.15))
            p.curveTo(*pt(.65,-.08),*pt(1,-.06),*pt(1,.26))
            p.curveTo(*pt(1,.6),*pt(.64,.86),*pt(.5,1))
            p.close()
            self.c.setStrokeColor(self.accent); self.c.setLineWidth(1.2)
            self.c.setFillColor(WHITE); self.c.drawPath(p,stroke=1,fill=1)
        elif kind=="armour":
            pts=[(.08,.06),(.3,0),(.34,.13),(.66,.13),(.7,0),(.92,.06),(1,.34),(.81,.39),(.82,.85),(.68,1),(.32,1),(.18,.85),(.19,.39),(0,.34)]
            self.polygon([(x+a*w,y+b*h) for a,b in pts],WHITE,self.accent,1.2)
            # Layered pauldrons and the waist plate make this read as armour.
            for side in (0,1):
                flip=lambda a: 1-a if side else a
                self.line(x+flip(.04)*w,y+.2*h,x+flip(.2)*w,y+.27*h,self.accent,.65)
                self.line(x+flip(.2)*w,y+.27*h,x+flip(.26)*w,y+.15*h,self.accent,.65)
                self.line(x+flip(.24)*w,y+.45*h,x+flip(.27)*w,y+.75*h,self.accent,.65)
            self.line(x+w*.26,y+h*.85,x+w*.74,y+h*.85,self.accent,.65)
            self.line(x+w*.26,y+h*.9,x+w*.74,y+h*.9,self.accent,.4)
        elif kind=="gem":
            pts=[(.23,0),(.77,0),(1,.27),(.85,.8),(.5,1),(.15,.8),(0,.27)]
            self.polygon([(x+a*w,y+b*h) for a,b in pts],WHITE,self.accent,1.2)
            for a,b in [(.23,0),(.77,0)]:
                self.line(x+a*w,y+b*h,x+w*.5,y+h*.13,self.accent,.55)
        else:
            pts=[]
            for i in range(10):
                a=math.radians(i*36-90);r=1 if i%2==0 else .66
                pts.append((x+w/2+math.cos(a)*w/2*r,y+h/2+math.sin(a)*h/2*r))
            self.polygon(pts,WHITE,self.accent,1.2)

    def resources(self,y):
        items=[('hp','HIT POINTS','heart'),('pp','POWER POINTS','gem'),('armour','ARMOUR POINTS','armour'),('hero','HERO POINTS','star')]
        for i,(key,label,kind) in enumerate(items):
            x=M+i*47.5
            self.text(label,x+21.8,y+2.5,7,"Bold",self.accent,"center")
            self.icon(kind,x+6,y+6,32,25)
            if key in ('hp','pp'):
                self.field(f"resources.{key}.current",x+12,y+15,8,7,13)
                self.field(f"resources.{key}.maximum",x+23,y+15,8,7,13)
                self.text('/',x+21.5,y+20.5,12,color=MUTED,align="center")
                self.text('NOW / MAX',x+22,y+25,5.4,"Bold",MUTED,"center")
            else:
                self.field(f"resources.{key}",x+16,y+14,12,8,15)
                self.text('AP' if key=='armour' else 'UNSPENT',x+22,y+25,5.7,"Bold",MUTED,"center")
            hint={'hp':'Maximum = (SIZ + CON) / 2','pp':'Maximum = POW; commitments on p5',
                  'armour':'From worn armour / protection','hero':'Starting Hero Points: 2'}[key]
            self.text(hint,x+22,y+34,5.4,color=MUTED,align='center')

    def mini_stats(self,items,x,y,w,h=18,prefix="derived"):
        gap=2;sw=(w-gap*(len(items)-1))/len(items)
        for i,(key,label,hint) in enumerate(items):
            xx=x+i*(sw+gap)
            self.frame(xx,y,sw,h)
            self.text(label.upper(),xx+sw/2,y+4,6.6,"Bold",self.accent,"center")
            self.field(f"{prefix}.{key}",xx+3,y+5.5,sw-6,h-10,12)
            if hint:self.text(hint,xx+sw/2,y+h-1.8,5.4,color=MUTED,align="center")

    def table(self,prefix,headers,widths,x,y,rows,rh=7,static=None):
        total=sum(widths)
        self.rect(x,y,total,7,self.light,self.light,.2)
        xx=x
        for label,w in zip(headers,widths):
            self.text(label.upper(),xx+1.4,y+4.6,6.3,"Bold",self.accent)
            xx+=w
        y+=7
        for r in range(rows):
            xx=x
            for j,w in enumerate(widths):
                value=static.get((r,j)) if static else None
                if value is not None:
                    self.text(value,xx+1.5,y+rh*.65,7.5)
                else:
                    self.field(f"{prefix}.{r+1}.{j+1}",xx+1,y+.6,w-2,rh-1.2,9)
                if j:self.line(xx,y,xx,y+rh,LINE,.3)
                xx+=w
            self.line(x,y+rh,x+total,y+rh,LINE,.4)
            y+=rh
        return y

    def page1(self):
        self.start(1,"Character & combat",self.t['subtitle'])
        self.identity()
        if self.t['id'] in ('wayfarer','chronicle'):
            self.resources(104);self.characteristics(143)
        else:
            self.characteristics(105);self.resources(137)
        self.mini_stats([
            ('mwl','Major wound','maximum HP / 2'),('damage','Damage mod.','from STR + SIZ'),
            ('order','Combat order','add 1D10 in combat'),('movement','Movement','metres / round'),
            ('armour_enc','Armour ENC','deducted from order'),
        ],M,176,CW,19)
        self.text('Round attribute halves up. Combat Order = (DEX + INT) / 2 - armour ENC.',M,200,6.6,color=MUTED)
        y=self.section('Weapons & ready defences',M,205,CW)
        self.table('weapons',['Weapon / shield / unarmed','Skill %','Damage *','Size','Range','Hands / tags'],[64,20,29,19,22,32],M,y,5,6)
        self.text('* Record final ordinary damage, including applicable DM and Talents.',M,253,6.5,color=MUTED)
        self.check('condition.wounded','Wounded',12,257)
        self.check('condition.bleeding','Bleeding',44,257)
        self.check('condition.dying','Dying',74,257)
        self.check('condition.fatigued','Fatigued',99,257)
        self.check('condition.exhausted','Exhausted',130,257)
        self.check('condition.unconscious','Unconscious',164,257)
        self.entry('condition.other','Other conditions / recovery reminders',12,265,128,14)
        self.text('DYING ROUNDS',147,268,6.6,"Bold",self.accent)
        for i in range(3):self.check(f'condition.dying_round_{i+1}',str(i+1),147+i*16,273,7)
        self.c.showPage()

    def page2(self):
        self.start(2,"Skills",'Creation bases, point spending and current scores')
        headers=['Skill / subject','Formula','Base','Pool +','IP gain','Score %','Crit. end']
        widths=[56,27,20,18,19,22,24]
        self.table('unused',headers,widths,M,43,0)
        res=[('Dodge','DEX + 10'),('Persistence','POW + 10'),('Resilience','CON + POW')]
        combat=[('Close Combat','DEX + STR'),('Ranged Combat','DEX + INT'),('Unarmed Combat','DEX + STR')]
        know=[('Natural Lore','INT + 10'),('Culture (own)','INT + 10','subject'),
              ('Culture (other)','INT','subject'),('Culture (other)','INT','subject'),
              ('Language (own)','INT + 50','subject'),('Language (other)','INT','subject'),
              ('Language (other)','INT','subject'),('Lore (own)','INT + 10','subject'),
              ('Lore (other)','INT','subject'),('Lore (other)','INT','subject'),('Shaping *','INT + POW')]
        prac=[('Athletics','DEX + STR'),('Craft','INT + 10','subject'),('Craft','INT + 10','subject'),
              ('Craft','INT + 10','subject'),('Craft','INT + 10','subject'),('Deception','DEX + INT'),
              ('Driving','DEX + INT'),('Healing','INT + 10'),('Influence','CHA + 10'),
              ('Mechanisms','DEX + INT'),('Perception','INT + POW'),('Performance','CHA + 10'),
              ('Riding','DEX + POW'),('Sailing','DEX + INT'),('Streetwise','CHA + POW'),('Trade','INT + 10')]
        groups=[('Resistances',res),('Combat',combat),('Knowledge',know),('Practical',prac)]
        if self.t['id']=='wayfarer':groups=[groups[0],groups[3],groups[1],groups[2]]
        elif self.t['id']=='starweaver':groups=[groups[2],groups[0],groups[1],groups[3]]
        y=50
        for group,skills in groups:
            self.rect(M,y,CW,5.5,self.light,self.light,.1)
            self.text(group.upper(),M+1.5,y+3.8,7.1,'Bold',self.accent)
            y+=5.5
            for i,item in enumerate(skills):
                name,formula=item[:2];prefix=f"skill.{group.lower()}.{i+1}"
                self.text(name,M+1.5,y+3.8,7.4)
                if len(item)>2:
                    label_w=pdfmetrics.stringWidth(name,'Body',7.4)/MM
                    self.field(prefix+'.subject',M+label_w+3,y+.4,52-label_w,4.9,8)
                    self.line(M+label_w+3,y+5.1,M+54,y+5.1,LINE,.28)
                self.text(formula,M+57.5,y+3.8,7,color=MUTED)
                xx=M+83
                for col,w in enumerate(widths[2:]):
                    self.field(f'{prefix}.{["base","pool","ip","score","critical"][col]}',xx+1,y+.35,w-2,4.9,10)
                    self.line(xx,y,xx,y+5.65,LINE,.28)
                    xx+=w
                self.line(M,y+5.65,198,y+5.65,LINE,.35)
                y+=5.65
        self.para('* Shaping requires the Shaping Talent. Each named Culture, Language, Lore and Craft is a separate skill. Base + Pool + IP gain records creation spending; update Score during play. Later characteristic changes do not recalculate skills.',M,y+3,CW,7.1,9.2)
        self.para('Criticals run from 01 to the entered end number: use the integer tens digit of the unmodified skill, with a minimum of 01. Record situational Bonus/Penalty dice separately.',M,y+13,CW,7.1,9.2)
        self.c.showPage()

    def talent_card(self,n,x,y,w,h=35):
        self.frame(x,y,w,h)
        self.entry(f'talent.{n}.name','Talent / ability',x+3,y+2,w-6,9)
        self.entry(f'talent.{n}.cost','IP cost',x+3,y+12,15,9,size=9)
        self.entry(f'talent.{n}.prerequisite','Prerequisite / source',x+22,y+12,w-25,9,size=9)
        self.text('EFFECT / TRIGGER / COST / LIMIT',x+3,y+25,5.8,'Bold',self.accent)
        self.field(f'talent.{n}.effect',x+3,y+26,w-6,h-28,8,True)

    def page3(self):
        self.start(3,'Talents & creation','Record the exceptions that make this character yours')
        # Equal writing capacity, with two different card arrangements.
        if self.t['id'] in ('ironbound','chronicle'):
            for i in range(6):self.talent_card(i+1,M+(i%2)*95,44+(i//2)*42,91,40)
        else:
            # Three taller columns create a visibly different folio layout.
            for i in range(6):self.talent_card(i+1,M+(i%3)*63.3,44+(i//3)*63,59.4,59)
        y=self.section('Creation ledger',M,173,CW)
        self.text('Use campaign ancestry starts and limits. For humans: start at 8, distribute 30, creation maximum 18.',M,y+2,6.6,color=MUTED)
        self.table('creation.characteristics',['Characteristic','STR','CON','DEX','SIZ','INT','POW','CHA'],[39]+[21]*7,M,y+5,3,6,
                   {(0,0):'Ancestry / rolled start',(1,0):'Allocation change',(2,0):'IP increase'})
        y=218
        self.table('creation.pools',['Skill pool','Start','Traded *','Allocated','Left'],[30,13,16,19,13],M,y,4,6,
                   {(0,0):'Resistance',(1,0):'Combat',(2,0):'Knowledge',(3,0):'Practical',
                    (0,1):'50',(1,1):'50',(2,1):'50',(3,1):'75',(2,2):'-'})
        self.entry('creation.ip.ordinary','Ordinary IP',107,218,27,14)
        self.entry('creation.ip.converted','Converted IP',139,218,27,14)
        self.entry('creation.ip.unspent','Unspent IP',171,218,27,14)
        self.entry('creation.ip.spending','IP spent: ancestry / characteristics / skills / talents',107,237,91,14)
        self.para('* Trade 5 pool points for 1 IP: at most 20 points from each of Resistance, Combat and Practical. Converted IP cannot improve skills. Ordinary starting IP: 10.',M,255,91,7.1,9.5)
        self.para('Add at most +30 to one skill during creation; skills cap at 100%. A starting Shaper reserves and spends 20 IP before allocating Knowledge points. PCs begin with 2 Hero Points.',107,255,91,7.1,9.5)
        self.check('creation.checked','Characteristics, pools, prerequisites, equipment and derived values checked',M,275,7.2)
        self.c.showPage()

    def art(self,x,y,w,h):
        source=ROOT/'art/library/subjects'/self.t['art']/'styles/inked-adventure-comic-vivid.png'
        self.c.saveState()
        clip=self.c.beginPath();clip.rect(x*MM,H-(y+h)*MM,w*MM,h*MM);self.c.clipPath(clip,stroke=0)
        reader=ImageReader(str(source));iw,ih=reader.getSize()
        scale=max(w*MM/iw,h*MM/ih)
        dw,dh=iw*scale,ih*scale
        self.c.drawImage(reader,x*MM+(w*MM-dw)/2,H-(y+h)*MM+(h*MM-dh)/2,dw,dh,mask='auto')
        self.c.restoreState()
        self.rect(x,y,w,h,self.accent,None,.65)

    def page4(self):
        self.start(4,'Equipment & supplies','Ready, carried, stored and spent')
        self.mini_stats([('load','Carried ENC','all carried items'),('capacity','Capacity','STR + SIZ'),
                         ('maximum','Hard limit','2 x (STR + SIZ)'),('wealth','Starting SP','normally 4D6 x 10')],M,44,CW,19,'equipment')
        y=self.section('Armour & load',M,68,CW)
        self.entry('equipment.armour','Armour / fit / modifications',M,y,98,13)
        self.entry('equipment.armour_ap','AP',114,y,23,13)
        self.entry('equipment.armour_enc','ENC',141,y,23,13)
        self.check('equipment.overloaded','Overloaded',170,y+6,7)
        self.text('Above Capacity: -1P on physical and Fatigue tests; half Movement. Containers do not reduce ENC.',M,95,6.6,color=MUTED)
        y=self.section('Inventory',M,100,CW)
        self.table('inventory',['Item / description','Qty','ENC each','Total ENC','Where / ready / charges'],[78,14,21,21,52],M,y,16,6)
        self.text('Include armour, weapons, containers and contents. Every 20 negligible items in a suitable container = 1 ENC.',M,216,6.25,color=MUTED)
        y=self.section('Consumables & purse',M,220,CW)
        self.entry('supply.food','Provisions / days',M,y,40,11)
        self.entry('supply.water','Water / days',56,y,40,11)
        self.entry('supply.ammo','Ammunition / count',100,y,46,11)
        self.entry('supply.healing','Healing kit / uses',150,y,48,11)
        self.entry('money.cp','Copper',M,244,25,12)
        self.entry('money.sp','Silver',41,244,25,12)
        self.entry('money.gp','Gold',70,244,25,12)
        self.entry('money.other','Other valuables / debts',99,244,99,12)
        self.area('equipment.stored','Stored gear / mount / transport',M,260,111,21,True)
        self.area('supply.other','Other supplies / uses',127,260,71,21,True)
        self.c.showPage()

    def spell_card(self,n,x,y,w,h):
        self.frame(x,y,w,h)
        self.text(f'{n:02d}',x+w-4,y+5,8,'Bold',self.accent,'right')
        self.entry(f'spell.{n}.name','Common spell / working',x+3,y+2,w-12,11)
        self.entry(f'spell.{n}.cell','Exact Technique - Form cell(s)',x+3,y+15,w-6,11,size=9)
        labels=[('intensity','Sum I'),('range','Range'),('duration','Dur.'),('reach','Reach'),('adjustments','Adj.'),('magnitude','Mag.')]
        sw=(w-6)/6
        for i,(key,label) in enumerate(labels):
            xx=x+3+i*sw
            self.text(label.upper(),xx+sw/2,y+30,5.8,'Bold',self.accent,'center')
            self.field(f'spell.{n}.{key}',xx+1,y+31,sw-2,6,10)
            self.line(xx+.5,y+37,xx+sw-.5,y+37)
        self.entry(f'spell.{n}.pp','PP / casting dice',x+3,y+40,(w-10)/2,11,size=9)
        self.entry(f'spell.{n}.defence','Delivery / defence',x+w/2+2,y+40,(w-10)/2,11,size=9)
        self.text('OUTCOME / TARGETS / DURATION IN PLAY',x+3,y+56,5.8,'Bold',self.accent)
        self.field(f'spell.{n}.effect',x+3,y+58,w-6,h-61,9,True)
        for yy in self.frange(y+64,y+h-2,6):self.line(x+3,yy,x+w-3,yy,LINE,.28)

    def page5(self):
        self.start(5,'Shaping & enchantments','Your training, active effects and magical commitments')
        self.mini_stats([('score','Shaping %','Knowledge skill'),('intensity','Max intensity','expertise limit'),
                         ('safe','Safe magnitude','expertise limit'),('active_limit','Active limit','permanent INT'),
                         ('committed','Committed PP','reduces available max.'),('available','Available max PP','maximum - committed')],M,44,CW,18,'magic')
        self.entry('magic.specialty','Specialty / initiation',M,67,58,24,True)
        self.entry('magic.practice','Practice / requirement',74,67,60,24,True)
        self.entry('magic.tell','Tell / visible sign',138,67,60,24,True)
        y=self.section('Known exact cells',M,98,CW)
        self.table('magic.cells',['Technique','Form','IP paid','Learned from / date / notes'],[33,39,19,95],M,y,5,7)
        self.text('Each cell is learned separately. Knowing one grants no other cell in that Form or Technique.',M,153,6.6,color=MUTED)
        y=self.section('Ongoing magic & commitments',M,159,CW)
        self.table('ongoing',['Effect / target / anchor','Mag.','Cast result','Ends / maintenance','PP tied'],[68,15,24,59,20],M,y,4,8)
        self.mini_stats([('active_total','Active total','sum of active Magnitude'),
                         ('capacity','Enchantment capacity','if granted by Talent'),
                         ('capacity_used','Capacity used','enchantments held'),
                         ('pp_recovery','PP recovered','per 2 hours of rest')],M,213,CW,19,'magic')
        self.text('Active Magnitude cannot exceed permanent INT. Record each effect\'s full Magnitude and casting result.',M,238,6.5,color=MUTED)
        self.area('magic.rituals','Rituals / components / lasting prices',M,244,91,37,True)
        self.area('magic.enchantments','Enchanted items / anchors / release terms',107,244,91,37,True)
        self.c.showPage()

    def page6(self):
        self.start(6,'Common spells','Keep your most-used workings ready at the table')
        self.text('Magnitude = sum of outcome Intensities + Range + Duration + Reach + adjustments.',M,46,7,color=MUTED)
        self.text('Record actual distances, targets and duration below. Confirm the full effect and price with the GM.',M,51,6.6,color=MUTED)
        for i in range(4):self.spell_card(i+1,M+(i%2)*95,57+(i//2)*113,91,108)
        self.c.showPage()

    def page7(self):
        self.start(7,'Journal & advancement','The people, promises and places that shape your story')
        if self.t['id'] in ('ironbound','starweaver'):
            ax=147;tx=M
        else:
            ax=M;tx=67
        self.art(ax,44,51,34)
        self.area('story.appearance','Appearance / personality',tx,44,131,34,True)
        self.area('story.background','Background / loyalties / beliefs',M,83,91,37,True)
        self.area('story.goals','Goals / bonds / company promise',107,83,91,37,True)
        self.area('story.contacts','Allies / rivals / companions',M,125,91,41,True)
        self.area('story.magic_items','Enchanted items / anchors / obligations',107,125,91,41,True)
        if self.t['id'] in ('wayfarer','starweaver'):
            self.area('journal.notes','Session notes / discoveries',M,171,108,58,True)
            self.area('journal.map','Sketch / map / symbols',124,171,74,58,False,True)
        else:
            self.area('journal.notes','Session notes / discoveries',M,171,121,58,True)
            self.area('journal.map','Sketch / map / symbols',137,171,61,58,False,False)
        y=self.section('Advancement log',M,234,CW)
        self.table('advancement',['Date / session','Improvement / new value','IP earned','IP spent','IP left'],[31,98,19,19,19],M,y,3,7)
        self.text('Skills keep their scores when characteristics rise. Recalculate derived attributes after permanent changes.',M,276,6.5,color=MUTED)
        self.text('Rules text: Open Game Content. Full Open Game License 1.0a is embedded as an attachment in this PDF.',M,281,5.9,color=MUTED)
        self.c.showPage()

    def finish(self):
        for method in (self.page1,self.page2,self.page3,self.page4,self.page5,self.page6,self.page7):method()
        self.c.save()
        reader=PdfReader(self.path)
        writer=PdfWriter();writer.clone_document_from_reader(reader)
        # Transparent widget appearances preserve ruled paper and icon artwork.
        # They remain printable interactive fields; the blank sheet has no values.
        for page in writer.pages:
            page[NameObject('/Tabs')]=NameObject('/S')
            for ref in page.get('/Annots',[]):
                obj=ref.get_object()
                if obj.get('/FT')=='/Tx':
                    stream=obj['/AP']['/N'].get_object()
                    data=stream.get_data()
                    # ReportLab paints a white rectangle before every appearance.
                    # Remove only that first background fill, leaving text intact.
                    data=re.sub(rb'1 1 1 rg\s*0 0 [\d.]+ [\d.]+ re\s*f\s*',b'',data,count=1)
                    stream.set_data(data)
                    if '/MK' in obj:obj['/MK'].pop('/BG',None)
        writer.root_object['/AcroForm'][NameObject('/NeedAppearances')]=BooleanObject(False)
        writer.add_attachment('Open-Game-License-1.0a.md',(ROOT/'src/license.md').read_bytes())
        writer.add_metadata({'/Title':f"Fantasy Crux - {self.t['name']} character sheet",
                             '/Author':'Fantasy Crux / Konstantinos Karasavvas',
                             '/Subject':'Seven-page blank, printable and fillable A4 character sheet',
                             '/Keywords':'Fantasy Crux, character creation, blank character sheet, fillable, A4'})
        final=OUT/f"fantasy-crux-character-sheet-{self.t['id']}-a4.pdf"
        with final.open('wb') as stream:writer.write(stream)
        return dict(theme=self.t,output=str(final.relative_to(ROOT)),pages=7,fields=self.fields,
                    labels=self.labels,sections=self.sections)


def main():
    for p in (OUT,WORK,REVIEW):p.mkdir(parents=True,exist_ok=True)
    manifests=[]
    for theme in THEMES:
        manifest=Sheet(theme).finish();manifests.append(manifest)
        print(f"Created {manifest['output']}: {len(manifest['fields'])} fields")
    (REVIEW/'manifest.json').write_text(json.dumps(manifests,indent=2)+'\n')


if __name__=='__main__':main()
