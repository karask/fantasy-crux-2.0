#!/usr/bin/env python3
"""Rules diagrams for the A4 Player's Handbook.

One visual language for every diagram, matching the booklet's palette and type:
Cinzel labels, EB Garamond text, ink/oxblood/gold/teal on transparent paper.
Each diagram states only what the text beside it states. Output: ../diagrams/*.svg
(render.mjs turns them into print PNGs with the real fonts).
"""
import os
from html import escape

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "diagrams")
W = 480  # viewBox width; placed at column width (241.6 pt), so 1 pt ~ 2 units
INK, OX, GOLD, TEAL, MIST, VEL = "#2b2018", "#7b2a1a", "#a07a35", "#2c4c55", "#e4d6b6", "#f3ead6"
SAGE, ROSE, SKY = "#dfe3cf", "#efd2c4", "#d5e0e0"
SERIF, CAPS = "EB Garamond", "Cinzel"


class D:
    def __init__(self, h):
        self.h = h
        self.s = []

    def rect(self, x, y, w, h, fill=VEL, stroke=INK, sw=1.4, r=5, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')

    def t(self, x, y, s, size=17, font=SERIF, fill=INK, anchor="start", weight=400, italic=False, spacing=0):
        st = ' font-style="italic"' if italic else ""
        ls = f' letter-spacing="{spacing}"' if spacing else ""
        self.s.append(f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{st}{ls}>{s}</text>')

    def lines(self, x, y, rows, size=16, lead=None, **k):
        lead = lead or size * 1.2
        for i, r in enumerate(rows):
            self.t(x, y + i * lead, r, size, **k)

    def line(self, x1, y1, x2, y2, c=INK, sw=1.6, dash=None, arrow=False):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        m = ' marker-end="url(#ah)"' if arrow else ""
        self.s.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{sw}"{d}{m}/>')

    def path(self, d, fill="none", stroke=INK, sw=1.6, arrow=False, dash=None):
        m = ' marker-end="url(#ah)"' if arrow else ""
        da = f' stroke-dasharray="{dash}"' if dash else ""
        self.s.append(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{m}{da}/>')

    def circle(self, x, y, r, fill=INK, stroke="none", sw=1.4):
        self.s.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')

    def head(self, x, y, w, label, fill=INK, color=VEL, h=24, size=13):
        """A dark title band on top of a card."""
        self.s.append(f'<path d="M{x} {y+h} V{y+5} a5 5 0 0 1 5 -5 H{x+w-5} a5 5 0 0 1 5 5 V{y+h} Z" fill="{fill}"/>')
        self.t(x + 10, y + h - 7.5, label, size, CAPS, color, weight=700, spacing=1)

    def card(self, x, y, w, h, label, rows, fill=VEL, hfill=INK, size=15.5):
        self.rect(x, y, w, h, fill)
        self.head(x, y, w, label, hfill)
        self.lines(x + 10, y + 44, rows, size)

    def die(self, x, y, n, kind="d10", fill=VEL, size=30):
        r = size / 2
        if kind == "d10":
            pts = f"{x},{y-r} {x+r*0.92},{y-r*0.15} {x},{y+r} {x-r*0.92},{y-r*0.15}"
        else:
            pts = f"{x-r},{y-r} {x+r},{y-r} {x+r},{y+r} {x-r},{y+r}"
        self.s.append(f'<polygon points="{pts}" fill="{fill}" stroke="{INK}" stroke-width="1.6" stroke-linejoin="round"/>')
        self.t(x, y + 6, str(n), 18, SERIF, INK, "middle", 700)

    def svg(self):
        defs = (f'<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
                f'<path d="M0 0 L10 5 L0 10 z" fill="{INK}"/></marker></defs>')
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {self.h}" width="{W}" height="{self.h}">'
                + defs + "".join(self.s) + "</svg>")


def save(name, d, alt):
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, name + ".svg"), "w").write(d.svg())
    ALTS[name] = alt


ALTS = {}

# ------------------------------------------------------------------ d100
def d100():
    d = D(160)
    d.t(0, 16, "READ THE DICE", 13, CAPS, TEAL, weight=700, spacing=1.5)
    d.die(22, 46, 5); d.die(62, 46, 9)
    d.t(22, 80, "tens", 14, italic=True, anchor="middle"); d.t(62, 80, "units", 14, italic=True, anchor="middle")
    d.line(88, 46, 112, 46, arrow=True)
    d.t(120, 56, "59", 30, SERIF, INK, weight=700)
    d.t(176, 40, "A tens 0 gives one digit: 07.", 15, italic=True)
    d.t(176, 60, "Double zero reads 100.", 15, italic=True)
    x0, y0 = 0, 112
    d.t(x0, 104, "GRADES AT SKILL 60%", 13, CAPS, TEAL, weight=700, spacing=1.5)
    segs = [("Critical", "01–06", 86, TEAL, VEL), ("Success", "07–60", 190, SKY, INK), ("Failure", "61–98", 120, MIST, INK), ("Fumble", "99–00", 84, OX, VEL)]
    x = x0
    for name, rng, w, fill, col in segs:
        d.rect(x, y0, w, 46, fill, INK, 1.2, 0)
        d.t(x + w / 2, y0 + 19, name.upper(), 12, CAPS, col, "middle", 700, spacing=0.5)
        d.t(x + w / 2, y0 + 38, rng, 15, SERIF, col, "middle")
        x += w
    save("d100", d, "Tens die 5 and units die 9 read 59. With skill 60%: 01 to 06 Critical, 07 to 60 Success, 61 to 98 Failure, 99 and 00 Fumble.")


# ------------------------------------------------------------------ bonus / penalty
def bonus():
    d = D(190)
    d.die(24, 34, 5, fill=MIST); d.t(24, 68, "units", 13, italic=True, anchor="middle")
    d.die(70, 34, 2); d.die(108, 34, 6); d.t(89, 68, "two tens dice", 13, italic=True, anchor="middle")
    d.line(132, 34, 156, 34, arrow=True)
    d.t(164, 43, "25  or  65", 26, SERIF, INK, weight=700)
    for i, (sk, r25, r65, b, p, note) in enumerate([
        ("SKILL 70%", "Success", "Success", "65", "25", "Both succeed: higher is better."),
        ("SKILL 60%", "Success", "Failure", "25", "65", "A success beats a failure."),
    ]):
        x = i * 245
        d.rect(x, 86, 235, 100)
        d.head(x, 86, 235, sk, TEAL)
        d.t(x + 10, 130, f"25 {r25.lower()}, 65 {r65.lower()}", 15.5)
        d.t(x + 10, 152, "+1B keeps", 15.5); d.t(x + 92, 152, b, 17, weight=700, fill=TEAL)
        d.t(x + 125, 152, "−1P keeps", 15.5); d.t(x + 205, 152, p, 17, weight=700, fill=OX)
        d.t(x + 10, 176, note, 14.5, italic=True)
    save("bonus", d, "Units 5 with tens 2 and 6 gives 25 or 65. At 70% both succeed: a Bonus die keeps 65, a Penalty die 25. At 60% only 25 succeeds: a Bonus die keeps 25, a Penalty die 65.")


# ------------------------------------------------------------------ pools
def pools():
    d = D(84)
    for i, (n, v, note) in enumerate([("Resistance", 50, "Dodge, Persistence…"), ("Combat", 50, "Close, Ranged…"), ("Knowledge", 50, "Lore, Language…"), ("Practical", 75, "Athletics, Healing…")]):
        x = i * 121
        d.rect(x, 2, 114, 80)
        d.head(x, 2, 114, n.upper(), TEAL, size=11.5)
        d.t(x + 57, 58, str(v), 30, SERIF, INK, "middle", 700)
        d.t(x + 57, 76, note, 12.5, italic=True, anchor="middle")
    save("pools", d, "Four skill point pools: Resistance 50, Combat 50, Knowledge 50, Practical 75.")


# ------------------------------------------------------------------ round costs
def round_costs():
    rows = [("Attack, aim, cast, use a skill", "Used", "Kept", "Kept"),
            ("Move, stand, ready an item", "Kept", "Used", "Kept"),
            ("Withdraw", "Used", "Used", "Kept"),
            ("Sprint (2× Movement)", "Used", "Used", "Dodge only"),
            ("Charge", "Used", "Used", "None"),
            ("Reload light crossbow", "Kept", "Used", "Base used"),
            ("Reload heavy crossbow", "Used", "Used", "None"),
            ("Stabilise someone", "Used", "Used", "None")]
    d = D(56 + 27 * len(rows))
    cx = [262, 334, 410]
    for x, h in zip(cx, ["Combat", "Movement", "Reactions"]):
        d.t(x + 34, 16, h, 15, SERIF, TEAL, "middle", 700)
    d.t(cx[0] + 34, 31, "action", 12.5, italic=True, anchor="middle")
    d.t(cx[1] + 34, 31, "action", 12.5, italic=True, anchor="middle")
    d.t(cx[2] + 34, 31, "", 12)
    col = {"Used": (MIST, INK), "Kept": (SKY, TEAL), "Dodge only": ("#ecd9a8", INK), "Base used": ("#ecd9a8", INK), "None": (ROSE, OX)}
    for i, (lab, *cells) in enumerate(rows):
        y = 44 + i * 27
        if i % 2 == 0:
            d.rect(0, y - 2, W, 26, "#efe5cf", "none", 0, 3)
        d.t(4, y + 17, lab, 15.5)
        for x, c in zip(cx, cells):
            f, tc = col[c]
            d.rect(x, y + 1, 68, 20, f, tc, 1, 10)
            d.t(x + 34, y + 16, c, 13, SERIF, tc, "middle", 600)
    save("round", d, "What each option costs: Combat Action, Movement Action and Reactions, from a normal attack to stabilising someone.")


# ------------------------------------------------------------------ parry size
def parry():
    d = D(132)
    sizes = ["Light", "Medium", "Heavy", "Huge"]
    for i, s in enumerate(sizes):
        x = i * 120
        d.rect(x + 6, 6, 108, 30, [VEL, MIST, "#d9c49b", "#c9ad7c"][i], INK, 1.2, 15)
        d.t(x + 60, 27, s.upper(), 13, CAPS, INK, "middle", 700, spacing=1)
        if i < 3:
            d.line(x + 114, 21, x + 126, 21, arrow=True)
    d.t(0, 64, "Your parrying item compared with the attacking weapon:", 15, italic=True)
    for i, (lab, res, fill, tc) in enumerate([("Same Size or larger", "blocks ALL", SKY, TEAL), ("One Size smaller", "blocks HALF", "#ecd9a8", INK), ("Two or more smaller", "blocks NONE", ROSE, OX)]):
        x = i * 160
        d.rect(x, 74, 152, 54, fill, tc, 1.2)
        d.t(x + 76, 96, lab, 14.5, SERIF, INK, "middle")
        d.t(x + 76, 118, res, 15, CAPS, tc, "middle", 700)
    save("parry", d, "Sizes run Light, Medium, Heavy, Huge. A winning Parry with an item of the same Size or larger blocks all damage, one Size smaller blocks half, two or more smaller blocks none.")


# ------------------------------------------------------------------ damage steps
def damage():
    steps = [("ROLL", "dice + DM"), ("PARRY", "by Size"), ("ARMOUR", "minus AP"), ("RESERVE", "if any"), ("HP", "lose the rest")]
    d = D(150)
    bw, gap = 84, 12
    for i, (a, b) in enumerate(steps):
        x = i * (bw + gap)
        d.rect(x, 40, bw, 56, VEL if i < 4 else ROSE, INK if i < 4 else OX)
        d.head(x, 40, bw, a, INK if i < 4 else OX, size=12)
        d.t(x + bw / 2, 86, b, 14.5, SERIF, INK, "middle")
        if i < 4:
            d.line(x + bw + 1, 68, x + bw + gap - 1, 68, arrow=True)
    # critical path
    d.path(f"M{bw/2} 38 V18 H{3*(bw+gap)+bw/2-6} V36", stroke=OX, sw=1.6, dash="5 4", arrow=True)
    d.t(W / 2 - 40, 12, "CRITICAL HIT: maximum damage, skips Parry and armour", 11, CAPS, OX, "middle", 700)
    d.t(0, 122, "One hit ≥ MWL after armour: Major Wound.", 15, italic=True)
    d.t(0, 142, "At 0 HP: unconscious and Dying.", 15, italic=True)
    save("damage", d, "Damage: roll dice plus DM, apply a winning Parry by Size, subtract armour, then any magical reserve; the rest is lost from HP. A critical hit deals maximum damage and skips Parry and armour.")


# ------------------------------------------------------------------ charge & set
def moves():
    d = D(166)
    d.t(0, 16, "CHARGE", 13, CAPS, OX, weight=700, spacing=1.5)
    # attacker, path, target
    d.circle(14, 60, 9, OX)
    d.line(26, 60, 330, 60, OX, 2.2, "8 5", arrow=True)
    d.circle(350, 60, 9, TEAL)
    d.t(178, 50, "straight, clear line: at least 5 m, at most 2× Movement", 14, italic=True, anchor="middle")
    d.t(178, 82, "hit: +1D6 damage · no Reactions this round", 14, SERIF, OX, "middle", 600)
    d.t(350, 92, "target", 13, italic=True, anchor="middle")
    d.t(0, 116, "SET WEAPON", 13, CAPS, TEAL, weight=700, spacing=1.5)
    d.circle(20, 140, 9, OX)
    d.line(32, 140, 150, 140, OX, 2.2, "8 5", arrow=True)
    d.t(20, 160, "charger", 13, italic=True, anchor="middle")
    d.line(236, 140, 166, 140, TEAL, 3)
    d.path("M160 140 l10 -6 v12 z", fill=TEAL, stroke=TEAL)
    d.circle(248, 140, 9, TEAL)
    d.t(248, 160, "braced", 13, italic=True, anchor="middle")
    d.t(272, 136, "strikes first at +1B,", 14.5, SERIF, TEAL, weight=600)
    d.t(272, 154, "before the Charge attack", 14.5, SERIF, TEAL, weight=600)
    save("moves", d, "Charge: a straight clear run of at least 5 m and at most twice Movement ends adjacent; a hit adds 1D6 and the charger has no Reactions. A braced Set weapon attacks a charger first at +1B.")


# ------------------------------------------------------------------ grapple
def grapple():
    d = D(318)
    d.card(0, 0, 230, 92, "1 · SEIZE", ["Combat Action.", "Roll Unarmed Combat."])
    d.card(250, 0, 230, 92, "2 · TARGET DEFENDS", ["Dodge or Parry (one Reaction),", "or you just need a success."], hfill=GOLD)
    d.line(230, 46, 248, 46, arrow=True)
    d.line(365, 92, 365, 112, arrow=True)
    d.t(372, 108, "you win", 13, italic=True)
    d.card(0, 114, 230, 110, "NO HOLD", ["Your hands stay free.", "Beaten by a weapon Parry:", "you take 1 HP, no armour."], fill=ROSE, hfill=OX)
    d.path("M300 92 V100 H115 V112", arrow=True, stroke=OX)
    d.t(150, 108, "you lose", 13, italic=True, fill=OX)
    d.card(250, 114, 230, 110, "3 · HOLD", ["Nobody takes Movement.", "Both −1P on every test.", "Fight only unarmed or with", "a Light one-handed weapon."], fill=SKY, hfill=TEAL)
    d.line(365, 224, 365, 244, arrow=True)
    d.card(0, 246, 480, 70, "4 · ESCAPE OR RELEASE", ["Held: Combat Action, win Unarmed vs Unarmed.  Holder: let go on your turn."])
    save("grapple", d, "Grappling: seize with a Combat Action and Unarmed Combat; the target may Dodge or Parry. Lose and your hands stay free, taking 1 HP if beaten by a weapon Parry. Win and you hold: no Movement, both at −1P, only unarmed or Light one-handed weapons. Escape with a Combat Action and opposed Unarmed Combat.")


# ------------------------------------------------------------------ range
def rng():
    d = D(104)
    d.circle(10, 40, 8, INK)
    x0, x1, x2 = 30, 270, 440
    d.rect(x0, 26, x1 - x0, 30, SKY, TEAL, 1.2, 0)
    d.rect(x1, 26, x2 - x1, 30, "#ecd9a8", INK, 1.2, 0)
    d.rect(x2, 26, W - x2 - 2, 30, ROSE, OX, 1.2, 0, "4 3")
    d.t((x0 + x1) / 2, 47, "NORMAL", 13, CAPS, TEAL, "middle", 700, spacing=1)
    d.t((x1 + x2) / 2, 47, "−2P", 15, CAPS, INK, "middle", 700)
    d.t((x2 + W) / 2, 47, "NO", 12, CAPS, OX, "middle", 700)
    for x, l in [(x0, "0"), (x1, "R"), (x2, "2R")]:
        d.line(x, 58, x, 66)
        d.t(x, 82, l, 15, SERIF, INK, "middle", 700)
    d.t(x0, 100, "Shortbow: R = 75 m, so −2P out to 150 m.", 14.5, italic=True)
    d.t(10, 16, "you", 13, italic=True, anchor="middle")
    save("range", d, "Range bands: up to the weapon's Range R attack normally, beyond R up to twice R at −2P, beyond twice R no hit. A shortbow has R 75 m.")


# ------------------------------------------------------------------ dying
def dying():
    d = D(96)
    items = [("0 HP", ["Unconscious", "and Dying"], OX, ROSE), ("ROUND 1", ["Stabilise", "now…"], INK, VEL), ("ROUND 2", ["…or now…"], INK, VEL), ("END OF ROUND 3", ["Still Dying:", "you die."], OX, ROSE)]
    ws = [100, 100, 100, 150]
    x = 0
    for (h, rows, hf, f), w in zip(items, ws):
        d.rect(x, 4, w, 88, f, hf)
        d.head(x, 4, w, h, hf, size=12)
        d.lines(x + 10, 52, rows, 15.5, 19)
        if x + w < W - 5:
            d.line(x + w + 1, 50, x + w + 9, 50, arrow=True)
        x += w + 10
    save("dying", d, "At 0 HP you are unconscious and Dying. Stabilise before the end of the third round or you die.")


# ------------------------------------------------------------------ fatigue
def fatigue():
    d = D(120)
    st = [("FRESH", "no penalty", VEL, INK), ("FATIGUED", "−1P · ¾ move · −3", "#ecd9a8", GOLD), ("EXHAUSTED", "−2P · ½ move · −6", ROSE, OX)]
    for i, (h, b, f, c) in enumerate(st):
        x = i * 165
        d.rect(x, 30, 150, 58, f, c)
        d.head(x, 30, 150, h, c, size=12)
        d.t(x + 75, 78, b, 14.5, SERIF, INK, "middle")
        if i < 2:
            d.line(x + 151, 60, x + 163, 60, arrow=True)
            d.t(x + 157, 20, "fail" if i == 0 else "fail at −1P", 13, italic=True, anchor="middle", fill=OX)
    d.path("M405 90 V106 H75 V92", stroke=TEAL, arrow=True)
    d.t(240, 102, "rest 20 − CON hours (minimum 1)", 13.5, italic=True, anchor="middle", fill=TEAL)
    save("fatigue", d, "Fatigue: failing a Resilience test makes a fresh character Fatigued (−1P, three-quarter Movement, −3 Combat Order); failing again at −1P makes them Exhausted (−2P, half Movement, −6). Rest 20 − CON hours to recover.")


# ------------------------------------------------------------------ light
def light():
    d = D(104)
    d.path("M12 54 q-8 -12 0 -26 q8 14 0 26 z", fill="#d98a2b", stroke=OX, sw=1)
    bands = [("Lit", "no penalty", "#f6e7b8", INK, 64), ("Partial dark", "−1P", "#d8c7a0", INK, 128), ("Darkness", "−2P · ½ move", "#7d7366", VEL, 128), ("Pitch black", "no sight · ¼ move", INK, VEL, 134)]
    x = 26
    for name, eff, f, c, w in bands:
        d.rect(x, 20, w, 44, f, INK, 1, 0)
        d.t(x + w / 2, 38, name.upper(), 11, CAPS, c, "middle", 700)
        d.t(x + w / 2, 56, eff, 13.5, SERIF, c, "middle")
        x += w
    for x, l in [(90, "radius"), (218, "×3"), (346, "×5")]:
        d.line(x, 64, x, 72)
        d.t(x, 86, l, 14, SERIF, INK, "middle", 700)
    d.t(26, 102, "Torch: lit to 3 m, partial to 9 m, dark to 15 m.", 14.5, italic=True)
    save("light", d, "Light bands from a source: Illuminated within its radius, partial darkness to three times it, Darkness to five times it, pitch black beyond. A torch lights 3 m.")


# ------------------------------------------------------------------ magnitude formula
def formula():
    d = D(124)
    parts = [("INTENSITY", "2", "how strong"), ("RANGE", "1", "how far"), ("DURATION", "0", "how long"), ("REACH", "0", "how many"), ("ADJUST", "+0", "extras")]
    bw = 70
    for i, (h, v, s) in enumerate(parts):
        x = i * (bw + 12)
        d.rect(x, 8, bw, 62)
        d.t(x + bw / 2, 26, h, 10.5, CAPS, TEAL, "middle", 700)
        d.t(x + bw / 2, 58, v, 28, SERIF, INK, "middle", 700)
        d.t(x + bw / 2, 88, s, 13.5, italic=True, anchor="middle")
        d.t(x + bw + 6, 46, "+" if i < 4 else "=", 20, SERIF, INK, "middle", 700)
    x = 5 * (bw + 12)
    d.rect(x, 8, 64, 62, "#ecd9a8", OX, 2)
    d.t(x + 32, 26, "M", 12, CAPS, OX, "middle", 700)
    d.t(x + 32, 58, "3", 30, SERIF, OX, "middle", 700)
    d.t(x + 32, 88, "PP cost", 13.5, italic=True, anchor="middle")
    d.t(0, 116, "Firebolt: Unmake·Fire, 2D6 harm at 15 m, one target, instant.", 14.5, italic=True)
    save("formula", d, "Magnitude is Intensity plus Range plus Duration plus Reach plus adjustments. A 2D6 firebolt at 15 m: 2 + 1 + 0 + 0 = M3.")


# ------------------------------------------------------------------ harm delivery
def harm():
    d = D(150)
    for i, (h, f, hf, rows) in enumerate([("PROJECTED", SKY, TEAL, ["Crosses space. No extra M.", "Dodge or shield −1P;", "cover and armour count."]),
                                          ("DIRECT  +1 M", ROSE, OX, ["Arises inside the target.", "Resilience or Persistence;", "only magical Wards count."])]):
        x = i * 245
        d.rect(x, 0, 235, 148, f, hf)
        d.head(x, 0, 235, h, hf)
        cy = 52
        d.circle(x + 24, cy, 8, INK); d.rect(x + 18, cy + 8, 12, 18, INK, INK, 0, 3)
        d.circle(x + 206, cy, 8, INK); d.rect(x + 200, cy + 8, 12, 18, INK, INK, 0, 3)
        if i == 0:
            d.line(x + 40, cy + 10, x + 176, cy + 10, OX, 2, "3 4")
            d.path(f"M{x+176} {cy+10} q8 -10 14 0 q-6 10 -14 0 z", fill="#d98a2b", stroke=OX, sw=1)
            d.rect(x + 186, cy - 2, 6, 26, GOLD, INK, 1, 2)
        else:
            d.line(x + 40, cy + 10, x + 180, cy + 10, INK, 1, "1 5")
            d.circle(x + 206, cy + 16, 7, "#d98a2b", OX)
        d.lines(x + 10, 102, rows, 14.5, 17)
    save("harm", d, "Projected harm crosses space: Dodge or shield at −1P, cover and armour apply, no extra cost. Direct harm costs +1 M and arises inside the target, which resists with Resilience or Persistence; only magical Wards protect.")


# ------------------------------------------------------------------ active magnitude
def active():
    d = D(100)
    d.t(0, 16, "INT 13 = ACTIVE LIMIT 13", 13, CAPS, TEAL, weight=700, spacing=1)
    scale = 30
    x = 0
    for lab, m, f in [("Ward", 4, SKY), ("Flight", 4, "#ecd9a8"), ("Summon", 4, SAGE)]:
        d.rect(x, 26, m * scale, 34, f, INK, 1.2, 0)
        d.t(x + m * scale / 2, 48, f"{lab} M{m}", 14, SERIF, INK, "middle", 600)
        x += m * scale
    d.rect(x, 26, 3 * scale, 34, ROSE, OX, 1.4, 0, "4 3")
    d.t(x + 2.1 * scale, 48, "M3?", 14, SERIF, OX, "middle", 700)
    d.line(13 * scale, 20, 13 * scale, 66, OX, 2.4)
    d.t(13 * scale - 4, 80, "limit", 13, italic=True, anchor="end", fill=OX)
    d.t(0, 96, "12 fits. Another ongoing M3 makes 15: dismiss one first.", 14.5, italic=True)
    save("active", d, "With INT 13, an M4 Ward, M4 flight and M4 summon total 12 and fit. Another ongoing M3 would make 15, over the limit.")


for f in (d100, bonus, pools, round_costs, parry, damage, moves, grapple, rng, dying, fatigue, light, formula, harm, active):
    f()
import json
json.dump(ALTS, open(os.path.join(OUT, "alt.json"), "w"), indent=1)
print(len(ALTS), "diagrams")
