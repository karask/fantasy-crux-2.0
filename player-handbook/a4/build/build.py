#!/usr/bin/env python3
"""Build the A4 Player's Handbook with DesignCraft.

  python3 build.py [chapter keys…]   lay out chapters (default: all), page numbers continuing
  python3 build.py --pdf             export each chapter as PDF/X-4 and merge into ../output/

Needs: pandoc, the DesignCraft CLI ($DESIGNCRAFT or ~/dc/target/release/designcraft-cli),
the booklet fonts installed (EB Garamond, Cinzel, Cinzel Decorative, IM FELL English SC),
and build/img/ from prep_art.py plus ../diagrams/*.png from diagrams.py + render_diagrams.mjs.
"""
import glob, json, math, os, re, shutil, subprocess, sys
import numpy as np
from PIL import Image

W = os.path.dirname(os.path.abspath(__file__))
A4 = os.path.dirname(W)
D = os.environ.get("DESIGNCRAFT", os.path.expanduser("~/dc/target/release/designcraft-cli"))
if not os.path.exists(D) and os.path.exists("/home/user/dc/target/release/designcraft-cli"):
    D = "/home/user/dc/target/release/designcraft-cli"
WORK = os.path.join(W, "work")
os.makedirs(WORK, exist_ok=True)
book = json.load(open(os.path.join(W, "book.json")))
COLW = (595.2755905511812 - 54 - 42 - 16) / 2
WIDE = COLW * 2 + 16


def last_json(t):
    return json.loads(t[:t.rfind("}") + 1])


def text(inl):
    out = []

    def walk(x):
        if isinstance(x, dict):
            if x.get("t") == "Str":
                out.append(x["c"])
            elif x.get("t") in ("Space", "SoftBreak"):
                out.append(" ")
            else:
                walk(x.get("c"))
        elif isinstance(x, list):
            for y in x:
                walk(y)
    walk(inl)
    return "".join(out)


def contents_table():
    st_p = os.path.join(WORK, "state.json")
    st = json.load(open(st_p)) if os.path.exists(st_p) else {}
    rows = ["| Chapter | Page |", "| --- | --- |"]
    for ch in book["chapters"][1:]:
        t = ch.get("title", {})
        name = (t.get("kicker", "") + ": " + t["text"]) if t.get("kicker", "").startswith("Chapter") else t.get("text", ch["key"])
        rows.append(f"| {name} | {st.get(ch['key'], {}).get('start', '–')} |")
    return "\n".join(rows)


def table_widths(ast, force_wide=False):
    """Column widths per table from cell text lengths; {{wide}} (or a panel) uses the full width."""
    tabs, wide_next = [], force_wide
    for b in ast["blocks"]:
        if b["t"] == "Para" and text(b["c"]).strip() == "{{wide}}":
            wide_next = True
            continue
        if b["t"] != "Table":
            continue
        c = b["c"]
        rows = [[text(cell[4]) for cell in r[1]] for r in c[3][1]]
        for body in c[4]:
            rows += [[text(cell[4]) for cell in r[1]] for r in body[3]]
        n = len(rows[0])
        total = (WIDE if wide_next else COLW) - 0.6
        L = [max(len(r[i]) for r in rows) for i in range(n)]
        avg = [sum(len(r[i]) for r in rows) / len(rows) for i in range(n)]
        wt = [max(math.sqrt(a + 4), 2.2) for a in avg]
        ws = [total * w / sum(wt) for w in wt]
        mins = [min(max(4.6 * min(lm, 16), 24), 110) for lm in L]
        for _ in range(6):
            ws = [max(w, m) for w, m in zip(ws, mins)]
            ws = [w * total / sum(ws) for w in ws]
        tabs.append({"rows": len(rows), "widths": [round(w, 1) for w in ws], "wide": wide_next})
        wide_next = force_wide
    return tabs


def md_to_docx(md_path, key):
    """Markdown -> docx for DesignCraft, plus table column widths and marker lists."""
    src = open(md_path).read()
    # Talent and Shaping metadata lines ("*3 IP · … · Passive*") get their own style.
    src = re.sub(r"^\*([^*\n]+ · [^*\n]+)\*$", lambda m: '::: {custom-style="Talent Meta"}\n' + m.group(1) + "\n:::", src, flags=re.M)
    if "{{contents}}" in src:
        src = src.replace("{{contents}}", contents_table())
    # {{panel:name}} … {{/panel}}: full-width blocks laid out in their own frame (see gen.py)
    panels = {}
    for name, body in re.findall(r"^\{\{panel:([a-z0-9-]+)\}\}\n(.*?)^\{\{/panel\}\}\n?", src, flags=re.M | re.S):
        pm = os.path.join(WORK, f"{key}_panel_{name}.md")
        open(pm, "w").write(body)
        pd = pm[:-3] + ".docx"
        subprocess.run(["pandoc", pm, "-o", pd], check=True)
        past = json.loads(subprocess.run(["pandoc", pm, "-t", "json"], capture_output=True, text=True, check=True).stdout)
        json.dump(table_widths(past, True), open(pd + ".tables.json", "w"))
        panels[name] = pd
    src = re.sub(r"^\{\{panel:[a-z0-9-]+\}\}\n.*?^\{\{/panel\}\}\n?", "", src, flags=re.M | re.S)
    tmp = os.path.join(WORK, key + ".md")
    open(tmp, "w").write(src)
    docx = os.path.join(WORK, key + ".docx")
    subprocess.run(["pandoc", tmp, "-o", docx], check=True)
    ast = json.loads(subprocess.run(["pandoc", tmp, "-t", "json"], capture_output=True, text=True, check=True).stdout)
    tabs = table_widths(ast)
    json.dump(tabs, open(docx + ".tables.json", "w"))
    figs = re.findall(r"^\{\{fig:([a-z0-9-]+)\}\}$", src, flags=re.M)
    return docx, figs, src.count("{{wide}}"), panels


def build_chapter(ch, start):
    key = ch["key"]
    docx, figs, nwide, panels = md_to_docx(os.path.join(A4, "content", ch["md"]), key)
    cfg = dict(ch, startPage=start, out="work/ch_" + key, docx=docx, figures=figs, wideCount=nwide, panelDocx=panels)
    p = os.path.join(WORK, "cfg_" + key + ".json")
    json.dump(cfg, open(p, "w"))
    subprocess.run(["python3", os.path.join(W, "gen.py"), p], check=True, stdout=subprocess.DEVNULL)
    dcs, out = os.path.join(W, cfg["out"] + ".dcs"), os.path.join(W, cfg["out"] + ".designcraft")
    res = subprocess.run([D, "script", dcs, "--save", out], capture_output=True, text=True).stdout
    d = last_json(res)
    if d.get("error"):
        print("FAIL", key, d.get("failedIndex"), d.get("failedCommand"), d["error"][:300])
        sys.exit(1)
    ins = d["results"][-1]
    n = ins["pageCount"]
    # autoflow may leave blank trailing pages: drop pages from the end while the story still fits
    keep = n
    floor = max([1] + [p["page"] for p in ch.get("panels", {}).values()] + [i["page"] for i in ch.get("images", []) if i.get("keep")])
    while keep > floor and not ch.get("keepLast") and not ch.get("pages"):
        trial = out[:-len(".designcraft")] + "_trial.designcraft"
        r = subprocess.run([D, "script", "-", "--in", out, "--save", trial],
                           input='layout.pages.delete {"pages": [%d]}\ndocument.inspect {}\n' % (keep - 1), capture_output=True, text=True).stdout
        dj = last_json(r)
        ti = (dj.get("results") or [{}])[-1] if not dj.get("error") else None
        if not ti or "stories" not in ti or any(s.get("overset") and s["length"] > 5 for s in ti["stories"]):
            if os.path.exists(trial):
                os.remove(trial)
            break
        shutil.move(trial, out)
        ins, keep = ti, keep - 1
    over = [s["id"] for s in ins["stories"] if s.get("overset") and s["length"] > 5]
    print(f"{key}: pages {start}-{start + keep - 1} ({keep}){' OVERSET ' + str(over) if over else ''}")
    return keep


def export():
    pdfs = []
    for ch in book["chapters"]:
        src = os.path.join(WORK, "ch_" + ch["key"] + ".designcraft")
        pdf = os.path.join(WORK, "ch_" + ch["key"] + ".pdf")
        r = subprocess.run([D, "script", "-", "--in", src], input='file.exportPdf {"path": "%s", "standard": "x4", "bleed": false}\n' % pdf,
                           capture_output=True, text=True).stdout
        d = last_json(r)
        if d.get("error"):
            print("EXPORT FAIL", ch["key"], d["error"][:300])
            sys.exit(1)
        pdfs.append(pdf)
    from pypdf import PdfWriter
    # start from the first chapter so its PDF/X-4 output intent, XMP and info stay at the root
    w = PdfWriter(clone_from=pdfs[0])
    for p in pdfs[1:]:
        w.append(p)
    os.makedirs(os.path.join(A4, "output"), exist_ok=True)
    full = os.path.join(WORK, "handbook-full.pdf")
    w.write(full)
    print("merged", full)


if __name__ == "__main__":
    if sys.argv[1:] == ["--pdf"]:
        export()
        sys.exit()
    only = sys.argv[1:]
    state_p = os.path.join(WORK, "state.json")
    state = json.load(open(state_p)) if os.path.exists(state_p) else {}
    start = 1
    for ch in book["chapters"]:
        k = ch["key"]
        if only and k not in only and k in state and state[k]["start"] == start:
            start += state[k]["pages"]
            continue
        n = build_chapter(ch, start)
        state[k] = {"start": start, "pages": n}
        start += n
    json.dump(state, open(state_p, "w"), indent=1)
    print("total pages", start - 1)
