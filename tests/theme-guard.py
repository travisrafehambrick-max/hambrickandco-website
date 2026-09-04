#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ALLOWED = {
    "0F1115",
    "FBFBF9",
    "A98F45",
    "F4EFE0",
    "3A3F47",
    "5F646B",
    "F9ECEA",
    "913C35",
    "FFFFFF",
}

root = Path(__file__).resolve().parents[1]
files = [root / name for name in ("styles.css", "index.html", "favicon.svg", "scene.js")]
hexes = re.compile(r"#([0-9A-Fa-f]{3,8})\b")
fail = 0

for path in files:
    text = path.read_text()
    if path.name == "index.html":
        if "Source+Serif+4" not in text or "Hanken+Grotesk" not in text or "JetBrains+Mono" not in text:
            print(f"FAIL: {path.name} missing live font stack")
            fail = 1
        else:
            print(f"OK: {path.name} font stack")
    for match in hexes.finditer(text):
        raw = match.group(1).upper()
        if len(raw) in (3, 4):
            raw = "".join(ch * 2 for ch in raw)
        solid = raw[:6]
        if solid not in ALLOWED:
            print(f"FAIL: {path.name} invented hex #{match.group(1)}")
            fail = 1

if fail == 0:
    print("OK: public files stay on the measured live palette")

sys.exit(fail)
