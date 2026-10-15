"""Illustrated edition: generated Vivid Ink artwork with editable PDF content.

The seven original page layouts supply the game data. Artwork is composed
directly into the PDF from unchanged source atlases; no raster edits are made.
"""

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.utils import ImageReader

import build as layout

ROOT = layout.ROOT
ASSETS = ROOT / 'character-sheets/assets/illustrated-v2'
MM, H = layout.MM, layout.H
SX, SY = 174 / 186, 228 / 238
TX = 18 - 12 * SX
TY = 39 - 43 * SY
PANEL = 'writing-panels-v2.png'
PANEL_CROPS = {
    'tile': (.032, .025, .437, .425),
    'ribbon': (.477, .095, .991, .385),
    'paper': (.017, .49, .484, .96),
    'divider': (.49, .643, .992, .79),
}


class IllustratedSheet(layout.Sheet):
    def __init__(self, theme):
        super().__init__(theme)
        self.readers = {}
        self.art_placements = []

    def source(self, filename):
        if filename not in self.readers:
            self.readers[filename] = ImageReader(str(ASSETS / filename))
        return self.readers[filename]

    def picture(self, filename, crop, x, y, w, h):
        """Place part of a source image using PDF clipping, preserving its alpha."""
        left, top, right, bottom = crop
        image_w, image_h = w / (right-left), h / (bottom-top)
        image_x, image_y = x - left*image_w, y - top*image_h
        self.c.saveState()
        path = self.c.beginPath()
        path.rect(x*MM, H-(y+h)*MM, w*MM, h*MM)
        self.c.clipPath(path, stroke=0)
        self.c.drawImage(self.source(filename), image_x*MM,
                         H-(image_y+image_h)*MM, image_w*MM, image_h*MM,
                         mask='auto')
        self.c.restoreState()
        self.art_placements.append(dict(page=self.c.getPageNumber(),source=filename,
                                         crop=crop,x=x,y=y,w=w,h=h))

    def image_frame(self, filename, crop, x, y, w, h, corner=3, inset=.15):
        """Compose a flexible illustrated frame while keeping corners proportional."""
        l,t,r,b=crop
        xs=[l,l+(r-l)*inset,r-(r-l)*inset,r]
        ys=[t,t+(b-t)*inset,b-(b-t)*inset,b]
        dx=[x,x+corner,x+w-corner,x+w]
        dy=[y,y+corner,y+h-corner,y+h]
        for row in range(3):
            for col in range(3):
                self.picture(filename,(xs[col],ys[row],xs[col+1],ys[row+1]),
                             dx[col],dy[row],dx[col+1]-dx[col],dy[row+1]-dy[row])

    def page_surround(self):
        self.picture(f"{self.t['id']}-border-v4.png",(0,0,1,1),0,0,210,297)

    def start(self,page,title,subtitle):
        self.c.bookmarkPage(f'page-{page}')
        self.c.addOutlineEntry(title,f'page-{page}',0)
        self.page_surround()
        self.text(f"FANTASY CRUX 2.0  /  {self.t['name'].upper()}",105,30,6.8,'Bold',self.accent,'center')
        self.text(title,105,36.8,19,'Display',layout.INK,'center')
        self.text(f'{page:02d} / 07',175,30,6,'Bold',self.accent,'center')
        if page>1:
            self.text('CHARACTER',22,30,5.2,'Bold',self.accent)
            # Header fields are already in physical page coordinates.
            layout.Sheet.field(self,f'page{page}.character',39,25.7,33,5,8)
            self.line(39,30.7,72,30.7,layout.LINE,.3)
        self.c.transform(SX,0,0,SY,TX*MM,H*(1-SY)-TY*MM)

    def field(self,name,x,y,w,h,size=10,multi=False,border=False,tooltip=None):
        super().field(name,TX+x*SX,TY+y*SY,w*SX,h*SY,size*min(SX,SY),multi,border,tooltip)

    def check(self,name,label,x,y,size=7.5):
        full=f"{self.t['id']}.{name}"
        xx,yy=TX+x*SX,TY+y*SY
        ss=3.3*min(SX,SY)
        self.c.acroForm.checkbox(name=full,tooltip=label,x=xx*MM,y=H-(yy+ss)*MM,
                                size=ss*MM,checked=False,buttonStyle='check',
                                borderWidth=.6,borderColor=self.accent,fillColor=colors.white,
                                textColor=layout.INK,annotationFlags='print',fieldFlags='')
        self.fields.append(dict(name=full,kind='check',page=self.c.getPageNumber(),x=xx,y=yy,w=ss,h=ss))
        if label:self.text(label,x+4.8,y+2.9,size)

    def frame(self,x,y,w,h,fill=None):
        kind='tile' if h<30 else 'paper'
        self.image_frame(PANEL,PANEL_CROPS[kind],x,y,w,h,2.1 if h<30 else 2.8,.13)

    def section(self,title,x,y,w):
        self.sections.append(dict(page=self.c.getPageNumber(),title=title,x=x,y=y,w=w))
        self.text(title.upper(),x+1,y+4.3,8,'Bold',self.accent)
        self.picture(PANEL,PANEL_CROPS['divider'],x+w-29,y-1,28,8)
        self.line(x+1,y+6,x+w-31,y+6,self.accent,.5)
        return y+8

    def portrait(self,x,y,w,h):
        index=['ironbound','wayfarer','starweaver','chronicle'].index(self.t['id'])
        crop=[(.01,.002,.497,.477),(.503,.003,.994,.48),
              (.007,.480,.498,.966),(.503,.486,.994,.965)][index]
        image_h=w*(crop[3]-crop[1])/(crop[2]-crop[0])
        image_y=y+(h-image_h)/2
        self.c.saveState()
        if self.t['id']=='starweaver':
            # The atlas has a red cloth tip from the frame above. Clip the
            # unused top gutter while preserving the crescent at its centre.
            path=self.c.beginPath()
            outline=[(0,.035),(.38,.035),(.38,0),(.64,0),(.64,.035),(1,.035),(1,1),(0,1)]
            path.moveTo((x+outline[0][0]*w)*MM,H-(image_y+outline[0][1]*image_h)*MM)
            for xx,yy in outline[1:]:path.lineTo((x+xx*w)*MM,H-(image_y+yy*image_h)*MM)
            path.close()
            self.c.clipPath(path,stroke=0)
        self.picture('portrait-frames-v2.png',crop,x,image_y,w,image_h)
        self.c.restoreState()
        self.text('PORTRAIT',x+w/2,image_y+image_h*.29,6.4,'Bold',self.accent,'center')
        self.sections.append(dict(page=1,title='Blank portrait',x=x,y=y,w=w,h=h))

    def resources(self,y):
        data=[('hp','HIT POINTS'),('pp','POWER POINTS'),('armour','ARMOUR'),('hero','HERO POINTS')]
        for i,(key,label) in enumerate(data):
            x=12+i*47.5
            self.text(label,x+22,y+2.2,7,'Bold',self.accent,'center')
            col,row=i%2,i//2
            self.picture('resource-emblems-v3.png',(col*.5,row*.5,(col+1)*.5,(row+1)*.5),x+3.5,y+6,37,37)
            if key in ('hp','pp'):
                self.field(f'resources.{key}.current',x+14,y+20,7,6,12)
                self.field(f'resources.{key}.maximum',x+23,y+20,7,6,12)
                self.text('/',x+22,y+25,10,color=layout.MUTED,align='center')
                self.text('NOW / MAX',x+22,y+28,4.9,'Bold',layout.MUTED,'center')
            else:
                self.field(f'resources.{key}',x+17,y+20,10,6,14)
                self.text('AP' if key=='armour' else 'UNSPENT',x+22,y+28,5.3,'Bold',layout.MUTED,'center')
            hint={'hp':'Max = (SIZ + CON) / 2','pp':'Max = POW; commitments on p5',
                  'armour':'Worn armour / protection','hero':'Start with 2'}[key]
            self.text(hint,x+22,y+46,5.4,color=layout.MUTED,align='center')

    def characteristics(self,y):
        labels=[('STR','Strength'),('CON','Constitution'),('DEX','Dexterity'),
                ('SIZ','Size'),('INT','Intelligence'),('POW','Power'),('CHA','Charisma')]
        w=(186-12)/7
        for i,(abbr,label) in enumerate(labels):
            x=12+i*(w+2)
            self.frame(x,y,w,23)
            self.text(abbr,x+w/2,y+5,10,'Bold',self.accent,'center')
            self.text(label,x+w/2,y+8.5,5.5,color=layout.MUTED,align='center')
            self.field(f'characteristics.{abbr}.permanent',x+3,y+10,w/2-4,6,13)
            self.field(f'characteristics.{abbr}.current',x+w/2+1,y+10,w/2-4,6,13)
            self.line(x+w/2,y+10,x+w/2,y+16,layout.LINE,.3)
            self.text('PERM.',x+w*.27,y+20,5.1,'Bold',layout.MUTED,'center')
            self.text('CURRENT',x+w*.72,y+20,5.1,'Bold',layout.MUTED,'center')

    def page1(self):
        self.start(1,"Character & combat",self.t['subtitle'])
        self.identity()
        if self.t['id'] in ('wayfarer','chronicle'):
            self.resources(104);self.characteristics(152)
        else:
            self.characteristics(104);self.resources(128)
        self.mini_stats([
            ('mwl','Major wound','maximum HP / 2'),('damage','Damage mod.','from STR + SIZ'),
            ('order','Combat order','add 1D10 in combat'),('movement','Movement','metres / round'),
            ('armour_enc','Armour ENC','deducted from order'),
        ],layout.M,176,layout.CW,19)
        self.text('Round attribute halves up. Combat Order = (DEX + INT) / 2 - armour ENC.',layout.M,200,6.6,color=layout.MUTED)
        y=self.section('Weapons & ready defences',layout.M,205,layout.CW)
        self.table('weapons',['Weapon / shield / unarmed','Skill %','Damage *','Size','Range','Hands / tags'],[64,20,29,19,22,32],layout.M,y,5,6)
        self.text('* Record final ordinary damage, including applicable DM and Talents.',layout.M,253,6.5,color=layout.MUTED)
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

    def area(self,name,title,x,y,w,h,ruled=True,grid=False,hint=None):
        super().area(name,title,x,y,w,h,False,grid,hint)

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

    def finish(self):
        result=super().finish()
        result['edition']='Illustrated v2'
        result['art_placements']=self.art_placements
        result['layout_transform']=dict(sx=SX,sy=SY,tx=TX,ty=TY)
        return result


def main():
    for folder in (layout.OUT,layout.WORK,layout.REVIEW):folder.mkdir(parents=True,exist_ok=True)
    results=[]
    for theme in layout.THEMES:
        theme=dict(theme,display='Display')
        m=IllustratedSheet(theme).finish()
        results.append(m)
        print(f"Illustrated {theme['name']}: {len(m['fields'])} fields, {len(m['art_placements'])} artwork placements")
    (layout.REVIEW/'manifest.json').write_text(json.dumps(results,indent=2)+'\n')


if __name__=='__main__':main()
