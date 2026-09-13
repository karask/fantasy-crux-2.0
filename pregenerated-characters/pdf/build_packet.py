#!/usr/bin/env python3
"""Assemble existing character sheets after their shared company background."""
from pathlib import Path
from io import BytesIO
import re,json,hashlib
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle
from pypdf import PdfReader,PdfWriter
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'output/pdf/last-wagon-company-player-packet.pdf'
TEMP=ROOT/'tmp/pdfs/last-wagon-packet';TEMP.mkdir(parents=True,exist_ok=True)
W,H=A4;GREEN=colors.HexColor('#3b5149');INK=colors.HexColor('#292e28');PAPER=colors.HexColor('#faf7ef')
for name,path in [('Text','NotoSans-Regular'),('Title','NotoSerif-Bold')]:
 pdfmetrics.registerFont(TTFont(name,f'/usr/share/fonts/truetype/noto/{path}.ttf'))
body=ParagraphStyle('body',fontName='Text',fontSize=11,leading=16,spaceAfter=12,textColor=INK)
head=ParagraphStyle('head',fontName='Title',fontSize=27,leading=34,spaceAfter=20,textColor=GREEN)
small=ParagraphStyle('small',parent=body,fontSize=9,leading=12,spaceAfter=8)
def background(c,doc):
 c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(GREEN);c.setFont('Text',8);c.drawString(46,25,'FANTASY CRUX / THE LAST WAGON COMPANY')
def norm(s):
 return s.translate(str.maketrans({'—':' - ','–':'-','’':"'",'“':'"','”':'"'}))
story=[]
for part in (ROOT/'pregenerated-characters/00-company-background.md').read_text().split('\n\n'):
 if part.startswith('# '):story.append(Paragraph(part[2:],head))
 elif part.startswith('## '):story.append(Paragraph(part[3:],ParagraphStyle('sub',parent=head,fontSize=17,leading=23)))
 elif part.strip():story.append(Paragraph(norm(part),body))
roles=[('Mara Holt','Escort and shield protector'),('Pebb Dallow','Negotiator and former forger'),('Dori Ashlar','Bridge worker and mechanism specialist'),('Tamsin Reed','Healer and Flesh Shaper'),('Ilen Sedge','Courier, runner and archer'),('Orren Pike','Dockworker, rescuer and wrestler'),('Seris Vale','Woodland guide and tracker'),('Nerin Quill','Survey assistant and Force/Motion Shaper')]
t=Table([[Paragraph(a,small),Paragraph(b,small)] for a,b in roles],colWidths=[145,W-92-145]);t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('ROWBACKGROUNDS',(0,0),(-1,-1),[colors.HexColor('#ece7d9'),PAPER]),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]));story+=[Spacer(1,14),t]
SimpleDocTemplate(str(TEMP/'front.pdf'),pagesize=A4,leftMargin=46,rightMargin=46,topMargin=55,bottomMargin=52).build(story,onFirstPage=background)
assert len(PdfReader(TEMP/'front.pdf').pages)==1
license=(ROOT/'src/license.md').read_text().split('The following text is the property',1)[1];license='The following text is the property'+license
license=re.sub(r'\s*\{#[^}]+\}','',license)
ls=[Paragraph('License and copyright notices',ParagraphStyle('lh',parent=head,fontSize=19,leading=25))]
for block in license.split('\n\n'):
 if block.strip():ls.append(Paragraph(norm(block.lstrip('# ')),small))
SimpleDocTemplate(str(TEMP/'license.pdf'),pagesize=A4,leftMargin=46,rightMargin=46,topMargin=45,bottomMargin=52).build(ls,onFirstPage=background,onLaterPages=background)
w=PdfWriter();w.append(str(TEMP/'front.pdf'),import_outline=False);w.add_outline_item('The company - nobody gets left behind',0)
names=['mara-holt','pebb-dallow','dori-ashlar','tamsin-reed','ilen-sedge','orren-pike','seris-vale','nerin-quill'];sources=[]
for name in names:
 path=ROOT/'output/pdf'/f'{name}-a4.pdf';r=PdfReader(path);page=len(w.pages)
 w.append(r,import_outline=False);w.add_outline_item(name.replace('-',' ').title(),page)
 sources.append({'name':name,'first_page':page+1,'pages':len(r.pages),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
 for p in w.pages[page:]:
  for im in list(p.images):im.replace(im.image.convert('RGB'),quality=90)
w.add_outline_item('License and copyright notices',len(w.pages));w.append(str(TEMP/'license.pdf'),import_outline=False)
for i,p in enumerate(w.pages,1):
 b=BytesIO();c=canvas.Canvas(b,pagesize=A4);c.setFont('Text',8);c.setFillColor(GREEN);c.drawCentredString(W/2,14,str(i));c.save();b.seek(0);p.merge_page(PdfReader(b).pages[0])
w.compress_identical_objects(remove_duplicates=True,remove_unreferenced=True)
w.add_metadata({'/Title':'Last Wagon Company - Player Packet','/Author':'Fantasy Crux / Konstantinos Karasavvas'})
with OUT.open('wb') as f:w.write(f)
report={'pages':len(w.pages),'bytes':OUT.stat().st_size,'sources':sources}
(ROOT/'pregenerated-characters/pdf/packet-review.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
