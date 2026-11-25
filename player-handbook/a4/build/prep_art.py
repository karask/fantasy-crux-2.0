#!/usr/bin/env python3
"""Prepare page textures and faded art variants for the A4 handbook (output: build/img/).

Edge rule (same as the adventure booklet): an image is crisp only on the sides that bleed off
the trim; every side that meets text or paper fades out with a smooth, gently irregular mask.
  -T  banner: bleeds top/left/right, fades at the bottom
  -L  float on a left page edge: crisp left side, fades right/top/bottom
  -R  float on a right page edge: crisp right side, fades left/top/bottom
"""
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(HERE, "..", "..", "..", "art", "library", "subjects")
OUT = os.path.join(HERE, "img")
os.makedirs(OUT, exist_ok=True)
PAPER = np.array([238, 227, 203], np.float32)


def fractal(h, w, octaves=6, base=4, seed=0, persist=0.55):
    r = np.random.default_rng(seed)
    acc = np.zeros((h, w))
    amp = 1
    tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        small = r.random((max(2, int(n * h / max(h, w))) + 1, max(2, int(n * w / max(h, w))) + 1)).astype(np.float32)
        im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += amp * (np.asarray(im, np.float32) / 255 - 0.5)
        tot += amp
        amp *= persist
    return acc / tot


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def src(name):
    return os.path.join(LIB, name, "styles", "inked-adventure-comic-vivid.png")


def fade(name, out, sides, maxw=1500, width=0.20, crop=None, seed=1):
    im = Image.open(src(name)).convert("RGB")
    if crop:
        W, H = im.size
        im = im.crop((int(crop[0] * W), int(crop[1] * H), int(crop[2] * W), int(crop[3] * H)))
    if im.width > maxw:
        im = im.resize((maxw, int(im.height * maxw / im.width)), Image.LANCZOS)
    w, h = im.size
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    s = min(w, h)
    d = np.full((h, w), 9.0, np.float32)
    if "l" in sides: d = np.minimum(d, x / s)
    if "r" in sides: d = np.minimum(d, (w - 1 - x) / s)
    if "t" in sides: d = np.minimum(d, y / s)
    if "b" in sides: d = np.minimum(d, (h - 1 - y) / s)
    n = fractal(h, w, 3, 2, seed, 0.5)
    a = smooth(0.015, width, d + 0.06 * n)
    arr = np.asarray(im, np.float32)
    k = ((1 - a) ** 2)[..., None] * 0.5
    arr = arr * (1 - k) + PAPER * k
    Image.fromarray(np.dstack([arr, a * 255]).clip(0, 255).astype(np.uint8), "RGBA").save(os.path.join(OUT, out + ".png"), optimize=True)


def paper(seed, name, W=1750, H=2460):
    n = fractal(H, W, 7, 3, seed, 0.6)
    n2 = fractal(H, W, 5, 12, seed + 5, 0.5)
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = x / W, y / H
    vig = (u - 0.5) ** 2 * 1.6 + (v - 0.5) ** 2 * 1.1
    base = np.array([241, 231, 208], np.float32)
    dark = np.array([196, 170, 128], np.float32)
    t = np.clip(0.10 + 0.55 * n + 0.15 * n2 + vig * 0.9, 0, 1)[..., None] ** 1.6 * 0.65
    img = base * (1 - t) + dark * t + np.random.default_rng(seed).normal(0, 3.0, (H, W, 1))
    Image.fromarray(img.clip(0, 255).astype(np.uint8)).save(os.path.join(OUT, name + ".jpg"), quality=88)


def mist(w, h, seed, name, col=(150, 120, 80), alpha=0.32, flip=False):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = x / w, y / h
    if flip:
        u = 1 - u
    n = fractal(h, w, 6, 3, seed, 0.6)
    d = 1 - np.sqrt((u / 0.9) ** 2 + ((1 - v) / 0.9) ** 2)
    a = smooth(0.0, 0.6, d + 0.6 * n) * (0.55 + 0.9 * np.clip(n + 0.5, 0, 1))
    a = np.clip(a, 0, 1) * alpha
    img = np.zeros((h, w, 4), np.uint8)
    img[..., :3] = col
    img[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(img, "RGBA").save(os.path.join(OUT, name + ".png"))


if __name__ == "__main__":
    for i in range(2):
        paper(100 + i, f"paper{i}")
    mist(900, 700, 31, "mist-corner")
    mist(900, 700, 31, "mist-corner-r", flip=True)
    # cover and closing
    fade("female-warrior", "cover-art", "b", maxw=1254, width=0.30, seed=40)
    fade("storm-sea-watchtower", "closing", "t", maxw=1536, width=0.30, seed=41)
    # chapter banners
    banners = {"ch1": "consequences-at-the-gate", "ch2": "adventuring-company", "ch3": "encounter-scale",
               "ch4": "field-surgeon-under-fire", "ch5": "athletics-chasm-leap", "ch6": "weapons-field-sketch",
               "ch7": "rally-at-the-breach", "ch8": "fire-shaping", "lic": "copyright-scriptorium"}
    for k, v in banners.items():
        fade(v, k + "-T", "b", maxw=1536, width=0.30, seed=sum(map(ord, k)))
    # floats beside the rules they illustrate
    floats = ["shield-reaction", "grapple-reversal", "ranged-from-cover", "night-senses-stalking", "rope-rescue-fall",
              "mechanisms-trapwork", "armour-field-sketch", "ambusher-from-rafters", "ward-against-flame",
              "spirit-possession", "illusion-double", "ritual-company", "enchanted-sword-identification",
              "battle-command", "shared-rules-codex", "medieval-village"]
    for i, f in enumerate(floats):
        fade(f, f + "-L", "rtb", seed=i + 1)
        fade(f, f + "-R", "ltb", seed=i + 1)
    print("ok")
