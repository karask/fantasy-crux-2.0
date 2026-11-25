#!/usr/bin/env python3
"""Build the illustrated GM edition from booklet.md. No network calls.

Uses ReportLab and Pillow. Run with the bundled workspace Python runtime.
Sections flow across pages. Maps and print handouts may request a fresh page;
font sizes remain fixed and ReportLab reports unplaceable content.
"""
from pathlib import Path
from io import BytesIO
import json
import re
import html
from pypdf import PdfReader, PdfWriter

from PIL import Image as PILImage
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph, Table, TableStyle, Spacer, Frame, Flowable, KeepTogether, SimpleDocTemplate, PageBreak

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
ASSETS = HERE / 'assets'
OUT = ROOT / 'output/pdf/the-dragon-at-the-horse-fair-gm.pdf'
W, H = A4
M = 46
CW = W - 2*M
INK = colors.HexColor('#292e28')
GREEN = colors.HexColor('#3b5149')
GOLD = colors.HexColor('#b58a45')
RUST = colors.HexColor('#89512e')
PAPER = colors.HexColor('#faf7ef')
FAINT = colors.HexColor('#ece7d9')

for family, filename in [('Body','NotoSans'),('Display','NotoSerif')]:
    for suffix, fname in [('', 'Regular'),('-Bold','Bold'),('-Italic','Italic')]:
        pdfmetrics.registerFont(TTFont(family+suffix, f'/usr/share/fonts/truetype/noto/{filename}-{fname}.ttf'))
    pdfmetrics.registerFontFamily(family, normal=family, bold=family+'-Bold', italic=family+'-Italic', boldItalic=family+'-Bold')

for name in ['Kalam','Italianno','PatrickHand']:
    pdfmetrics.registerFont(TTFont(name, str(ASSETS/'fonts'/f'{name}-Regular.ttf')))

STYLES = {
    'body': ParagraphStyle('body', fontName='Body', fontSize=10.45, leading=14.45, textColor=INK, spaceAfter=7,allowWidows=0,allowOrphans=0),
    'head': ParagraphStyle('head', fontName='Display-Bold', fontSize=14.3, leading=18.3, textColor=GREEN, spaceBefore=9, spaceAfter=7, keepWithNext=True),
    'quote': ParagraphStyle('quote', fontName='Display-Italic', fontSize=10.8, leading=15.5, textColor=GREEN, spaceAfter=0),
    'cell': ParagraphStyle('cell', fontName='Body', fontSize=9.55, leading=13, textColor=INK),
    'th': ParagraphStyle('th', fontName='Body-Bold', fontSize=9.2, leading=12.5, textColor=colors.white),
    'caption': ParagraphStyle('caption', fontName='Body-Italic', fontSize=8.5, leading=11.5, textColor=GREEN, spaceAfter=8),
    'legal': ParagraphStyle('legal', fontName='Body', fontSize=9.1, leading=12.1, textColor=INK, spaceAfter=8),
    'handout': ParagraphStyle('handout', fontName='Display', fontSize=13.2, leading=20.2, textColor=INK, spaceAfter=13),
}

def normalize(s):
    return s.translate(str.maketrans({'\u2014':' - ', '\u2013':'-', '\u2019':"'", '\u2018':"'", '\u201c':'"', '\u201d':'"', '\u00a0':' ', '\u2026':'...', '\u2011':'-'}))

def inline(s):
    s=html.escape(normalize(s))
    s=re.sub(r'\[([^]]+)\]\((https?://[^)]+)\)', r'<link href="\2" color="#3b5149"><u>\1</u></link>',s)
    s=re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>',s)
    s=re.sub(r'`([^`]+)`',r'<b>\1</b>',s)
    return s

def para(s, kind='body'):
    return Paragraph(inline(s),STYLES[kind])

def table(rows):
    n=len(rows[0]); ratios=[1/n]*n
    if n==2:
        first=rows[0][0].lower()
        if first in ['key','skill %','trait']:
            ratios=[.20,.80] if first!='skill %' else [.13,.87]
        elif first in ['table time','actor']:
            ratios=[.23,.77]
        elif 'at the table' in first: ratios=[.86,.14]
        elif first=='result': ratios=[.35,.65]
        elif first=='company member': ratios=[.27,.73]
        elif first=='ordinary-person default': ratios=[.35,.65]
        elif first=='clue': ratios=[.32,.68]
    elif n==4:
        ratios=[.39,.11,.39,.11]
    elif n==3:
        ratios=[.34,.23,.43] if rows[0][0]!='Actor' else [.20,.24,.56]
    cells=[[para(v,'th' if i==0 else 'cell') for v in row] for i,row in enumerate(rows)]
    t=Table(cells,colWidths=[CW*r for r in ratios],hAlign='LEFT',repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0),GREEN),
        ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.HexColor('#f0ecdf'),colors.HexColor('#f8f5ed')]),
        ('VALIGN',(0,0),(-1,-1),'TOP'),
        ('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),
        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('LINEBELOW',(0,0),(-1,0),.5,GOLD),
        ('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#dcd6c4')),
    ]))
    return [t,Spacer(1,10)]

_image_cache={}
def image_reader(path):
    path=str(path)
    if path not in _image_cache:
        im=PILImage.open(path).convert('RGB')
        stream=BytesIO(); im.save(stream,format='JPEG',quality=92,subsampling=0,optimize=True)
        stream.seek(0)
        _image_cache[path]=(ImageReader(stream),im.size)
    return _image_cache[path]

class Art(Flowable):
    def __init__(self,name,kind=None):
        super().__init__(); self.name=name; self.kind=kind
        self.width=CW
        _,(iw,ih)=image_reader(ASSETS/name)
        self.height=CW*ih/iw
    def draw(self):
        c=self.canv; reader,_=image_reader(ASSETS/self.name)
        c.drawImage(reader,0,0,width=self.width,height=self.height)
        # Keys are publication annotations, not generated map text.
        keys={
            'routes':[('A',.805,.49),('B',.59,.61),('C',.279,.373),('D',.263,.242),('E',.113,.277),('F',.136,.094)],
            'yard':[('1',.073,.182),('2',.902,.227),('3',.849,.419),('4',.331,.197),('5',.557,.838),('6',.683,.830)],
        }.get(self.kind,[])
        for label,x,y in keys:
            px=x*self.width;py=(1-y)*self.height
            c.setFillColor(PAPER);c.setStrokeColor(RUST);c.setLineWidth(1)
            c.circle(px,py,8.6,fill=1,stroke=1)
            c.setFillColor(RUST);c.setFont('Body-Bold',9)
            c.drawCentredString(px,py-3.2,label)

class Portrait(Art):
    def __init__(self,name):
        super().__init__(name)
        self.width=110; self.height=110; self.hAlign='CENTER'

class Letter(Flowable):
    def __init__(self,hand,text):
        super().__init__(); self.width=CW; self.height=215
        self.hand=hand
        font='Kalam' if hand=='Ada' else 'Italianno'
        size=13.6 if hand=='Ada' else 22
        self.p=Paragraph(inline(text),ParagraphStyle('letter',fontName=font,fontSize=size,leading=20.8,textColor=colors.HexColor('#3f3024')))
        _,self.ph=self.p.wrap(CW-90,180)
        if self.ph>173: raise RuntimeError('Handwritten message does not fit parchment')
    def draw(self):
        c=self.canv;reader,_=image_reader(ASSETS/'09-parchment.png')
        c.drawImage(reader,0,0,width=CW,height=self.height)
        self.p.drawOn(c,45,(self.height-self.ph)/2)

class Placard(Flowable):
    def __init__(self,text):
        super().__init__();self.width=CW;self.height=345
        self.blocks=[x.strip() for x in text.split('\n\n') if x.strip()]
    def draw(self):
        c=self.canv;reader,_=image_reader(ASSETS/'09-parchment.png')
        c.drawImage(reader,0,0,width=CW,height=self.height)
        style=ParagraphStyle('placard',fontName='PatrickHand',fontSize=18,leading=23,textColor=colors.HexColor('#3f3024'))
        y=self.height-30
        for index,text in enumerate(self.blocks):
            size=21 if index==0 else 15
            text=text.replace(" LOWER PLATFORM:","\nLOWER PLATFORM:")
            st=ParagraphStyle('p',parent=style,fontSize=size,leading=size+5)
            p=Paragraph(inline(text).replace('\n','<br/>'),st)
            _,h=p.wrap(CW-94,500);y-=h;p.drawOn(c,47,y);y-=9
        if y<35:raise RuntimeError('Placard text exceeds parchment')

class RuleLine(Flowable):
    def __init__(self,cut=False):super().__init__();self.width=CW;self.height=36 if cut else 12;self.cut=cut
    def draw(self):
        c=self.canv;c.setStrokeColor(GOLD);c.setLineWidth(.6)
        if self.cut:c.setDash(3,4)
        c.line(0,self.height/2,CW,self.height/2)

class Weights(Flowable):
    def __init__(self):super().__init__();self.width=CW;self.height=140
    def draw(self):
        c=self.canv
        for i,v in enumerate([1,2,4,8]):
            x=22+i*116
            c.setFillColor(FAINT);c.setStrokeColor(GOLD);c.roundRect(x,31,91,76,4,fill=1,stroke=1)
            c.setFillColor(INK);c.setFont('Display-Bold',31);c.drawCentredString(x+45.5,55,str(v))
        c.setFont('Body',9.5);c.drawCentredString(CW/2,8,'Four whole blocks. Choose what remains on the upper platform.')

class Flow(Flowable):
    def __init__(self):super().__init__();self.width=CW;self.height=64
    def draw(self):
        c=self.canv; labels=['Fair','Clues','Orchard','Thieves','Lift','Reunion']
        bw=72;gap=(CW-6*bw)/5
        for i,label in enumerate(labels):
            x=i*(bw+gap)
            c.setFillColor(GREEN if i in [0,5] else FAINT);c.setStrokeColor(GOLD)
            c.roundRect(x,18,bw,33,3,stroke=1,fill=1)
            c.setFillColor(colors.white if i in [0,5] else INK);c.setFont('Body-Bold',9.5)
            c.drawCentredString(x+bw/2,30,label)
            if i<5:
                c.setStrokeColor(GOLD);c.line(x+bw+2,34,x+bw+gap-2,34)
                c.line(x+bw+gap-5,36,x+bw+gap-2,34);c.line(x+bw+gap-5,32,x+bw+gap-2,34)

def parse_page(content):
    lines=content.strip().splitlines();out=[];i=0;handout=False
    while i<len(lines):
        line=lines[i].strip()
        if not line:i+=1;continue
        if line=='@@characters':i+=1;continue
        if line=='@@placard':
            bits=[];i+=1
            while i<len(lines) and lines[i].strip()!='@@endplacard':
                bits.append(lines[i]);i+=1
            out.append(Placard('\n'.join(bits)));i+=1;continue
        if line.startswith('@@portrait|'):
            out.extend([Portrait(line.split('|')[1]),Spacer(1,12)]);i+=1;continue
        if line.startswith('@@letter|'):
            _,hand,message=line.split('|',2);out.extend([Letter(hand,message),Spacer(1,8)]);i+=1;continue
        if line=='@@handout':handout=True;i+=1;continue
        if line=='@@endhandout':handout=False;i+=1;continue
        if line=='@@flow':out.append(Flow());i+=1;continue
        if line=='@@weights':out.append(Weights());i+=1;continue
        if line=='@@cut':out.append(RuleLine(True));i+=1;continue
        if line.startswith('@@art|') or line.startswith('@@map|'):
            directive,name,extra=line.split('|',2)
            art=Art(name,extra if directive=='@@map' else None)
            art.keepWithNext=bool(directive=='@@art')
            out.append(art)
            if directive=='@@art':out.append(para(extra,'caption'))
            out.append(Spacer(1,7))
            i+=1;continue
        if line.startswith('## '):out.append(para(line[3:],'head'));i+=1;continue
        if line.startswith('|'):
            rows=[]
            while i<len(lines) and lines[i].strip().startswith('|'):
                row=[x.strip() for x in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r'[-: ]+',x) for x in row):rows.append(row)
                i+=1
            out.extend(table(rows));continue
        if line.startswith('>'):
            bits=[]
            while i<len(lines) and lines[i].strip().startswith('>'):
                bits.append(lines[i].strip()[1:].strip());i+=1
            q='<br/><br/>'.join(' '.join(x.split()) for x in '\n'.join(bits).split('\n\n') if x.strip())
            # Preserve explicit paragraph breaks in the source quote.
            q=' '.join(bits) if '' not in bits else '<br/><br/>'.join(' '.join(x) for x in split_empty(bits))
            if handout:
                out.append(Paragraph(inline(q).replace('&lt;br/&gt;','<br/>'),STYLES['handout']));out.append(Spacer(1,12))
            else:
                qp=Paragraph(inline(q).replace('&lt;br/&gt;','<br/>'),STYLES['quote'])
                t=Table([[qp]],colWidths=[CW]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),FAINT),('LINEBEFORE',(0,0),(0,-1),3,GOLD),('LEFTPADDING',(0,0),(-1,-1),13),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
                out.extend([t,Spacer(1,11)])
            continue
        bits=[line];i+=1
        while i<len(lines) and lines[i].strip() and not lines[i].startswith(('##','@@','>','|')):
            bits.append(lines[i].strip());i+=1
        out.append(para(' '.join(bits),'handout' if handout else 'body'))
    return out

def split_empty(bits):
    groups=[[]]
    for b in bits:
        if not b:groups.append([])
        else:groups[-1].append(b)
    return [g for g in groups if g]

def furniture(c,num,kicker,title):
    c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setStrokeColor(GOLD);c.setLineWidth(.65);c.line(M,H-39,W-M,H-39)
    c.setFillColor(GREEN);c.setFont('Body-Bold',8)
    c.drawString(M,H-29,'FANTASY CRUX / THE DRAGON AT THE HORSE FAIR')
    c.setFont('Body',8);c.drawRightString(W-M,H-29,'GAMEMASTER EDITION')
    c.setFont('Body-Bold',8.3);c.setFillColor(RUST);c.drawString(M,H-62,kicker)
    tp=Paragraph(inline(title),ParagraphStyle('title',fontName='Display-Bold',fontSize=25.2,leading=30,textColor=GREEN))
    _,th=tp.wrap(CW,100);tp.drawOn(c,M,H-76-th)
    c.setStrokeColor(GOLD);c.line(M,37,W-M,37)
    c.setFillColor(GREEN);c.setFont('Body',8)
    footer='PLAYER HANDOUT' if kicker.startswith('PLAYER') else 'RILLMARKET / THE CROWNLESS REALMS'
    c.drawString(M,24,footer);c.setFont('Body-Bold',9);c.drawRightString(W-M,24,str(num))
    c.bookmarkPage(f'page-{num}');c.addOutlineEntry(f'{num}. {title}',f'page-{num}',0,False)
    return H-88-th

def cover(c):
    reader,(iw,ih)=image_reader(ASSETS/'01-fair-cover.png')
    c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    # Full bleed cover image, preserving its aspect ratio.
    scale=max(W/iw,H/ih);dw,dh=iw*scale,ih*scale
    c.drawImage(reader,(W-dw)/2,(H-dh)/2,width=dw,height=dh)
    c.setFillColor(PAPER);c.setFillAlpha(.92);c.rect(27,H-217,W-54,183,fill=1,stroke=0);c.setFillAlpha(1)
    c.setStrokeColor(GOLD);c.setLineWidth(.8);c.rect(34,H-210,W-68,169,fill=0,stroke=1)
    c.setFillColor(GREEN);c.setFont('Body-Bold',11);c.drawCentredString(W/2,H-69,'FANTASY CRUX 2.0')
    c.setFont('Display-Bold',34);c.drawCentredString(W/2,H-111,'THE DRAGON')
    c.setFont('Display-Bold',28);c.drawCentredString(W/2,H-146,'AT THE HORSE FAIR')
    c.setFont('Body',10.4);c.drawCentredString(W/2,H-178,'An introductory adventure in the Crownless Realms')
    c.setFillColor(GREEN);c.rect(0,0,W,71,fill=1,stroke=0)
    c.setFillColor(colors.white);c.setFont('Body-Bold',11);c.drawCentredString(W/2,43,'ILLUSTRATED GAMEMASTER EDITION')
    c.setFont('Body',9.4);c.drawCentredString(W/2,23,'3-5 players  /  Four hours  /  Full NPC statistics and handouts')
    c.bookmarkPage('page-1');c.addOutlineEntry('1. Cover','page-1',0,False);c.showPage()

def license_flowables():
    s=(ROOT/'src/license.md').read_text()
    s=s.split('The following text is the property',1)[1]
    s='The following text is the property'+s
    s=re.sub(r'\s*\{#[^}]+\}','',s)
    out=[]
    for block in s.strip().split('\n\n'):
        if block.startswith('## '):out.append(para(block[3:],'head'))
        else:out.append(para(block,'legal'))
    return out

class SectionTitle(Paragraph):
    def __init__(self,title,kicker):
        st=ParagraphStyle('section',fontName='Display-Bold',fontSize=19,leading=23,textColor=GREEN,spaceBefore=14,spaceAfter=11,keepWithNext=True)
        super().__init__(inline(title),st)
        self.section_title=title;self.kicker=kicker

class BookDoc(SimpleDocTemplate):
    def afterFlowable(self,flowable):
        if hasattr(flowable,'section_title'):
            num=self.page+1;key=f'section-{len(self.sections)}'
            self.canv.bookmarkPage(key)
            self.sections.append({'page':num,'title':flowable.section_title})

def running(c,doc):
    c.saveState();c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setStrokeColor(GOLD);c.setLineWidth(.6);c.line(M,H-39,W-M,H-39);c.line(M,37,W-M,37)
    c.setFillColor(GREEN);c.setFont('Body-Bold',8);c.drawString(M,H-29,'FANTASY CRUX / THE DRAGON AT THE HORSE FAIR')
    c.setFont('Body',8);c.drawRightString(W-M,H-29,'GAMEMASTER EDITION');c.drawString(M,24,'RILLMARKET / THE CROWNLESS REALMS')
    c.setFont('Body-Bold',9);c.drawRightString(W-M,24,str(doc.page+1));c.restoreState()

def main():
    temp=ROOT/'tmp/pdfs/dragon-fair';temp.mkdir(parents=True,exist_ok=True)
    coverfile=temp/'cover.pdf';c=canvas.Canvas(str(coverfile),pagesize=A4);cover(c);c.save()
    raw=(HERE/'booklet.md').read_text()
    blocks=re.split(r'@@(page|section)\|',raw)[1:]
    story=[];edition=[]
    for i in range(0,len(blocks),2):
        mode,chunk=blocks[i:i+2];header,content=chunk.split('\n',1);kicker,title=header.split('|',1)
        if mode=='page' and story and kicker in ['PLAYER HANDOUT','NPCS']:story.append(PageBreak())
        heading=SectionTitle(title,kicker)
        parts=parse_page(content)
        if kicker=='EDITION':
            edition=parts;continue
        # Keep the portrait with identity and personality, while allowing later skills/text to flow.
        if parts and isinstance(parts[0],Portrait):
            portrait=parts[0];description=parts[2:4];parts=parts[4:]
            card=Table([[portrait,description]],colWidths=[125,CW-125])
            card.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
            story.append(KeepTogether([heading,card,parts.pop(0)]))
        elif parts and isinstance(parts[0],Art):
            art=parts.pop(0);art.keepWithNext=False
            group=[heading,art]
            if parts and isinstance(parts[0],Paragraph):group.append(parts.pop(0))
            story.append(KeepTogether(group))
        elif kicker=='PLAYER HANDOUT':
            story.append(KeepTogether([heading]+parts));parts=[]
        else:
            # Carry scene headings and short lead-ins together with their first substantive block.
            if parts:
                first=parts.pop(0);initial=[heading,first]
                if isinstance(first,Paragraph) and len(first.getPlainText())<130 and parts:initial.append(parts.pop(0))
                story.append(KeepTogether(initial))
            else:story.append(heading)
        story.extend(parts)
    story.append(PageBreak());story.append(SectionTitle('License and copyright notices','OPEN GAME LICENSE 1.0a'));story.extend(edition);story.extend(license_flowables())
    doc=BookDoc(str(temp/'body.pdf'),pagesize=A4,leftMargin=M,rightMargin=M,topMargin=52,bottomMargin=54,allowSplitting=1)
    doc.sections=[];doc.build(story,onFirstPage=running,onLaterPages=running)
    writer=PdfWriter();writer.append(str(coverfile),import_outline=False);writer.append(str(temp/'body.pdf'),import_outline=False)
    writer.add_outline_item('Cover',0)
    for row in doc.sections:writer.add_outline_item(row['title'],row['page']-1)
    writer.add_metadata({'/Title':'The Dragon at the Horse Fair - Gamemaster Edition','/Author':'Fantasy Crux / Konstantinos Karasavvas'})
    with OUT.open('wb') as f:writer.write(f)
    report={'pages':len(writer.pages),'sections':doc.sections,'bytes':OUT.stat().st_size,'layout':'Continuous sections; dedicated breaks for NPC appendix, print handouts and license.'}
    (HERE/'review/layout-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))

if __name__=='__main__':main()
