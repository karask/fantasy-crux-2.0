#!/usr/bin/env python3
"""Render every page to work/pages/pNNN.png and spreads to work/spreads/ for review."""
import glob, json, os, shutil, subprocess, sys
from PIL import Image
W = os.path.dirname(os.path.abspath(__file__))
D = os.environ.get("DESIGNCRAFT", os.path.expanduser("~/dc/target/release/designcraft-cli"))
if not os.path.exists(D) and os.path.exists("/home/user/dc/target/release/designcraft-cli"):
    D = "/home/user/dc/target/release/designcraft-cli"
S = sys.argv[1] if len(sys.argv) > 1 else "0.5"
only = sys.argv[2:]
st = json.load(open(os.path.join(W, "work", "state.json")))
P = os.path.join(W, "work", "pages"); os.makedirs(P, exist_ok=True)
total = max(v["start"] + v["pages"] - 1 for v in st.values())
for f in glob.glob(P + "/p*.png"):
    if int(os.path.basename(f)[1:4]) > total: os.remove(f)
for k, v in st.items():
    if only and k not in only: continue
    tmp = os.path.join(W, "work", "tmp_" + k); shutil.rmtree(tmp, ignore_errors=True)
    subprocess.run([D, "run", "--in", os.path.join(W, "work", f"ch_{k}.designcraft"), "--scale", S, "--all-pages", tmp + "/"], capture_output=True)
    for i, f in enumerate(sorted(glob.glob(tmp + "/*.png"))):
        shutil.move(f, os.path.join(P, f"p{v['start'] + i:03d}.png"))
    shutil.rmtree(tmp)
fs = sorted(glob.glob(P + "/p*.png"))
SP = os.path.join(W, "work", "spreads"); shutil.rmtree(SP, ignore_errors=True); os.makedirs(SP)
n = len(fs)
pairs = [(1, None)] + [(i, i + 1 if i + 1 <= n else None) for i in range(2, n + 1, 2)]
for a, b in pairs:
    ims = [Image.open(f"{P}/p{a:03d}.png")] + ([Image.open(f"{P}/p{b:03d}.png")] if b else [])
    w, h = ims[0].size
    out = Image.new("RGB", (w * len(ims), h), "white")
    for i, im in enumerate(ims): out.paste(im.convert("RGB"), (i * w, 0))
    out.save(f"{SP}/{a:02d}" + (f"-{b:02d}" if b else "") + ".jpg", quality=85)
print(len(fs), "pages")
