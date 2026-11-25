from pathlib import Path
import json, re, html, hashlib
from urllib.parse import unquote
from reportlab.pdfgen import canvas
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak, HRFlowable, Preformatted
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT=Path.cwd()
SCRATCH=ROOT/'tmp/pdfs/seven-bells-mobile'
OUTPUT=ROOT/'output/pdf/seven-bells-for-no-king-mobile.pdf'
docs=json.loads((SCRATCH/'inputs.json').read_text())
lookup={d['file']:d for d in docs}
for name,filename in [('Read','DejaVuSans.ttf'),('ReadBold','DejaVuSans-Bold.ttf'),('Code','DejaVuSansMono.ttf')]:
    pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+filename))
pdfmetrics.registerFontFamily('Read',normal='Read',bold='ReadBold',italic='Read',boldItalic='ReadBold')
INK=HexColor('#203144'); ACCENT=HexColor('#986129'); MUTED=HexColor('#647181')
styles={
 'body':ParagraphStyle('body',fontName='Read',fontSize=12,leading=17.5,textColor=INK,spaceAfter=8,splitLongWords=True),
 'quote':ParagraphStyle('quote',fontName='Read',fontSize=11.5,leading=16.5,textColor=MUTED,leftIndent=10,spaceAfter=8),
 'card':ParagraphStyle('card',fontName='Read',fontSize=11.5,leading=16,textColor=INK,spaceAfter=6),
 'cardtitle':ParagraphStyle('cardtitle',fontName='ReadBold',fontSize=11,leading=15,textColor=ACCENT,spaceBefore=8,spaceAfter=5,keepWithNext=True),
 'h1':ParagraphStyle('h1',fontName='ReadBold',fontSize=23,leading=28,textColor=INK,spaceAfter=18,keepWithNext=True),
 'h2':ParagraphStyle('h2',fontName='ReadBold',fontSize=16,leading=21,textColor=INK,spaceBefore=16,spaceAfter=9,keepWithNext=True),
 'h3':ParagraphStyle('h3',fontName='ReadBold',fontSize=12.5,leading=17,textColor=ACCENT,spaceBefore=12,spaceAfter=7,keepWithNext=True),
 'code':ParagraphStyle('code',fontName='Code',fontSize=7,leading=9.5,textColor=INK,spaceAfter=10),
 'small':ParagraphStyle('small',fontName='Read',fontSize=9,leading=12,textColor=MUTED,spaceAfter=8),
}
def norm(s):
    return re.sub(r'\{#[^}]+\}','',str(s)).replace('\u2011','-').replace('\u2013','-').replace('\u2014',' - ')
def esc(s): return html.escape(norm(s),quote=False)
def link_target(href,doc):
    if href.startswith(('http:','https:','mailto:')): return href
    if href.startswith('/rules/'): return 'https://fantasycrux.org'+href
    name,sep,frag=unquote(href).partition('#')
    p=(Path(doc['file']).parent/name).resolve() if name else Path(doc['file'])
    if str(p) in lookup:
        dest=lookup[str(p)]; return '#'+dest['anchors'].get(frag,dest['id']) if frag else '#'+dest['id']
    if '/src/content/rules/' in str(p):
        parts=str(p).split('/src/content/rules/')[1].split('/')
        return 'https://fantasycrux.org/rules/'+parts[0]+'/'
    return None
def inline(t,doc):
    result=[]; links=[]
    for c in t.get('children') or []:
        kind=c['type']
        if kind=='text': result.append(esc(c['content']))
        elif kind=='strong_open': result.append('<b>')
        elif kind=='strong_close': result.append('</b>')
        elif kind=='em_open': result.append('<i>')
        elif kind=='em_close': result.append('</i>')
        elif kind=='code_inline': result.append('<font name="Code" size="9">'+esc(c['content'])+'</font>')
        elif kind in ('softbreak','hardbreak'): result.append(' ' if kind=='softbreak' else '<br/>')
        elif kind=='link_open':
            attrs=c.get('attrs') or {}; attrs=dict(attrs) if isinstance(attrs,list) else attrs
            target=link_target(attrs.get('href',''),doc); links.append(bool(target))
            if target: result.append('<a href="'+html.escape(target,quote=True)+'" color="#815325">')
        elif kind=='link_close':
            if links.pop():result.append('</a>')
        elif kind=='image': result.append(esc(c.get('content','')))
    return ''.join(result) or esc(t.get('content',''))
class Book(BaseDocTemplate):
    def __init__(self,path):
        super().__init__(str(path),pagesize=(324,576),leftMargin=22,rightMargin=22,topMargin=30,bottomMargin=30,title='Seven Bells for No King - Mobile GM Edition',author='Fantasy Crux')
        self.addPageTemplates(PageTemplate(id='reading',frames=[Frame(22,30,280,516,id='body',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=self.furniture))
    def furniture(self,c,doc):
        c.saveState(); c.setFillColor(MUTED); c.setFont('Read',7)
        if doc.page>1:c.drawString(22,558,'SEVEN BELLS FOR NO KING  /  GM EDITION')
        c.drawRightString(302,17,str(doc.page)); c.restoreState()
    def afterFlowable(self,f):
        if getattr(f,'bookmark',None):
            self.canv.bookmarkPage(f.bookmark)
            self.canv.addOutlineEntry(f.getPlainText(),f.bookmark,level=f.outline,closed=f.outline>0)
            if f.outline==0:self.notify('TOCEntry',(0,f.getPlainText(),self.page,f.bookmark))

story=[Spacer(1,75),Paragraph('SEVEN BELLS<br/>FOR NO KING',styles['h1']),Paragraph('A sandbox campaign in the Crownless Realms',styles['h2']),Paragraph('MOBILE GM EDITION',styles['cardtitle']),Paragraph('Approximately 25 sessions · Full campaign · Introductory adventures · Creature references',styles['body']),Spacer(1,20),Paragraph('Spoilers throughout. This edition is for the Gamemaster.',styles['body']),Paragraph('Large single-column text, internal links, PDF bookmarks, and wide reference tables converted to labelled entries. Source Markdown remains authoritative.',styles['small']),PageBreak(),Paragraph('Contents',styles['h1'])]
toc=TableOfContents();toc.levelStyles=[ParagraphStyle('toc',fontName='Read',fontSize=10,leading=14,textColor=INK,spaceBefore=5,rightIndent=22)]
story += [toc,PageBreak()]
chapter_pages=[]
for di,doc in enumerate(docs):
    if di:story.append(PageBreak())
    title=Paragraph('<a name="'+doc['id']+'"/>'+esc(doc['title']),styles['h1']);title.bookmark=doc['id'];title.outline=0;story.append(title)
    story.append(Paragraph(esc(doc['group']),styles['small']))
    tokens=doc['tokens'];i=0;quote=0;lists=[];bullet=None;first_heading=True
    while i<len(tokens):
        t=tokens[i];kind=t['type']
        if kind=='heading_open':
            level=int(t['tag'][1:]); text=inline(tokens[i+1],doc)
            if first_heading and level==1:
                story.append(Paragraph('<a name="'+t['pdfKey']+'"/>',styles['small']));first_heading=False
            else:
                p=Paragraph(text,styles['h2'] if level<=2 else styles['h3']);p.bookmark=t['pdfKey'];p.outline=1;story.append(p)
            i+=3;continue
        if kind=='blockquote_open':quote+=1
        elif kind=='blockquote_close':quote-=1
        elif kind in ('bullet_list_open','ordered_list_open'):
            attrs=t.get('attrs') or {};attrs=dict(attrs) if isinstance(attrs,list) else attrs;lists.append(None if kind=='bullet_list_open' else int(attrs.get('start',1)))
        elif kind in ('bullet_list_close','ordered_list_close'):lists.pop()
        elif kind=='list_item_open':
            if lists[-1] is None:bullet='• '
            else:bullet=str(lists[-1])+'. ';lists[-1]+=1
        elif kind=='paragraph_open':
            text=inline(tokens[i+1],doc)
            if bullet:text=bullet+text;bullet=None
            story.append(Paragraph(text,styles['quote'] if quote else styles['body']));i+=3;continue
        elif kind=='table_open':
            rows=[];row=[];j=i+1
            while tokens[j]['type']!='table_close':
                if tokens[j]['type']=='tr_open':row=[]
                elif tokens[j]['type']=='inline':row.append(inline(tokens[j],doc))
                elif tokens[j]['type']=='tr_close':rows.append(row)
                j+=1
            headers=rows[0]
            for row in rows[1:]:
                if not any(row):continue
                story.append(Paragraph(row[0] or 'Entry',styles['cardtitle']))
                for n,value in enumerate(row[1:],1):
                    if value.strip():story.append(Paragraph('<b>'+headers[n]+':</b> '+value,styles['card']))
                story.append(HRFlowable(width='100%',thickness=.35,color=HexColor('#d5dbe0'),spaceBefore=3,spaceAfter=4))
            i=j+1;continue
        elif kind in ('fence','code_block'):
            if t.get('info','').strip()=='mermaid':
                labels=dict(re.findall(r'(A\d+)\["([^"]+)"\]',t['content']))
                for line in t['content'].splitlines():
                    m=re.search(r'(A\d+)(?:\[.*?\])?\s*-->\s*(A\d+)',line)
                    if m:story.append(Paragraph(esc(labels.get(m[1],m[1])+' → '+labels.get(m[2],m[2])),styles['card']))
            else:story.append(Preformatted(norm(t['content']),styles['code'],maxLineLength=65))
        elif kind=='hr':story.append(HRFlowable(width='100%',thickness=.5,color=ACCENT,spaceBefore=8,spaceAfter=8))
        i+=1
Book(OUTPUT).multiBuild(story)
reader=PdfReader(OUTPUT);text='\n'.join(p.extract_text() or '' for p in reader.pages)
assert all(f'A{i:02}' in text for i in range(1,16))
report={'pages':len(reader.pages),'documents':len(docs),'bytes':OUTPUT.stat().st_size,'extracted_words':len(text.split()),'output':str(OUTPUT)}
(SCRATCH/'verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
